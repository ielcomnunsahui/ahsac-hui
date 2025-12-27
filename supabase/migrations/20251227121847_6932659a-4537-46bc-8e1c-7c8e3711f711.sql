-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Create RLS policies for the images bucket
CREATE POLICY "Anyone can view images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

CREATE POLICY "Admins can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

-- Add user_id column to members table for proper profile linking
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookup
CREATE INDEX IF NOT EXISTS idx_members_user_id ON public.members(user_id);

-- Allow members to view their own records
CREATE POLICY "Members can view own record" 
ON public.members 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow members to update their own records
CREATE POLICY "Members can update own record" 
ON public.members 
FOR UPDATE 
USING (auth.uid() = user_id);