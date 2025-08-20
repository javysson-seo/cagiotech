
-- Adicionar colunas que faltam na tabela athletes para compatibilidade com o frontend
ALTER TABLE public.athletes 
ADD COLUMN IF NOT EXISTS address text,
ADD COLUMN IF NOT EXISTS plan text,
ADD COLUMN IF NOT EXISTS trainer text,
ADD COLUMN IF NOT EXISTS "group" text,
ADD COLUMN IF NOT EXISTS monthly_fee numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS join_date date DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS goals text[],
ADD COLUMN IF NOT EXISTS notes text,
ADD COLUMN IF NOT EXISTS nutrition_preview text,
ADD COLUMN IF NOT EXISTS profile_photo text;

-- Criar tabela para documentos dos atletas
CREATE TABLE IF NOT EXISTS public.athlete_documents (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL,
  file_url text NOT NULL,
  file_size integer,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela de documentos
ALTER TABLE public.athlete_documents ENABLE ROW LEVEL SECURITY;

-- Política para visualizar documentos
CREATE POLICY "Company members can view athlete documents" 
ON public.athlete_documents 
FOR SELECT 
USING (can_access_company_data(company_id));

-- Política para inserir documentos
CREATE POLICY "Company members can insert athlete documents" 
ON public.athlete_documents 
FOR INSERT 
WITH CHECK (can_access_company_data(company_id));

-- Política para atualizar documentos
CREATE POLICY "Company members can update athlete documents" 
ON public.athlete_documents 
FOR UPDATE 
USING (can_access_company_data(company_id));

-- Política para deletar documentos
CREATE POLICY "Company members can delete athlete documents" 
ON public.athlete_documents 
FOR DELETE 
USING (can_access_company_data(company_id));

-- Criar tabela para histórico de atividades dos atletas
CREATE TABLE IF NOT EXISTS public.athlete_activities (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type text NOT NULL, -- 'created', 'updated', 'payment', 'document_added', etc.
  description text NOT NULL,
  performed_by uuid REFERENCES auth.users(id),
  performed_by_name text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela de atividades
ALTER TABLE public.athlete_activities ENABLE ROW LEVEL SECURITY;

-- Política para visualizar atividades
CREATE POLICY "Company members can view athlete activities" 
ON public.athlete_activities 
FOR SELECT 
USING (can_access_company_data(company_id));

-- Política para inserir atividades
CREATE POLICY "Company members can insert athlete activities" 
ON public.athlete_activities 
FOR INSERT 
WITH CHECK (can_access_company_data(company_id));

-- Criar tabela para pagamentos dos atletas
CREATE TABLE IF NOT EXISTS public.athlete_payments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  athlete_id uuid NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  due_date date NOT NULL,
  paid_date date,
  status text NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'overdue'
  payment_method text,
  installment_number integer,
  total_installments integer,
  plan_name text,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS na tabela de pagamentos
ALTER TABLE public.athlete_payments ENABLE ROW LEVEL SECURITY;

-- Política para visualizar pagamentos
CREATE POLICY "Company members can view athlete payments" 
ON public.athlete_payments 
FOR SELECT 
USING (can_access_company_data(company_id));

-- Política para inserir pagamentos
CREATE POLICY "Company members can insert athlete payments" 
ON public.athlete_payments 
FOR INSERT 
WITH CHECK (can_access_company_data(company_id));

-- Política para atualizar pagamentos
CREATE POLICY "Company members can update athlete payments" 
ON public.athlete_payments 
FOR UPDATE 
USING (can_access_company_data(company_id));

-- Política para deletar pagamentos
CREATE POLICY "Company members can delete athlete payments" 
ON public.athlete_payments 
FOR DELETE 
USING (can_access_company_data(company_id));
