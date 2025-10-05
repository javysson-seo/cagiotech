-- Adicionar campos para documentos portugueses e controle avançado de alunos
ALTER TABLE public.athletes 
ADD COLUMN IF NOT EXISTS nif text,
ADD COLUMN IF NOT EXISTS cc_number text,
ADD COLUMN IF NOT EXISTS cc_expiry_date date,
ADD COLUMN IF NOT EXISTS niss text,
ADD COLUMN IF NOT EXISTS is_approved boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS approved_by uuid,
ADD COLUMN IF NOT EXISTS tags text[],
ADD COLUMN IF NOT EXISTS last_check_in timestamp with time zone,
ADD COLUMN IF NOT EXISTS total_check_ins integer DEFAULT 0;

-- Criar tabela de check-ins
CREATE TABLE IF NOT EXISTS public.athlete_check_ins (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  check_in_time timestamp with time zone NOT NULL DEFAULT now(),
  check_in_type text DEFAULT 'manual',
  notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de avaliações físicas
CREATE TABLE IF NOT EXISTS public.physical_assessments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  assessed_by uuid REFERENCES auth.users(id),
  assessment_date date NOT NULL,
  weight numeric,
  height numeric,
  body_fat_percentage numeric,
  muscle_mass numeric,
  measurements jsonb,
  photos jsonb,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de mensalidades recorrentes
CREATE TABLE IF NOT EXISTS public.recurring_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  subscription_plan_id uuid REFERENCES public.subscription_plans(id),
  amount numeric NOT NULL,
  due_day integer NOT NULL,
  status text NOT NULL DEFAULT 'active',
  start_date date NOT NULL,
  end_date date,
  last_generated_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de comunicações/mensagens
CREATE TABLE IF NOT EXISTS public.athlete_communications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  athlete_id uuid REFERENCES public.athletes(id) ON DELETE CASCADE,
  sent_by uuid REFERENCES auth.users(id),
  type text NOT NULL,
  subject text,
  message text NOT NULL,
  sent_at timestamp with time zone DEFAULT now(),
  read_at timestamp with time zone,
  status text DEFAULT 'sent',
  created_at timestamp with time zone DEFAULT now()
);

-- Criar tabela de templates de mensagens
CREATE TABLE IF NOT EXISTS public.message_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  subject text,
  message text NOT NULL,
  type text NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.athlete_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.physical_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recurring_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Company members can manage check-ins"
ON public.athlete_check_ins FOR ALL
USING (can_access_company_data(company_id));

CREATE POLICY "Company members can manage physical assessments"
ON public.physical_assessments FOR ALL
USING (can_access_company_data(company_id));

CREATE POLICY "Athletes can view their own assessments"
ON public.physical_assessments FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.athletes a
  WHERE a.id = physical_assessments.athlete_id
  AND a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
));

CREATE POLICY "Company members can manage recurring payments"
ON public.recurring_payments FOR ALL
USING (can_access_company_data(company_id));

CREATE POLICY "Company members can manage communications"
ON public.athlete_communications FOR ALL
USING (can_access_company_data(company_id));

CREATE POLICY "Athletes can view their communications"
ON public.athlete_communications FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.athletes a
  WHERE a.id = athlete_communications.athlete_id
  AND a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
));

CREATE POLICY "Company members can manage message templates"
ON public.message_templates FOR ALL
USING (can_access_company_data(company_id));

-- Triggers para updated_at
CREATE TRIGGER update_physical_assessments_updated_at
BEFORE UPDATE ON public.physical_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_recurring_payments_updated_at
BEFORE UPDATE ON public.recurring_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_message_templates_updated_at
BEFORE UPDATE ON public.message_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_check_ins_athlete ON public.athlete_check_ins(athlete_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON public.athlete_check_ins(check_in_time);
CREATE INDEX IF NOT EXISTS idx_assessments_athlete ON public.physical_assessments(athlete_id);
CREATE INDEX IF NOT EXISTS idx_recurring_payments_athlete ON public.recurring_payments(athlete_id);
CREATE INDEX IF NOT EXISTS idx_communications_athlete ON public.athlete_communications(athlete_id);