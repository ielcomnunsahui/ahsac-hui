-- Allow anyone to check if a registration link is active (for validation during registration)
CREATE POLICY "Anyone can check active registration links" 
ON public.registration_links 
FOR SELECT 
USING (is_active = true);

-- Add image_url column to events table for event banners
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS image_url TEXT;