-- Add social media columns to founding_members table
ALTER TABLE public.founding_members
ADD COLUMN twitter_handle text,
ADD COLUMN linkedin_url text,
ADD COLUMN facebook_url text,
ADD COLUMN email text,
ADD COLUMN website_url text;