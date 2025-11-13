-- Create company_announcements table
CREATE TABLE IF NOT EXISTS public.company_announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  link_url TEXT,
  background_color TEXT DEFAULT '#000000',
  text_color TEXT DEFAULT '#FFFFFF',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.company_announcements ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view announcements from their company"
  ON public.company_announcements
  FOR SELECT
  USING (
    company_id IN (
      SELECT company_id FROM public.user_roles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Box admins can manage announcements"
  ON public.company_announcements
  FOR ALL
  USING (
    company_id IN (
      SELECT ur.company_id 
      FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role IN ('box_owner', 'cagio_admin')
    )
  );

-- Create index
CREATE INDEX idx_company_announcements_company ON public.company_announcements(company_id);
CREATE INDEX idx_company_announcements_active ON public.company_announcements(is_active, display_order);