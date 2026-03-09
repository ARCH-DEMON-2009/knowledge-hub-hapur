import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/std@0.208.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const password = req.headers.get("x-admin-password");
  const adminPassword = Deno.env.get("ADMIN_PASSWORD");

  if (!password || password !== adminPassword) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { action, table, data, id } = await req.json();

    let result;

    switch (action) {
      case "verify":
        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      case "list": {
        const orderCol = table === "library_status" ? "updated_at" : "created_at";
        result = await supabase.from(table).select("*").order(orderCol, { ascending: false });
        break;
      }

      case "insert":
        result = await supabase.from(table).insert(data).select();
        break;

      case "update":
        result = await supabase.from(table).update(data).eq("id", id).select();
        break;

      case "delete":
        result = await supabase.from(table).delete().eq("id", id);
        break;

      case "upload_gallery_image": {
        const { base64, fileName, contentType, caption } = data;
        const fileBytes = decode(base64);
        const filePath = `${crypto.randomUUID()}-${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("gallery")
          .upload(filePath, fileBytes, { contentType, upsert: false });

        if (uploadError) {
          return new Response(JSON.stringify({ error: uploadError.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: urlData } = supabase.storage
          .from("gallery")
          .getPublicUrl(filePath);

        // Get current count for sort_order
        const { count } = await supabase
          .from("gallery")
          .select("*", { count: "exact", head: true });

        result = await supabase.from("gallery").insert({
          image_url: urlData.publicUrl,
          caption: caption || null,
          sort_order: count || 0,
        }).select();

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
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (result?.error) {
      return new Response(JSON.stringify({ error: result.error.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ data: result?.data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
