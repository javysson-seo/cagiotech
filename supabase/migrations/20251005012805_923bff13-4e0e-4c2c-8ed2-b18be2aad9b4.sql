-- Create CRM Stages table
CREATE TABLE IF NOT EXISTS public.crm_stages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#3B82F6',
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  is_won BOOLEAN DEFAULT false,
  is_lost BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, name)
);

-- Create CRM Deals table
CREATE TABLE IF NOT EXISTS public.crm_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE SET NULL,
  stage_id UUID NOT NULL REFERENCES public.crm_stages(id) ON DELETE RESTRICT,
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value NUMERIC(12, 2),
  currency TEXT DEFAULT 'EUR',
  probability INTEGER DEFAULT 50 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'won', 'lost', 'on_hold')),
  lost_reason TEXT,
  tags TEXT[],
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create CRM Activities table
CREATE TABLE IF NOT EXISTS public.crm_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  prospect_id UUID REFERENCES public.prospects(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'email', 'meeting', 'note', 'task', 'stage_change')),
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_crm_stages_company ON public.crm_stages(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_stages_position ON public.crm_stages(position);
CREATE INDEX IF NOT EXISTS idx_crm_deals_company ON public.crm_deals(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_stage ON public.crm_deals(stage_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_prospect ON public.crm_deals(prospect_id);
CREATE INDEX IF NOT EXISTS idx_crm_deals_assigned ON public.crm_deals(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_activities_deal ON public.crm_activities(deal_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_prospect ON public.crm_activities(prospect_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_company ON public.crm_activities(company_id);

-- Enable RLS
ALTER TABLE public.crm_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crm_stages
CREATE POLICY "Company members can manage stages"
  ON public.crm_stages
  FOR ALL
  USING (can_access_company_data(company_id))
  WITH CHECK (can_access_company_data(company_id));

-- RLS Policies for crm_deals
CREATE POLICY "Company members can manage deals"
  ON public.crm_deals
  FOR ALL
  USING (can_access_company_data(company_id))
  WITH CHECK (can_access_company_data(company_id));

-- RLS Policies for crm_activities
CREATE POLICY "Company members can manage activities"
  ON public.crm_activities
  FOR ALL
  USING (can_access_company_data(company_id))
  WITH CHECK (can_access_company_data(company_id));

-- Trigger for updated_at on crm_stages
CREATE TRIGGER update_crm_stages_updated_at
  BEFORE UPDATE ON public.crm_stages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for updated_at on crm_deals
CREATE TRIGGER update_crm_deals_updated_at
  BEFORE UPDATE ON public.crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to log stage changes automatically
CREATE OR REPLACE FUNCTION public.log_deal_stage_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  old_stage_name TEXT;
  new_stage_name TEXT;
BEGIN
  IF OLD.stage_id IS DISTINCT FROM NEW.stage_id THEN
    -- Get stage names
    SELECT name INTO old_stage_name FROM public.crm_stages WHERE id = OLD.stage_id;
    SELECT name INTO new_stage_name FROM public.crm_stages WHERE id = NEW.stage_id;
    
    -- Log the activity
    INSERT INTO public.crm_activities (
      company_id,
      deal_id,
      prospect_id,
      activity_type,
      title,
      description,
      completed_at,
      status,
      created_by,
      metadata
    ) VALUES (
      NEW.company_id,
      NEW.id,
      NEW.prospect_id,
      'stage_change',
      'Estágio alterado',
      'Mudou de "' || COALESCE(old_stage_name, 'N/A') || '" para "' || new_stage_name || '"',
      now(),
      'completed',
      auth.uid(),
      jsonb_build_object('old_stage_id', OLD.stage_id, 'new_stage_id', NEW.stage_id)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to log stage changes
CREATE TRIGGER log_crm_deal_stage_change
  AFTER UPDATE ON public.crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.log_deal_stage_change();

-- Insert default stages for existing companies (optional - can be customized per company)
INSERT INTO public.crm_stages (company_id, name, description, color, position, is_won, is_lost)
SELECT 
  id,
  stage.name,
  stage.description,
  stage.color,
  stage.position,
  stage.is_won,
  stage.is_lost
FROM public.companies
CROSS JOIN (
  VALUES 
    ('Lead', 'Novo contato identificado', '#94A3B8', 0, false, false),
    ('Qualificado', 'Lead qualificado e com interesse', '#3B82F6', 1, false, false),
    ('Proposta', 'Proposta enviada', '#8B5CF6', 2, false, false),
    ('Negociação', 'Em negociação comercial', '#F59E0B', 3, false, false),
    ('Ganho', 'Negócio fechado com sucesso', '#10B981', 4, true, false),
    ('Perdido', 'Negócio perdido', '#EF4444', 5, false, true)
) AS stage(name, description, color, position, is_won, is_lost)
ON CONFLICT (company_id, name) DO NOTHING;