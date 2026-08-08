import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

    const body = await req.json();
    action = body.action || "";
    table = body.table || "";
    data = body.data ?? null;
    id = body.id || "";

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
