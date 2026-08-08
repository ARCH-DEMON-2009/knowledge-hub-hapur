CREATE TABLE public.visitor_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    entry_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    exit_time TIMESTAMPTZ,
    purpose TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

GRANT SELECT, INSERT, UPDATE ON public.visitor_logs TO authenticated;
GRANT INSERT ON public.visitor_logs TO anon;
GRANT ALL ON public.visitor_logs TO service_role;

ALTER TABLE public.visitor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public inserts" ON public.visitor_logs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated full access" ON public.visitor_logs FOR ALL TO authenticated USING (true);
