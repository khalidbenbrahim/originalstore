-- Relax RLS policies for products, tiktok_videos, testimonials, and site_settings
-- This allows the custom admin panel (without Supabase Auth) to manage data

-- 1. Products
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

CREATE POLICY "Public insert products" ON public.products FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update products" ON public.products FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete products" ON public.products FOR DELETE TO anon, authenticated USING (true);

-- 2. TikTok Videos
DROP POLICY IF EXISTS "Admins can insert videos" ON public.tiktok_videos;
DROP POLICY IF EXISTS "Admins can update videos" ON public.tiktok_videos;
DROP POLICY IF EXISTS "Admins can delete videos" ON public.tiktok_videos;
DROP POLICY IF EXISTS "Admins can read all videos" ON public.tiktok_videos;

CREATE POLICY "Public insert videos" ON public.tiktok_videos FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update videos" ON public.tiktok_videos FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete videos" ON public.tiktok_videos FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Public read all videos" ON public.tiktok_videos FOR SELECT TO anon, authenticated USING (true);

-- 3. Testimonials
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can read all testimonials" ON public.testimonials;

CREATE POLICY "Public insert testimonials" ON public.testimonials FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update testimonials" ON public.testimonials FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete testimonials" ON public.testimonials FOR DELETE TO anon, authenticated USING (true);
CREATE POLICY "Public read all testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (true);

-- 4. Site Settings
DROP POLICY IF EXISTS "Admins can insert site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admins can delete site settings" ON public.site_settings;

CREATE POLICY "Public insert site settings" ON public.site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Public update site settings" ON public.site_settings FOR UPDATE TO anon, authenticated USING (true);
CREATE POLICY "Public delete site settings" ON public.site_settings FOR DELETE TO anon, authenticated USING (true);
