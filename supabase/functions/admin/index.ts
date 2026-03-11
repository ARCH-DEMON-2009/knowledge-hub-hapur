import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

const jsonHeaders = { ...corsHeaders, "Content-Type": "application/json" };

const allowedTables = new Set([
  "library_status",
  "closure_dates",
  "announcements",
  "gallery",
  "testimonials",
]);

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });

const getGalleryPathFromUrl = (imageUrl: string) => {
  const marker = "/storage/v1/object/public/gallery/";
  const markerIndex = imageUrl.indexOf(marker);

  if (markerIndex === -1) return null;

  const rawPath = imageUrl.slice(markerIndex + marker.length).split("?")[0];

  try {
    return decodeURIComponent(rawPath);
  } catch {
    return rawPath;
  }
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const password = req.headers.get("x-admin-password");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");

  if (!password || password !== adminPassword) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const contentType = req.headers.get("content-type") || "";

    let action = "";
    let table = "";
    let data: any = null;
    let id = "";
    let formData: FormData | null = null;

    if (contentType.includes("multipart/form-data")) {
      formData = await req.formData();
      action = String(formData.get("action") || "");
      table = String(formData.get("table") || "");
      id = String(formData.get("id") || "");
    } else {
      const body = await req.json();
      action = body.action || "";
      table = body.table || "";
      data = body.data ?? null;
      id = body.id || "";
    }

    let result;

    switch (action) {
      case "verify":
        return jsonResponse({ success: true });

      case "list": {
        if (!allowedTables.has(table)) {
          return jsonResponse({ error: "Invalid table" }, 400);
        }

        const query = supabase.from(table).select("*");

        if (table === "gallery") {
          result = await query
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: false });
        } else {
          const orderCol = table === "library_status" ? "updated_at" : "created_at";
          result = await query.order(orderCol, { ascending: false });
        }

        break;
      }

      case "insert": {
        if (!allowedTables.has(table)) {
          return jsonResponse({ error: "Invalid table" }, 400);
        }
        result = await supabase.from(table).insert(data).select();
        break;
      }

      case "update": {
        if (!allowedTables.has(table)) {
          return jsonResponse({ error: "Invalid table" }, 400);
        }
        result = await supabase.from(table).update(data).eq("id", id).select();
        break;
      }

      case "delete": {
        if (!allowedTables.has(table)) {
          return jsonResponse({ error: "Invalid table" }, 400);
        }
        result = await supabase.from(table).delete().eq("id", id);
        break;
      }

      case "delete_gallery_image": {
        if (!id) {
          return jsonResponse({ error: "Image id is required" }, 400);
        }

        const { data: existingImage, error: existingError } = await supabase
          .from("gallery")
          .select("id, image_url")
          .eq("id", id)
          .single();

        if (existingError || !existingImage) {
          return jsonResponse({ error: "Image not found" }, 404);
        }

        const storagePath = getGalleryPathFromUrl(existingImage.image_url);
        if (storagePath) {
          const { error: storageError } = await supabase.storage
            .from("gallery")
            .remove([storagePath]);

          if (storageError) {
            return jsonResponse({ error: storageError.message }, 400);
          }
        }

        result = await supabase.from("gallery").delete().eq("id", id).select();
        break;
      }

      case "reorder_gallery": {
        if (!Array.isArray(data)) {
          return jsonResponse({ error: "Invalid reorder payload" }, 400);
        }

        const updates = data
          .filter((entry) => entry && typeof entry.id === "string")
          .map((entry, index) =>
            supabase
              .from("gallery")
              .update({
                sort_order: Number.isFinite(Number(entry.sort_order))
                  ? Number(entry.sort_order)
                  : index,
              })
              .eq("id", entry.id),
          );

        const updateResults = await Promise.all(updates);
        const failed = updateResults.find((res) => res.error);
        if (failed?.error) {
          return jsonResponse({ error: failed.error.message }, 400);
        }

        result = await supabase
          .from("gallery")
          .select("*")
          .order("sort_order", { ascending: true });
        break;
      }

      case "upload_gallery_image": {
        let fileBytes: Uint8Array;
        let fileName = `${crypto.randomUUID()}.jpg`;
        let fileContentType = "image/jpeg";
        let caption: string | null = null;

        if (formData) {
          const file = formData.get("file");
          const formCaption = formData.get("caption");

          if (!(file instanceof File)) {
            return jsonResponse({ error: "Image file is required" }, 400);
          }

          fileBytes = new Uint8Array(await file.arrayBuffer());
          fileName = file.name || fileName;
          fileContentType = file.type || fileContentType;
          caption = typeof formCaption === "string" && formCaption.trim()
            ? formCaption.trim()
            : null;
        } else {
          const base64 = data?.base64;

          if (typeof base64 !== "string" || !base64) {
            return jsonResponse({ error: "Image data is required" }, 400);
          }

          fileBytes = decode(base64);
          fileName = data?.fileName || fileName;
          fileContentType = data?.contentType || fileContentType;
          caption = typeof data?.caption === "string" && data.caption.trim()
            ? data.caption.trim()
            : null;
        }

        if (!fileBytes || fileBytes.byteLength === 0) {
          return jsonResponse({ error: "Uploaded image is empty" }, 400);
        }

        const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const filePath = `${crypto.randomUUID()}-${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(filePath, fileBytes, { contentType: fileContentType, upsert: false });

        if (uploadError) {
          return jsonResponse({ error: uploadError.message }, 400);
        }

        const { data: urlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(filePath);

        const { data: latest, error: latestError } = await supabase
          .from("gallery")
          .select("sort_order")
          .order("sort_order", { ascending: false })
          .limit(1);

        if (latestError) {
          return jsonResponse({ error: latestError.message }, 400);
        }

        const nextSortOrder = (latest?.[0]?.sort_order ?? -1) + 1;

        result = await supabase
          .from("gallery")
          .insert({
            image_url: urlData.publicUrl,
            caption,
            sort_order: nextSortOrder,
          })
          .select();

        break;
      }

      case "upsert_status": {
        const { data: existing } = await supabase
          .from("library_status")
          .select("*")
          .limit(1)
          .single();

        if (existing) {
          result = await supabase
            .from("library_status")
            .update({ ...data, updated_at: new Date().toISOString() })
            .eq("id", existing.id)
            .select();
        } else {
          result = await supabase
            .from("library_status")
            .insert({ ...data })
            .select();
        }
        break;
      }

      default:
        return jsonResponse({ error: "Invalid action" }, 400);
    }

    if (result?.error) {
      return jsonResponse({ error: result.error.message }, 400);
    }

    return jsonResponse({ data: result?.data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return jsonResponse({ error: message }, 500);
  }
});

