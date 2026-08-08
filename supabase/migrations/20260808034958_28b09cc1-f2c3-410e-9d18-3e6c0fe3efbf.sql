CREATE TABLE IF NOT EXISTS public.visitor_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_name text NOT NULL,
  entry_time text NOT NULL,
  outgoing_time text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.visitor_logs TO anon;
GRANT SELECT, INSERT ON public.visitor_logs TO authenticated;
GRANT ALL ON public.visitor_logs TO service_role;
ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a visit" ON public.visitor_logs FOR INSERT TO anon, authenticated WITH CHECK (true);