-- Member table for student accounts
CREATE TABLE public.members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    father_name TEXT NOT NULL,
    mobile TEXT UNIQUE NOT NULL,
    address TEXT,
    password_hash TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    device_fingerprint TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- QR Codes table
CREATE TABLE public.qr_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    token_hash TEXT UNIQUE NOT NULL,
    location_name TEXT DEFAULT 'Main Branch',
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    revoked_at TIMESTAMPTZ
);

-- Attendance (Visits) table
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID REFERENCES public.members(id) ON DELETE CASCADE NOT NULL,
    qr_code_id UUID REFERENCES public.qr_codes(id) ON DELETE SET NULL,
    check_in_time TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    check_out_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    status TEXT DEFAULT 'inside' CHECK (status IN ('inside', 'completed', 'auto_checkout')),
    checkout_reason TEXT,
    device_fingerprint TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Audit Logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID,
    actor_type TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    reason TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Configurable Library Rules
CREATE TABLE public.library_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.members TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.members TO anon;
GRANT ALL ON public.members TO service_role;

GRANT SELECT ON public.qr_codes TO authenticated, anon;
GRANT ALL ON public.qr_codes TO service_role;

GRANT SELECT, INSERT, UPDATE ON public.attendance TO authenticated, anon;
GRANT ALL ON public.attendance TO service_role;

GRANT SELECT, INSERT ON public.audit_logs TO authenticated, anon;
GRANT ALL ON public.audit_logs TO service_role;

GRANT SELECT ON public.library_rules TO authenticated, anon;
GRANT ALL ON public.library_rules TO service_role;

-- RLS Policies
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_rules ENABLE ROW LEVEL SECURITY;

-- Members: Public can register, but only if they don't exist. Users can see their own.
CREATE POLICY "Public can insert members" ON public.members FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Members can view own profile" ON public.members FOR SELECT TO authenticated USING (auth.uid() = id);

-- Attendance: Public can check in/out if they have a valid token (handled by app logic)
CREATE POLICY "Public can insert attendance" ON public.attendance FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Public can update attendance" ON public.attendance FOR UPDATE TO anon USING (true);
CREATE POLICY "Members can view own attendance" ON public.attendance FOR SELECT TO authenticated USING (auth.uid() = member_id);

-- Library Rules: Everyone can read
CREATE POLICY "Everyone can read rules" ON public.library_rules FOR SELECT USING (true);

-- Seed initial rules
INSERT INTO public.library_rules (key, value, description) VALUES
('opening_time', '06:00', 'Library opening time'),
('closing_time', '20:00', 'Library closing time'),
('auto_checkout_enabled', 'true', 'Whether to automatically checkout users at closing time');
