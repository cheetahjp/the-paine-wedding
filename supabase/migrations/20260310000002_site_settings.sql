-- ============================================================
-- site_settings: key/value store for admin-editable site content
-- Keys use dot-notation (e.g. "venue.name", "schedule", "images.hero")
-- Values are JSONB — strings, numbers, arrays, or objects
-- ============================================================

CREATE TABLE IF NOT EXISTS site_settings (
  key        TEXT        PRIMARY KEY,
  value      JSONB       NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Automatically bump updated_at on every update
CREATE OR REPLACE FUNCTION update_site_settings_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS site_settings_updated_at ON site_settings;
CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_site_settings_timestamp();

-- RLS: enabled but no public access — all reads/writes go through
-- server-side API routes using the service role key
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- Supabase Storage: site-images bucket for uploaded photos
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760,  -- 10 MB limit per file
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read files from the public site-images bucket
DROP POLICY IF EXISTS "Public read site-images" ON storage.objects;
CREATE POLICY "Public read site-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-images');
