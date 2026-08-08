GRANT SELECT, INSERT ON public.members TO anon;
GRANT SELECT, INSERT, UPDATE ON public.attendance TO anon;

DROP POLICY IF EXISTS "Public can insert members" ON public.members;
CREATE POLICY "Anyone can register" ON public.members FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can select members" ON public.members;
CREATE POLICY "Anyone can select members" ON public.members FOR SELECT TO anon USING (true);

DROP POLICY IF EXISTS "Public can insert attendance" ON public.attendance;
CREATE POLICY "Anyone can insert attendance" ON public.attendance FOR INSERT TO anon WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update attendance" ON public.attendance;
CREATE POLICY "Anyone can update attendance" ON public.attendance FOR UPDATE TO anon USING (true);

DROP POLICY IF EXISTS "Public can select attendance" ON public.attendance;
CREATE POLICY "Anyone can select attendance" ON public.attendance FOR SELECT TO anon USING (true);

GRANT SELECT ON public.library_rules TO anon;
