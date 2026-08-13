import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LibraryStatus {
  is_open: boolean;
  opening_time: string;
  closing_time: string;
  special_message: string | null;
}

const LiveStatusBadge = () => {
  const [status, setStatus] = useState<LibraryStatus | null>(null);

  useEffect(() => {
    supabase
      .from("library_status")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setStatus(data);
      });
  }, []);

  if (!status) return null;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
      status.is_open
        ? "bg-green-500/10 border-green-500/30"
        : "bg-red-500/10 border-red-500/30"
    }`}>
      <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${
        status.is_open ? "bg-green-500" : "bg-red-500"
      }`} />
      <span className={`font-body text-sm font-medium ${
        status.is_open ? "text-green-400" : "text-red-400"
      }`}>
        {status.is_open ? "Open Now" : "Closed Today"} · {status.opening_time} – {status.closing_time}
      </span>
    </div>
  );
};

export default LiveStatusBadge;
