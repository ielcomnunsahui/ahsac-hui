-- Add gender column to members table
ALTER TABLE public.members ADD COLUMN IF NOT EXISTS gender text;

-- Add gender column to alumni table
ALTER TABLE public.alumni ADD COLUMN IF NOT EXISTS gender text;