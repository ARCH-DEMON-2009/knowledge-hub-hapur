
-- Library status table
CREATE TABLE public.library_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_open BOOLEAN NOT NULL DEFAULT true,
  special_message TEXT,
  opening_time TEXT NOT NULL DEFAULT '6:00 AM',
  closing_time TEXT NOT NULL DEFAULT '8:00 PM',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Special closure dates
CREATE TABLE public.closure_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Announcements
CREATE TABLE public.announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Gallery images
CREATE TABLE public.gallery (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Testimonials
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  message TEXT NOT NULL,
  course TEXT,
  rating INTEGER NOT NULL DEFAULT 5,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default library status
INSERT INTO public.library_status (is_open, special_message, opening_time, closing_time)
VALUES (true, null, '6:00 AM', '8:00 PM');

-- Enable RLS on all tables
ALTER TABLE public.library_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closure_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Public read policies (everyone can view)
CREATE POLICY "Anyone can view library status" ON public.library_status FOR SELECT USING (true);
CREATE POLICY "Anyone can view closure dates" ON public.closure_dates FOR SELECT USING (true);
CREATE POLICY "Anyone can view active announcements" ON public.announcements FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Anyone can view visible testimonials" ON public.testimonials FOR SELECT USING (is_visible = true);

-- Admin policies using service role (edge function will use service role key)
-- No insert/update/delete policies needed as admin will use service role via edge function
