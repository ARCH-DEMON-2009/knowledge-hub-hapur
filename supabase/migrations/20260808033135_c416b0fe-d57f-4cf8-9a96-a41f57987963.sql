-- Ensure tables exist and have proper grants for PostgREST access

CREATE TABLE IF NOT EXISTS public.library_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_open BOOLEAN NOT NULL DEFAULT true,
  special_message TEXT,
  opening_time TEXT NOT NULL DEFAULT '6:00 AM',
  closing_time TEXT NOT NULL DEFAULT '8:00 PM',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.closure_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  message TEXT NOT NULL,
  course TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Grants for authenticated and service_role
GRANT SELECT, INSERT, UPDATE, DELETE ON public.library_status TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.closure_dates TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery TO authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated, service_role;

-- Grants for anon (public read)
GRANT SELECT ON public.library_status TO anon;
GRANT SELECT ON public.closure_dates TO anon;
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT ON public.gallery TO anon;
GRANT SELECT ON public.testimonials TO anon;

-- Enable RLS
ALTER TABLE public.library_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closure_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Recreate policies for public read
DO $$ BEGIN
    DROP POLICY IF EXISTS "Anyone can view library status" ON public.library_status;
    CREATE POLICY "Anyone can view library status" ON public.library_status FOR SELECT TO public USING (true);
    
    DROP POLICY IF EXISTS "Anyone can view closure dates" ON public.closure_dates;
    CREATE POLICY "Anyone can view closure dates" ON public.closure_dates FOR SELECT TO public USING (true);
    
    DROP POLICY IF EXISTS "Anyone can view active announcements" ON public.announcements;
    CREATE POLICY "Anyone can view active announcements" ON public.announcements FOR SELECT TO public USING (is_active = true);
    
    DROP POLICY IF EXISTS "Anyone can view gallery" ON public.gallery;
    CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT TO public USING (true);
    
    DROP POLICY IF EXISTS "Anyone can view visible testimonials" ON public.testimonials;
    CREATE POLICY "Anyone can view visible testimonials" ON public.testimonials FOR SELECT TO public USING (is_visible = true);
END $$;

-- Default status if not exists
INSERT INTO public.library_status (is_open, special_message, opening_time, closing_time)
SELECT true, null, '6:00 AM', '8:00 PM'
WHERE NOT EXISTS (SELECT 1 FROM public.library_status);
