REVOKE SELECT ON public.berita FROM anon, authenticated;
GRANT SELECT (id, title, slug, summary, content, image, category, author, source_name, source_url, photo_source, location, event_date, published_at, featured, active, status, created_at, updated_at) ON public.berita TO anon, authenticated;
REVOKE SELECT (submitter_email, submitter_name) ON public.berita FROM anon, authenticated;
REVOKE ALL ON public.site_settings FROM anon, authenticated;
GRANT ALL ON public.berita, public.site_settings TO service_role;
DROP POLICY IF EXISTS "Public can read site_settings" ON public.site_settings;