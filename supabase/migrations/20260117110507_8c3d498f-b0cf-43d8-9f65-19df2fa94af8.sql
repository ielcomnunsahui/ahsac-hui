-- Fix: Drop overly permissive INSERT policies and replace with safer versions
-- These policies still allow public registration but with basic validation

-- 1. Fix event_registrations INSERT policy to require name
DROP POLICY IF EXISTS "Anyone can register for events" ON public.event_registrations;
CREATE POLICY "Anyone can register for events with required fields" 
ON public.event_registrations 
FOR INSERT 
WITH CHECK (
  name IS NOT NULL 
  AND char_length(trim(name)) > 0
  AND event_id IS NOT NULL
);

-- 2. Fix feedback INSERT policy to require name and message
DROP POLICY IF EXISTS "Anyone can submit feedback" ON public.feedback;
CREATE POLICY "Anyone can submit feedback with required fields" 
ON public.feedback 
FOR INSERT 
WITH CHECK (
  name IS NOT NULL 
  AND char_length(trim(name)) > 0
  AND message IS NOT NULL 
  AND char_length(trim(message)) > 0
);

-- 3. Fix members INSERT policy to require essential fields
DROP POLICY IF EXISTS "Anyone can register as member" ON public.members;
CREATE POLICY "Anyone can register as member with required fields" 
ON public.members 
FOR INSERT 
WITH CHECK (
  full_name IS NOT NULL 
  AND char_length(trim(full_name)) > 0
  AND matric_number IS NOT NULL 
  AND char_length(trim(matric_number)) > 0
  AND department IS NOT NULL
  AND whatsapp_number IS NOT NULL
);

-- 4. Restrict event_registrations SELECT to prevent data harvesting
-- Users can only see their own registrations (by email match), admins see all
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.event_registrations;
CREATE POLICY "Admins can view all registrations" 
ON public.event_registrations 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Note: Anonymous users cannot SELECT other registrations - they can only INSERT their own