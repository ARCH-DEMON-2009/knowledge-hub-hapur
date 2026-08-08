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
  
  "testimonials",
  "visitor_logs",
]);

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders,
  });

const getGalleryPathFromUrl = (imageUrl: string) => {
  const markers = [
    "/storage/v1/object/public/gallery/",
    "/storage/v1/object/sign/gallery/",
  ];
  const marker = markers.find((m) => imageUrl.includes(m));

  if (!marker) return null;

  const rawPath = imageUrl.slice(imageUrl.indexOf(marker) + marker.length).split("?")[0];

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

          const orderCol = table === "library_status" ? "updated_at" : "created_at";
          result = await query.order(orderCol, { ascending: false });


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

        // Bucket is private (public buckets are blocked by workspace policy),
        // so store a long-lived signed URL instead of a public URL.
        const { data: urlData, error: signError } = await supabase.storage
          .from("gallery")
          .createSignedUrl(filePath, 60 * 60 * 24 * 365 * 10);

        if (signError || !urlData?.signedUrl) {
          return jsonResponse({ error: signError?.message || "Failed to sign URL" }, 400);
        }

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
            image_url: urlData.signedUrl,
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

