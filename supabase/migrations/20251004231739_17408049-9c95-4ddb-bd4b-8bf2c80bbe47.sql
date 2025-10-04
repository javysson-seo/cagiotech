-- ============================================================================
-- FASE 2: SISTEMA DE PAGAMENTOS MULTI-TENANT - Estrutura Segura (CORRIGIDA)
-- ============================================================================

-- 1. TABELA DE PLANOS (Plans Management)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR',
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'quarterly', 'yearly')),
  features JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  max_classes_per_week INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 2. TABELA DE MÉTODOS DE PAGAMENTO DISPONÍVEIS POR EMPRESA
CREATE TABLE IF NOT EXISTS public.company_payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  method_type TEXT NOT NULL CHECK (method_type IN ('credit_card', 'mb_way', 'multibanco', 'bank_transfer', 'paypal')),
  is_enabled BOOLEAN DEFAULT true,
  configuration JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id, method_type)
);

-- 3. TABELA DE ASSINATURAS DOS ALUNOS (SEM CHECK constraint problemática)
CREATE TABLE IF NOT EXISTS public.athlete_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled', 'expired', 'suspended')),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  next_billing_date DATE,
  payment_method TEXT,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancelled_by UUID REFERENCES auth.users(id),
  cancellation_reason TEXT
);

-- 4. TRIGGER PARA VALIDAR athlete_id x company_id
CREATE OR REPLACE FUNCTION public.validate_athlete_subscription_company()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  athlete_company_id UUID;
BEGIN
  -- Buscar company_id do athlete
  SELECT company_id INTO athlete_company_id
  FROM public.athletes
  WHERE id = NEW.athlete_id;
  
  -- Verificar se corresponde
  IF athlete_company_id != NEW.company_id THEN
    RAISE EXCEPTION 'Athlete does not belong to this company';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER validate_athlete_subscription_company_trigger
BEFORE INSERT OR UPDATE ON public.athlete_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.validate_athlete_subscription_company();

-- 5. TABELA DE HISTÓRICO DE PAGAMENTOS
CREATE TABLE IF NOT EXISTS public.subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES public.athlete_subscriptions(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'EUR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
  payment_method TEXT NOT NULL,
  payment_date DATE,
  due_date DATE NOT NULL,
  external_payment_id TEXT,
  payment_proof_url TEXT,
  notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_subscription_plans_company ON public.subscription_plans(company_id) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_athlete_subscriptions_athlete ON public.athlete_subscriptions(athlete_id);
CREATE INDEX IF NOT EXISTS idx_athlete_subscriptions_company ON public.athlete_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_athlete_subscriptions_status ON public.athlete_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription ON public.subscription_payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_company ON public.subscription_payments(company_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON public.subscription_payments(status);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_due_date ON public.subscription_payments(due_date) WHERE status = 'pending';

-- 7. TRIGGERS PARA updated_at
CREATE TRIGGER update_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_payment_methods_updated_at
BEFORE UPDATE ON public.company_payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_athlete_subscriptions_updated_at
BEFORE UPDATE ON public.athlete_subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_payments_updated_at
BEFORE UPDATE ON public.subscription_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 8. RLS POLICIES - SUBSCRIPTION_PLANS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage subscription plans"
ON public.subscription_plans
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'staff_member', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'staff_member', company_id)
);

CREATE POLICY "Athletes can view active plans from their company"
ON public.subscription_plans
FOR SELECT
TO authenticated
USING (
  is_active = true
  AND EXISTS (
    SELECT 1 FROM public.athletes a
    WHERE a.company_id = subscription_plans.company_id
    AND EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'student'
    )
  )
);

-- 9. RLS POLICIES - COMPANY_PAYMENT_METHODS
ALTER TABLE public.company_payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Box owners can manage payment methods"
ON public.company_payment_methods
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
);

