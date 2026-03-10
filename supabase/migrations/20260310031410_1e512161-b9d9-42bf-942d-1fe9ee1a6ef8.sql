
-- Drop restrictive policies and recreate as permissive
DROP POLICY IF EXISTS "Anyone can view gallery" ON public.gallery;
CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can view visible testimonials" ON public.testimonials;
CREATE POLICY "Anyone can view visible testimonials" ON public.testimonials FOR SELECT TO public USING (is_visible = true);

DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;
CREATE POLICY "Anyone can view active announcements" ON public.announcements FOR SELECT TO public USING (is_active = true);

DROP POLICY IF EXISTS "Anyone can view closure dates" ON public.closure_dates;
CREATE POLICY "Anyone can view closure dates" ON public.closure_dates FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Anyone can view library status" ON public.library_status;
CREATE POLICY "Anyone can view library status" ON public.library_status FOR SELECT TO public USING (true);
