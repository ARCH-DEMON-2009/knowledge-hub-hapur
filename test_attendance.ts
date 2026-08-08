import { supabase } from "../src/integrations/supabase/client";

async function testAutomatedLogic() {
  console.log("Checking RLS and attendance logic...");
  
  // 1. Check if we can select from attendance (anon)
  const { data, error } = await supabase.from("attendance").select("*").limit(1);
  if (error) {
    console.error("❌ Attendance READ error:", error.message);
  } else {
    console.log("✅ Attendance READ ok");
  }

  // 2. Check if we can select from members (anon)
  const { data: members, error: mError } = await supabase.from("members").select("*").limit(1);
  if (mError) {
     console.error("❌ Members READ error:", mError.message);
  } else {
    console.log("✅ Members READ ok");
  }

  console.log("Test finished.");
}

testAutomatedLogic();
