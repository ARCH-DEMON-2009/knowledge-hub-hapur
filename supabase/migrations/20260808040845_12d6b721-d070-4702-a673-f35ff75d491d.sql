-- Add policies for qr_codes and audit_logs to fix linter warnings
CREATE POLICY "Everyone can view active QR codes" ON public.qr_codes FOR SELECT USING (status = 'active');
CREATE POLICY "Members can view their own audit logs" ON public.audit_logs FOR SELECT TO authenticated USING (actor_id = auth.uid());
