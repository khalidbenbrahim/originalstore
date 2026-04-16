-- MASTER FIX: Create missing tables and relax RLS for custom admin panel

-- 1. Create missing youtube_videos table
CREATE TABLE IF NOT EXISTS public.youtube_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'test',
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for all relevant tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- CLEANUP: Drop restrictive policies if they exist (to avoid duplicates)
DO $$ 
BEGIN
    -- Products
    DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
    DROP POLICY IF EXISTS "Admins can update products" ON public.products;
    DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
    DROP POLICY IF EXISTS "Anyone can read products" ON public.products;
    
    -- TikTok
    DROP POLICY IF EXISTS "Anyone can read active videos" ON public.tiktok_videos;
    DROP POLICY IF EXISTS "Admins can read all videos" ON public.tiktok_videos;
    DROP POLICY IF EXISTS "Admins can insert videos" ON public.tiktok_videos;
    DROP POLICY IF EXISTS "Admins can update videos" ON public.tiktok_videos;
    DROP POLICY IF EXISTS "Admins can delete videos" ON public.tiktok_videos;
    
    -- Testimonials
    DROP POLICY IF EXISTS "Anyone can read active testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
    DROP POLICY IF EXISTS "Admins can read all testimonials" ON public.testimonials;
    
    -- Site Settings
    DROP POLICY IF EXISTS "Anyone can read site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;
END $$;

-- 2. Define BROAD policies for the custom admin panel (Anon + Authenticated)

-- Products
CREATE POLICY "Public select products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE TO anon, authenticated USING (true);

-- TikTok Videos
CREATE POLICY "Public select tiktok" ON public.tiktok_videos FOR SELECT USING (true);
CREATE POLICY "Public insert tiktok" ON public.tiktok_videos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update tiktok" ON public.tiktok_videos FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete tiktok" ON public.tiktok_videos FOR DELETE TO anon, authenticated USING (true);

-- YouTube Videos
CREATE POLICY "Public select youtube" ON public.youtube_videos FOR SELECT USING (true);
CREATE POLICY "Public insert youtube" ON public.youtube_videos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update youtube" ON public.youtube_videos FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete youtube" ON public.youtube_videos FOR DELETE TO anon, authenticated USING (true);

-- Testimonials
CREATE POLICY "Public select testimonials" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Public insert testimonials" ON public.testimonials FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update testimonials" ON public.testimonials FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete testimonials" ON public.testimonials FOR DELETE TO anon, authenticated USING (true);

-- Site Settings
CREATE POLICY "Public select settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public insert settings" ON public.site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update settings" ON public.site_settings FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete settings" ON public.site_settings FOR DELETE TO anon, authenticated USING (true);

-- Enable Realtime for the new table
ALTER PUBLICATION supabase_realtime ADD TABLE youtube_videos;
