import { supabase } from "@/integrations/supabase/client";

export const getAppUrl = () => {
  return import.meta.env.VITE_APP_URL || "https://janhitkari-library.shashanksv.com";
};

export const getMcpUrl = () => {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  return `https://${projectId}.supabase.co/functions/v1/mcp`;
};

// Common time display for India
export const formatTime = (date: string | Date) => {
  return new Date(date).toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};
