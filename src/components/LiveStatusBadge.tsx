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
    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full border shadow-sm transition-all duration-300 ${
      status.is_open
        ? "bg-emerald-950/40 border-emerald-500/50 shadow-emerald-900/20"
        : "bg-rose-950/40 border-rose-500/50 shadow-rose-900/20"
    }`}>
      <div className="relative flex items-center justify-center">
        <span className={`absolute w-3 h-3 rounded-full animate-ping opacity-75 ${
          status.is_open ? "bg-emerald-400" : "bg-rose-400"
        }`} />
        <span className={`relative w-2.5 h-2.5 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.2)] ${
          status.is_open ? "bg-emerald-400" : "bg-rose-400"
        }`} />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
        <span className={`font-body text-sm font-bold tracking-wide uppercase ${
          status.is_open ? "text-emerald-400" : "text-rose-400"
        }`}>
          {status.is_open ? "Library Open" : "Library Closed"}
        </span>
        <span className="hidden sm:block text-white/30 font-light">|</span>
        <span className="font-body text-xs font-medium text-slate-200">
          {status.opening_time} – {status.closing_time}
        </span>
      </div>
    </div>
  );
};

export default LiveStatusBadge;
