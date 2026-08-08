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
  "members",
  "qr_codes",
  "attendance",
  "audit_logs",
  "library_rules",
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

  const password = (req.headers.get("x-admin-password") ?? "").trim();
  const adminPassword = (Deno.env.get("ADMIN_PASSWORD") ?? "").trim();

  if (
    !password ||
    !adminPassword ||
    password.toLowerCase() !== adminPassword.toLowerCase()
  ) {
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const body = await req.json();
    const action = body.action || "";
    const table = body.table || "";
    const data = body.data ?? null;
    const id = body.id || "";

    let result;

    switch (action) {
      case "verify":
        return jsonResponse({ success: true });

      case "list": {
        if (!allowedTables.has(table)) {
          return jsonResponse({ error: "Invalid table" }, 400);
        }

        const query = supabase.from(table).select("*");
        
        let orderCol = "created_at";
        if (table === "library_status") orderCol = "updated_at";
        if (table === "library_rules") orderCol = "key";
        if (table === "attendance") orderCol = "check_in_time";

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
      
      case "get_attendance_stats": {
        // Today's stats in Asia/Kolkata
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const { data: attendance } = await supabase
          .from("attendance")
          .select("*, members(full_name, father_name, mobile)")
          .gte("check_in_time", startOfDay.toISOString());
          
        const { count: totalMembers } = await supabase
          .from("members")
          .select("*", { count: "exact", head: true });

        const currentlyInside = attendance?.filter(a => a.status === "inside") || [];
        const checkIns = attendance?.length || 0;
        const checkOuts = attendance?.filter(a => a.status !== "inside").length || 0;
        
        let totalMinutes = 0;
        attendance?.forEach(a => {
            if (a.duration_minutes) totalMinutes += a.duration_minutes;
            else if (a.status === "inside") {
                const diff = (new Date().getTime() - new Date(a.check_in_time).getTime()) / 60000;
                totalMinutes += diff;
            }
        });

        return jsonResponse({
          totalMembers,
          currentlyInsideCount: currentlyInside.length,
          todayCheckIns: checkIns,
          todayCheckOuts: checkOuts,
          todayStudyHours: Math.round(totalMinutes / 60 * 10) / 10,
          currentlyInsideList: currentlyInside
        });
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
