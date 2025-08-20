
-- Create profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  role TEXT NOT NULL DEFAULT 'box_admin',
  is_approved BOOLEAN DEFAULT true,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create companies table for box management
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create athletes table
CREATE TABLE public.athletes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  birth_date DATE,
  gender TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_notes TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create trainers table
CREATE TABLE public.trainers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  specialties TEXT[],
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create plans table (will be configured in settings)
CREATE TABLE public.plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  duration_months INTEGER,
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create groups table
CREATE TABLE public.groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create athlete_groups junction table
CREATE TABLE public.athlete_groups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(athlete_id, group_id)
);

-- Create nutritional_plans table
CREATE TABLE public.nutritional_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  plan_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create notifications table for birthday alerts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutritional_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for companies
CREATE POLICY "Company owners can manage their company" ON public.companies
  FOR ALL USING (owner_id = auth.uid());

-- RLS Policies for athletes
CREATE POLICY "Company members can manage athletes" ON public.athletes
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for trainers
CREATE POLICY "Company members can manage trainers" ON public.trainers
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for plans
CREATE POLICY "Company members can manage plans" ON public.plans
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for groups
CREATE POLICY "Company members can manage groups" ON public.groups
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for athlete_groups
CREATE POLICY "Company members can manage athlete groups" ON public.athlete_groups
  FOR ALL USING (
    group_id IN (
      SELECT g.id FROM public.groups g
      JOIN public.companies c ON g.company_id = c.id
      WHERE c.owner_id = auth.uid()
    )
  );

-- RLS Policies for nutritional_plans
CREATE POLICY "Company members can manage nutritional plans" ON public.nutritional_plans
  FOR ALL USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  );

-- RLS Policies for notifications
CREATE POLICY "Company members can view notifications" ON public.notifications
  FOR SELECT USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  );

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  company_id UUID;
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'box_admin')
  );

  -- If user is box_admin, create a company for them
  IF COALESCE(NEW.raw_user_meta_data ->> 'role', 'box_admin') = 'box_admin' THEN
    INSERT INTO public.companies (name, owner_id)
    VALUES (
      COALESCE(NEW.raw_user_meta_data ->> 'company_name', 'Minha Empresa'),
      NEW.id
    )
    RETURNING id INTO company_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to check for birthdays and create notifications
CREATE OR REPLACE FUNCTION public.check_birthday_notifications()
RETURNS void AS $$
DECLARE
  athlete_record RECORD;
  notification_message TEXT;
  age INTEGER;
BEGIN
  -- Loop through athletes with birthdays today
  FOR athlete_record IN 
    SELECT a.*, c.id as company_id, c.name as company_name
    FROM public.athletes a
    JOIN public.companies c ON a.company_id = c.id
    WHERE EXTRACT(MONTH FROM a.birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(DAY FROM a.birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
  LOOP
    -- Calculate age
    age := EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM athlete_record.birth_date);
    
    -- Create notification message
    notification_message := athlete_record.name || ' está fazendo ' || age || ' anos hoje!';
    
    -- Insert notification (check if not already exists for today)
    INSERT INTO public.notifications (company_id, type, title, message, data)
    SELECT 
      athlete_record.company_id,
      'birthday',
      'Aniversário',
      notification_message,
      jsonb_build_object('athlete_id', athlete_record.id, 'age', age)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications 
      WHERE company_id = athlete_record.company_id 
      AND type = 'birthday'
      AND data->>'athlete_id' = athlete_record.id::text
      AND DATE(created_at) = CURRENT_DATE
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
