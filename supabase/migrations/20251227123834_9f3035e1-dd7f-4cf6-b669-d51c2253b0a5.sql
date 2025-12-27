-- Create colleges table
CREATE TABLE public.colleges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add college_id to faculties and make it hierarchical
ALTER TABLE public.faculties 
ADD COLUMN college_id UUID REFERENCES public.colleges(id) ON DELETE CASCADE,
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Create departments table
CREATE TABLE public.departments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  faculty_id UUID NOT NULL REFERENCES public.faculties(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, faculty_id)
);

-- Add level_of_study and department_id to members
ALTER TABLE public.members
ADD COLUMN level_of_study TEXT,
ADD COLUMN department_id UUID REFERENCES public.departments(id),
ADD COLUMN expected_graduation_year INTEGER;

-- Create alumni table
CREATE TABLE public.alumni (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  matric_number TEXT NOT NULL UNIQUE,
  department TEXT NOT NULL,
  faculty_id UUID REFERENCES public.faculties(id),
  department_id UUID REFERENCES public.departments(id),
  whatsapp_number TEXT,
  graduation_year INTEGER,
  user_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  max_attendees INTEGER,
  is_published BOOLEAN DEFAULT false,
  registration_required BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create event registrations table
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  whatsapp_number TEXT,
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, member_id)
);

-- Create event attendance table
CREATE TABLE public.event_attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  registration_id UUID REFERENCES public.event_registrations(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE SET NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  checked_in_by UUID,
  UNIQUE(event_id, member_id)
);

-- Enable RLS on all new tables
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendance ENABLE ROW LEVEL SECURITY;

-- Colleges policies
CREATE POLICY "Anyone can view colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Admins can insert colleges" ON public.colleges FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update colleges" ON public.colleges FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete colleges" ON public.colleges FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Departments policies
CREATE POLICY "Anyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Admins can insert departments" ON public.departments FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update departments" ON public.departments FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete departments" ON public.departments FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Alumni policies
CREATE POLICY "Admins can view all alumni" ON public.alumni FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert alumni" ON public.alumni FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update alumni" ON public.alumni FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete alumni" ON public.alumni FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Events policies
CREATE POLICY "Anyone can view published events" ON public.events FOR SELECT USING (is_published = true);
CREATE POLICY "Admins can view all events" ON public.events FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Event registrations policies
CREATE POLICY "Anyone can register for events" ON public.event_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all registrations" ON public.event_registrations FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Members can view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.members WHERE id = member_id));
CREATE POLICY "Admins can delete registrations" ON public.event_registrations FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Event attendance policies
CREATE POLICY "Admins can view attendance" ON public.event_attendance FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert attendance" ON public.event_attendance FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete attendance" ON public.event_attendance FOR DELETE USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON public.colleges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_alumni_updated_at BEFORE UPDATE ON public.alumni FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial College of Health Sciences data
INSERT INTO public.colleges (name, display_order) VALUES ('College of Health Sciences', 1);

-- Get the college ID and insert faculties
DO $$
DECLARE
  health_college_id UUID;
  clinical_faculty_id UUID;
  nursing_faculty_id UUID;
  basic_med_faculty_id UUID;
BEGIN
  SELECT id INTO health_college_id FROM public.colleges WHERE name = 'College of Health Sciences';
  
  -- Insert faculties
  INSERT INTO public.faculties (name, college_id, display_order) 
  VALUES ('Faculty of Clinical Sciences', health_college_id, 1)
  RETURNING id INTO clinical_faculty_id;
  
  INSERT INTO public.faculties (name, college_id, display_order) 
  VALUES ('Faculty of Nursing Sciences', health_college_id, 2)
  RETURNING id INTO nursing_faculty_id;
  
  INSERT INTO public.faculties (name, college_id, display_order) 
  VALUES ('Faculty of Basic Medical Sciences', health_college_id, 3)
  RETURNING id INTO basic_med_faculty_id;
  
  -- Insert departments
  INSERT INTO public.departments (name, faculty_id, display_order) VALUES
  ('Department of Medicine and Surgery (300L-600L)', clinical_faculty_id, 1),
  ('Department of Nursing Sciences', nursing_faculty_id, 1),
  ('Department of Medicine and Surgery (100-200L)', basic_med_faculty_id, 1),
  ('Department of Medical Laboratory Sciences', basic_med_faculty_id, 2),
  ('Department of Human Anatomy', basic_med_faculty_id, 3),
  ('Department of Human Physiology', basic_med_faculty_id, 4),
  ('Department of Community Medicine and Public Health', basic_med_faculty_id, 5);
END $$;