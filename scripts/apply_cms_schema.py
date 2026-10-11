import urllib.request
import json

base_url = 'http://supabasekong-k7v0e6lnxjwerisif54rzczl.187.77.131.65.sslip.io'
service_key = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc4MjAzOTkwMCwiZXhwIjo0OTM3NzEzNTAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.DrdZTVKHvVSgJsJWciIIOyq91lJodQAzUTZ8FCTV7h4'

def query_sql(sql):
    req = urllib.request.Request(
        f'{base_url}/pg/query',
        data=json.dumps({'query': sql}).encode('utf-8'),
        headers={'apikey': service_key, 'Authorization': f'Bearer {service_key}', 'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode('utf-8'))

schema_sql = """
-- 1. Create landing-assets storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('landing-assets', 'landing-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Ensure public access policy for storage
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access Landing Assets'
    ) THEN
        CREATE POLICY "Public Access Landing Assets"
        ON storage.objects FOR SELECT
        TO public
        USING (bucket_id = 'landing-assets');
    END IF;
END $$;

-- 2. Add columns to public.app_landing_pages
ALTER TABLE public.app_landing_pages 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published',
ADD COLUMN IF NOT EXISTS seo_title TEXT DEFAULT 'শিফা পেইন কেয়ার অয়েল | Al-Shifa Care',
ADD COLUMN IF NOT EXISTS seo_description TEXT DEFAULT 'প্রাকৃতিক উপাদানে তৈরি শিফা পেইন কেয়ার অয়েল। বাত-ব্যথা, জয়েন্ট ও মাংসপেশির অস্বস্তি নিরাময়ে বিশ্বস্ত সঙ্গী।',
ADD COLUMN IF NOT EXISTS seo_keywords TEXT DEFAULT 'shifa pain care, herbal oil, pain relief bd, আল শিফা',
ADD COLUMN IF NOT EXISTS og_image TEXT DEFAULT '/images/product-bottle-main.png',
ADD COLUMN IF NOT EXISTS canonical_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS sections_order JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS sections_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS draft_sections_order JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS draft_sections_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Table: app_landing_page_revisions
CREATE TABLE IF NOT EXISTS public.app_landing_page_revisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    landing_page_id UUID REFERENCES public.app_landing_pages(id) ON DELETE CASCADE,
    revision_name TEXT,
    sections_data JSONB NOT NULL,
    sections_order JSONB NOT NULL,
    seo_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_lp_revisions_page_id ON public.app_landing_page_revisions(landing_page_id);
CREATE INDEX IF NOT EXISTS idx_app_lp_revisions_created_at ON public.app_landing_page_revisions(created_at DESC);

-- 4. Table: app_media_assets
CREATE TABLE IF NOT EXISTS public.app_media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    mime_type TEXT,
    file_size INTEGER,
    alt_text TEXT,
    section_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_media_assets_created ON public.app_media_assets(created_at DESC);
"""

print("Executing schema migration...")
res = query_sql(schema_sql)
print("Schema migration result:", res)
