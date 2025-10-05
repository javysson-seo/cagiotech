-- Melhorar tabela de cupons para suportar desconto por valor ou porcentagem
ALTER TABLE discount_coupons 
  ADD COLUMN IF NOT EXISTS discount_type text DEFAULT 'percentage',
  ADD COLUMN IF NOT EXISTS discount_value numeric;

-- Atualizar cupons existentes
UPDATE discount_coupons 
SET discount_type = 'percentage', 
    discount_value = discount_percentage 
WHERE discount_value IS NULL;

-- Criar tabela de documentos da empresa (contratos, termos, etc)
CREATE TABLE IF NOT EXISTS company_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  document_type text NOT NULL, -- contract, term, policy, other
  file_url text NOT NULL,
  file_size integer,
  uploaded_by uuid REFERENCES auth.users(id),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para documentos da empresa
ALTER TABLE company_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Box owners can manage company documents"
ON company_documents FOR ALL
USING (has_role(auth.uid(), 'box_owner', company_id))
WITH CHECK (has_role(auth.uid(), 'box_owner', company_id));

CREATE POLICY "Company members can view company documents"
ON company_documents FOR SELECT
USING (can_access_company_data(company_id));

-- Criar tabela de horários de funcionamento
CREATE TABLE IF NOT EXISTS company_schedule (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
  is_open boolean DEFAULT true,
  open_time time,
  close_time time,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(company_id, day_of_week)
);

-- RLS para horários
ALTER TABLE company_schedule ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Box owners can manage schedule"
ON company_schedule FOR ALL
USING (has_role(auth.uid(), 'box_owner', company_id))
WITH CHECK (has_role(auth.uid(), 'box_owner', company_id));

CREATE POLICY "Everyone can view company schedule"
ON company_schedule FOR SELECT
USING (true);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_company_documents_company ON company_documents(company_id);
CREATE INDEX IF NOT EXISTS idx_company_documents_type ON company_documents(document_type);
CREATE INDEX IF NOT EXISTS idx_company_schedule_company ON company_schedule(company_id);
CREATE INDEX IF NOT EXISTS idx_company_schedule_day ON company_schedule(day_of_week);

-- Trigger para updated_at
CREATE TRIGGER update_company_documents_updated_at
  BEFORE UPDATE ON company_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_schedule_updated_at
  BEFORE UPDATE ON company_schedule
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();