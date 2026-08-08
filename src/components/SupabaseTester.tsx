import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const SupabaseTester = () => {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from("library_status").select("*");
        if (error) throw error;
        setData(data || []);
      } catch (err: any) {
        setError(err.message);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-white/90 p-4 rounded-lg shadow-xl text-black border border-gray-200">
      <h3 className="font-bold border-bottom mb-2">Supabase Connection Status</h3>
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <div>
          <p className="text-green-600">Connected!</p>
          <pre className="text-xs mt-2 overflow-auto max-h-40">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default SupabaseTester;