CREATE POLICY "Company members can view enabled payment methods"
ON public.company_payment_methods
FOR SELECT
TO authenticated
USING (
  is_enabled = true
  AND (
    public.has_role(auth.uid(), 'cagio_admin', NULL)
    OR public.has_role(auth.uid(), 'box_owner', company_id)
    OR public.has_role(auth.uid(), 'personal_trainer', company_id)
    OR public.has_role(auth.uid(), 'staff_member', company_id)
    OR EXISTS (
      SELECT 1 FROM public.athletes a
      WHERE a.company_id = company_payment_methods.company_id
      AND EXISTS (
        SELECT 1 FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role = 'student'
      )
    )
  )
);

-- 10. RLS POLICIES - ATHLETE_SUBSCRIPTIONS
ALTER TABLE public.athlete_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage subscriptions"
ON public.athlete_subscriptions
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'personal_trainer', company_id)
  OR public.has_role(auth.uid(), 'staff_member', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'staff_member', company_id)
);

CREATE POLICY "Athletes can view their own subscriptions"
ON public.athlete_subscriptions
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.athletes a
    WHERE a.id = athlete_id
    AND a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- 11. RLS POLICIES - SUBSCRIPTION_PAYMENTS
ALTER TABLE public.subscription_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage payments"
ON public.subscription_payments
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'staff_member', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'staff_member', company_id)
);

CREATE POLICY "Athletes can view their own payments"
ON public.subscription_payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.athletes a
    WHERE a.id = athlete_id
    AND a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- 12. FUNÇÃO PARA CALCULAR PRÓXIMA DATA DE COBRANÇA
CREATE OR REPLACE FUNCTION public.calculate_next_billing_date(
  start_date DATE,
  billing_period TEXT
)
RETURNS DATE
LANGUAGE plpgsql
STABLE
AS $$
BEGIN
  RETURN CASE billing_period
    WHEN 'monthly' THEN start_date + INTERVAL '1 month'
    WHEN 'quarterly' THEN start_date + INTERVAL '3 months'
    WHEN 'yearly' THEN start_date + INTERVAL '1 year'
    ELSE start_date + INTERVAL '1 month'
  END;
END;
$$;

-- 13. FUNÇÃO PARA VERIFICAR ASSINATURA ATIVA DO ALUNO
CREATE OR REPLACE FUNCTION public.athlete_has_active_subscription(
  _athlete_id UUID,
  _company_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.athlete_subscriptions
    WHERE athlete_id = _athlete_id
      AND company_id = _company_id
      AND status = 'active'
      AND (end_date IS NULL OR end_date >= CURRENT_DATE)
  )
$$;

-- 14. VIEW PARA DASHBOARD FINANCEIRO
CREATE OR REPLACE VIEW public.company_financial_overview AS
SELECT 
  c.id as company_id,
  c.name as company_name,
  COUNT(DISTINCT CASE WHEN asub.status = 'active' THEN asub.id END) as active_subscriptions,
  COUNT(DISTINCT CASE WHEN sp.status = 'pending' THEN sp.id END) as pending_payments,
  COALESCE(SUM(CASE WHEN sp.status = 'completed' AND sp.payment_date >= CURRENT_DATE - INTERVAL '30 days' THEN sp.amount END), 0) as revenue_last_30_days,
  COALESCE(SUM(CASE WHEN sp.status = 'pending' THEN sp.amount END), 0) as pending_amount
FROM public.companies c
LEFT JOIN public.athlete_subscriptions asub ON asub.company_id = c.id
LEFT JOIN public.subscription_payments sp ON sp.company_id = c.id
GROUP BY c.id, c.name;

-- 15. COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON TABLE public.subscription_plans IS 'Planos de assinatura criados por cada empresa';
COMMENT ON TABLE public.company_payment_methods IS 'Métodos de pagamento habilitados por cada empresa';
COMMENT ON TABLE public.athlete_subscriptions IS 'Assinaturas ativas/históricas dos alunos';
COMMENT ON TABLE public.subscription_payments IS 'Histórico de pagamentos das assinaturas';
COMMENT ON COLUMN public.subscription_payments.external_payment_id IS 'ID da transação no gateway (Stripe, Vendus, etc)';
COMMENT ON COLUMN public.subscription_payments.payment_proof_url IS 'URL do comprovante de pagamento (para transferências manuais)';