-- Grant broad insert to anon for members and attendance
-- Ensure anon can select members for login check
GRANT SELECT, INSERT ON public.members TO anon;
GRANT SELECT, INSERT, UPDATE ON public.attendance TO anon;

-- Fix RLS Policies
DROP POLICY IF EXISTS "Public can insert members" ON public.members;
CREATE POLICY "Anyone can register" ON public.members FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Public can select members" ON public.members;
CREATE POLICY "Anyone can select members" ON public.members FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can insert attendance" ON public.attendance;
CREATE POLICY "Anyone can insert attendance" ON public.attendance FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update attendance" ON public.attendance;
CREATE POLICY "Anyone can update attendance" ON public.attendance FOR UPDATE TO anon USING (true);

DROP POLICY IF EXISTS "Public can select attendance" ON public.attendance;
CREATE POLICY "Anyone can select attendance" ON public.attendance FOR SELECT TO anon USING (true);

-- Also fix library_rules just in case
GRANT SELECT ON public.library_rules TO anon;
