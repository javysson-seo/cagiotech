-- Criar tabela de configuração de pagamento de funcionários
CREATE TABLE IF NOT EXISTS staff_payment_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  payment_type text NOT NULL CHECK (payment_type IN ('monthly_salary', 'hourly', 'per_class', 'commission', 'mixed')),
  base_amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'EUR',
  hourly_rate numeric,
  per_class_rate numeric,
  commission_percentage numeric,
  payment_day integer CHECK (payment_day BETWEEN 1 AND 31),
  payment_frequency text DEFAULT 'monthly' CHECK (payment_frequency IN ('weekly', 'bi-weekly', 'monthly')),
  bank_account text,
  nib text,
  iban text,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(staff_id)
);

-- Criar tabela de folha de pagamento mensal
CREATE TABLE IF NOT EXISTS payroll (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  reference_month date NOT NULL, -- Primeiro dia do mês de referência
  base_salary numeric NOT NULL DEFAULT 0,
  hours_worked numeric DEFAULT 0,
  classes_taught integer DEFAULT 0,
  bonuses numeric DEFAULT 0,
  deductions numeric DEFAULT 0,
  commissions numeric DEFAULT 0,
  gross_amount numeric NOT NULL,
  net_amount numeric NOT NULL,
  tax_amount numeric DEFAULT 0,
  social_security numeric DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  payment_date date,
  payment_method text,
  notes text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de registro de horas/aulas (para cálculo de folha)
CREATE TABLE IF NOT EXISTS staff_work_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  staff_id uuid NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  log_date date NOT NULL,
  log_type text NOT NULL CHECK (log_type IN ('hours', 'class', 'bonus', 'deduction')),
  hours_worked numeric,
  class_id uuid,
  amount numeric,
  description text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

-- RLS para staff_payment_config
ALTER TABLE staff_payment_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Box owners can manage payment configs"
ON staff_payment_config FOR ALL
USING (has_role(auth.uid(), 'box_owner', company_id))
WITH CHECK (has_role(auth.uid(), 'box_owner', company_id));

CREATE POLICY "Staff can view own payment config"
ON staff_payment_config FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM staff s
    WHERE s.id = staff_payment_config.staff_id
    AND s.user_id = auth.uid()
  )
);

-- RLS para payroll
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Box owners can manage payroll"
ON payroll FOR ALL
USING (has_role(auth.uid(), 'box_owner', company_id))
WITH CHECK (has_role(auth.uid(), 'box_owner', company_id));

CREATE POLICY "Staff can view own payroll"
ON payroll FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM staff s
    WHERE s.id = payroll.staff_id
    AND s.user_id = auth.uid()
  )
);

-- RLS para staff_work_log
ALTER TABLE staff_work_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Box owners can manage work logs"
ON staff_work_log FOR ALL
USING (has_role(auth.uid(), 'box_owner', company_id))
WITH CHECK (has_role(auth.uid(), 'box_owner', company_id));

CREATE POLICY "Staff can view own work logs"
ON staff_work_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM staff s
    WHERE s.id = staff_work_log.staff_id
    AND s.user_id = auth.uid()
  )
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_staff_payment_config_staff ON staff_payment_config(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_payment_config_company ON staff_payment_config(company_id);
CREATE INDEX IF NOT EXISTS idx_payroll_company ON payroll(company_id);
CREATE INDEX IF NOT EXISTS idx_payroll_staff ON payroll(staff_id);
CREATE INDEX IF NOT EXISTS idx_payroll_month ON payroll(reference_month);
CREATE INDEX IF NOT EXISTS idx_staff_work_log_company ON staff_work_log(company_id);
CREATE INDEX IF NOT EXISTS idx_staff_work_log_staff ON staff_work_log(staff_id);
CREATE INDEX IF NOT EXISTS idx_staff_work_log_date ON staff_work_log(log_date);

-- Triggers
CREATE TRIGGER update_staff_payment_config_updated_at
  BEFORE UPDATE ON staff_payment_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at
  BEFORE UPDATE ON payroll
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();