-- Add is_featured column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false;

-- Update RLS policies (in case they need refresh, but usually not needed for column addition)
-- The Master Fix policies already cover this as they use 'true' or 'TO anon, authenticated'
