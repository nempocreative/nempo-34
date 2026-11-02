CREATE TABLE public.media_archive (id text PRIMARY KEY, manifest jsonb NOT NULL DEFAULT '[]'::jsonb, updated_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.media_archive TO anon, authenticated;
GRANT ALL ON public.media_archive TO service_role;
ALTER TABLE public.media_archive ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public media manifest read" ON public.media_archive FOR SELECT TO anon, authenticated USING (true);