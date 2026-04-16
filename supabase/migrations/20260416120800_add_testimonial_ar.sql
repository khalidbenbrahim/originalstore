-- Add Arabic support for testimonials
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS text_ar TEXT;
