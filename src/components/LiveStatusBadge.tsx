import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const LiveStatusBadge = () => {
  const [status, setStatus] = useState<{ is_open: boolean; opening_time: string; closing_time: string } | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await supabase.from("library_status").select("*").single();
      if (data) setStatus(data);
    };
    fetchStatus();
  }, []);

  if (!status) return (
    <div className="animate-pulse bg-white/30 backdrop-blur-sm border border-white/40 px-4 py-2 rounded-full w-32 h-9" 
         aria-label="Loading library status" 
         role="status"
    />
  );

  const label = status.is_open ? "LIBRARY OPEN" : "LIBRARY CLOSED";
  const statusColor = status.is_open ? "bg-emerald-500" : "bg-rose-500";
  const glowColor = status.is_open ? "shadow-emerald-500/50" : "shadow-rose-500/50";

  return (
    <div 
      className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-lg"
      role="status"
      aria-label={`Current library status: ${label}`}
    >
      <div className="relative flex items-center justify-center">
        <span className={`absolute w-2.5 h-2.5 rounded-full animate-ping opacity-75 ${statusColor}`} />
        <span className={`relative w-2 h-2 rounded-full shadow-lg ${statusColor} ${glowColor}`} />
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[11px] font-bold tracking-widest ${status.is_open ? 'text-emerald-800' : 'text-rose-800'}`}>
          {label}
        </span>
        <span className="w-px h-3 bg-navy/10" aria-hidden="true" />
        <span className="text-[11px] font-medium text-navy/70">
          {status.opening_time} – {status.closing_time}
        </span>
      </div>
    </div>
  );
};

export default LiveStatusBadge;
