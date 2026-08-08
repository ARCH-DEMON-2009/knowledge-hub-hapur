-- Grant usage on schema public to anon if not already present
GRANT USAGE ON SCHEMA public TO anon;

-- Re-grant SELECT on all tables to anon to be absolutely sure
GRANT SELECT ON public.library_status TO anon;
GRANT SELECT ON public.closure_dates TO anon;
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT ON public.testimonials TO anon;

-- Ensure storage policies allow public read for the gallery bucket
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    CREATE POLICY "Public Access" ON storage.objects FOR SELECT TO public USING (bucket_id = 'gallery');
END $$;
