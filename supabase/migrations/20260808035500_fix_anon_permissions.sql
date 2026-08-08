-- Ensure public schema is accessible
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant SELECT on all required tables to anon for public visibility
GRANT SELECT ON public.library_status TO anon;
GRANT SELECT ON public.closure_dates TO anon;
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT ON public.testimonials TO anon;

-- Ensure RLS is enabled
ALTER TABLE public.library_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closure_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create public read policies if they don't exist
DO \$\$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'gallery' AND policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON public.gallery FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'announcements' AND policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON public.announcements FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'library_status' AND policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON public.library_status FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'closure_dates' AND policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON public.closure_dates FOR SELECT TO anon, authenticated USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'testimonials' AND policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);
    END IF;
END \$\$;

-- Storage policies for the gallery bucket
-- Note: public_buckets_blocked might prevent making the bucket public, 
-- but RLS on objects still needs to allow access.
DO \$\$
BEGIN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('gallery', 'gallery', false)
    ON CONFLICT (id) DO UPDATE SET public = false;
END \$\$;

-- Allow public to read from the gallery bucket
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Public Access') THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'gallery');
    END IF;
END \$\$;
