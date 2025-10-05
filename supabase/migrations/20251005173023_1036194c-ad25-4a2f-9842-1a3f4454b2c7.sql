-- Tabela para armazenar configurações de pagamento por empresa
CREATE TABLE public.payment_gateway_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  gateway_type TEXT NOT NULL CHECK (gateway_type IN ('ifthenpay')),
  is_enabled BOOLEAN DEFAULT false,
  is_sandbox BOOLEAN DEFAULT true,
  settings JSONB NOT NULL DEFAULT '{}', -- Armazenará as chaves criptografadas
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, gateway_type)
);

-- Tabela para registrar transações de pagamento
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.athlete_payments(id) ON DELETE SET NULL,
  gateway_type TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('multibanco', 'mbway', 'credit_card')),
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  reference TEXT, -- Referência Multibanco ou ID da transação
  entity TEXT, -- Entidade Multibanco
  phone_number TEXT, -- Para MBway
  transaction_id TEXT, -- ID da transação do gateway
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'failed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  paid_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela para logs de webhooks/callbacks
CREATE TABLE public.payment_webhooks_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
  gateway_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processed', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX idx_payment_transactions_company ON public.payment_transactions(company_id);
CREATE INDEX idx_payment_transactions_athlete ON public.payment_transactions(athlete_id);
CREATE INDEX idx_payment_transactions_reference ON public.payment_transactions(reference);
CREATE INDEX idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX idx_payment_webhooks_log_company ON public.payment_webhooks_log(company_id);

-- RLS Policies
ALTER TABLE public.payment_gateway_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhooks_log ENABLE ROW LEVEL SECURITY;

-- Payment Gateway Settings
CREATE POLICY "Box owners can manage their payment settings"
ON public.payment_gateway_settings FOR ALL
USING (public.has_role(auth.uid(), 'box_owner'::app_role, company_id))
WITH CHECK (public.has_role(auth.uid(), 'box_owner'::app_role, company_id));

-- Payment Transactions
CREATE POLICY "Company members can view transactions"
ON public.payment_transactions FOR SELECT
USING (public.can_access_company_data(company_id));

CREATE POLICY "Company members can create transactions"
ON public.payment_transactions FOR INSERT
WITH CHECK (public.can_access_company_data(company_id));

CREATE POLICY "Athletes can view their own transactions"
ON public.payment_transactions FOR SELECT
USING (
  athlete_id IN (
    SELECT id FROM public.athletes 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Payment Webhooks Log (apenas admins)
CREATE POLICY "Box owners can view webhook logs"
ON public.payment_webhooks_log FOR SELECT
USING (public.has_role(auth.uid(), 'box_owner'::app_role, company_id));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_payment_gateway_settings_updated_at
BEFORE UPDATE ON public.payment_gateway_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at
BEFORE UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para marcar pagamento como pago quando transação é confirmada
CREATE OR REPLACE FUNCTION public.update_payment_on_transaction_paid()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'paid' AND OLD.status != 'paid' AND NEW.payment_id IS NOT NULL THEN
    UPDATE public.athlete_payments
    SET 
      status = 'paid',
      paid_date = COALESCE(NEW.paid_at, now()),
      payment_method = NEW.payment_method,
      updated_at = now()
    WHERE id = NEW.payment_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_payment_on_transaction_paid
AFTER UPDATE ON public.payment_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_payment_on_transaction_paid();