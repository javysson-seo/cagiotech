-- Adicionar campos ao staff
ALTER TABLE public.staff 
ADD COLUMN IF NOT EXISTS salary NUMERIC(10,2),
ADD COLUMN IF NOT EXISTS profile_photo TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_name TEXT,
ADD COLUMN IF NOT EXISTS emergency_contact_phone TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Criar tabela de documentos de funcionários
CREATE TABLE IF NOT EXISTS public.staff_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'id', 'certificate', 'medical', 'other')),
  file_url TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Criar tabela para configurar quais documentos da empresa são termos obrigatórios
CREATE TABLE IF NOT EXISTS public.staff_required_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.company_documents(id) ON DELETE CASCADE,
  is_required BOOLEAN DEFAULT true,
  auto_accept BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, document_id)
);

-- Criar tabela de aceitação de termos por funcionários
CREATE TABLE IF NOT EXISTS public.staff_term_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id UUID NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES public.company_documents(id) ON DELETE CASCADE,
  accepted_at TIMESTAMPTZ DEFAULT now(),
  ip_address TEXT,
  user_agent TEXT,
  UNIQUE(staff_id, document_id)
);

-- Enable RLS
ALTER TABLE public.staff_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_required_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_term_acceptances ENABLE ROW LEVEL SECURITY;

-- RLS para staff_documents
CREATE POLICY "Company members can manage staff documents"
ON public.staff_documents
FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

-- RLS para staff_required_terms
CREATE POLICY "Box owners can manage required terms"
ON public.staff_required_terms
FOR ALL
USING (has_role(auth.uid(), 'box_owner'::app_role, company_id))
WITH CHECK (has_role(auth.uid(), 'box_owner'::app_role, company_id));

CREATE POLICY "Staff can view required terms"
ON public.staff_required_terms
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.staff s
    WHERE s.user_id = auth.uid()
    AND s.company_id = staff_required_terms.company_id
  )
);

-- RLS para staff_term_acceptances
CREATE POLICY "Company members can view term acceptances"
ON public.staff_term_acceptances
FOR SELECT
USING (can_access_company_data(company_id));

CREATE POLICY "Staff can accept their own terms"
ON public.staff_term_acceptances
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.staff s
    WHERE s.id = staff_term_acceptances.staff_id
    AND s.user_id = auth.uid()
  )
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_staff_documents_staff_id ON public.staff_documents(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_required_terms_company ON public.staff_required_terms(company_id);
CREATE INDEX IF NOT EXISTS idx_staff_term_acceptances_staff ON public.staff_term_acceptances(staff_id);