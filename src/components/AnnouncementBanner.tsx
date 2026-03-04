import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState<{ title: string; content: string } | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setAnnouncement(data);
      });
  }, []);

  if (!announcement || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="fixed top-[72px] left-0 right-0 z-40 bg-gold text-navy px-4 py-3"
      >
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Megaphone className="w-5 h-5 shrink-0" />
            <p className="font-body text-sm font-medium">
              <strong>{announcement.title}:</strong> {announcement.content}
            </p>
          </div>
          <button onClick={() => setDismissed(true)} className="shrink-0 hover:opacity-70">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnnouncementBanner;
