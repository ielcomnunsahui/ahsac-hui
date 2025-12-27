-- Fix security: Add INSERT policy for profiles (created via trigger, but good for completeness)
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Fix security: Handle null member_id in event_registrations
-- Drop existing select policies and recreate with better handling
DROP POLICY IF EXISTS "Members can view own registrations" ON public.event_registrations;

CREATE POLICY "Users can view own registrations" 
ON public.event_registrations 
FOR SELECT 
USING (
  auth.uid() IS NOT NULL AND (
    (member_id IS NOT NULL AND auth.uid() = (SELECT user_id FROM members WHERE id = event_registrations.member_id)) OR
    (member_id IS NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  )
);

-- Add unique constraint for event registrations to prevent duplicates
ALTER TABLE public.event_registrations 
ADD CONSTRAINT unique_event_member_registration UNIQUE (event_id, member_id);

-- Add unique constraint for email per event
CREATE UNIQUE INDEX unique_event_email_registration ON public.event_registrations (event_id, email) WHERE email IS NOT NULL;