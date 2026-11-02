DROP POLICY IF EXISTS "Public can read event_tickets" ON public.event_tickets;
CREATE POLICY "Public can read active event tickets" ON public.event_tickets FOR SELECT TO anon, authenticated USING (active = true);
REVOKE INSERT ON public.community_applications FROM anon, authenticated;
DROP POLICY IF EXISTS "Anyone can submit an application" ON public.community_applications;
GRANT ALL ON public.community_applications, public.event_tickets TO service_role;