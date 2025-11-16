-- Create cagio_subscription_plans table for platform subscription plans
CREATE TABLE IF NOT EXISTS public.cagio_subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2) NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  max_athletes INTEGER,
  max_staff INTEGER,
  max_classes_per_month INTEGER,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add subscription fields to companies table if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'subscription_plan') THEN
    ALTER TABLE public.companies ADD COLUMN subscription_plan TEXT;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'subscription_status') THEN
    ALTER TABLE public.companies ADD COLUMN subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'cancelled', 'expired'));
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'trial_start_date') THEN
    ALTER TABLE public.companies ADD COLUMN trial_start_date TIMESTAMPTZ DEFAULT now();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'trial_end_date') THEN
    ALTER TABLE public.companies ADD COLUMN trial_end_date TIMESTAMPTZ DEFAULT (now() + INTERVAL '14 days');
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'subscription_start_date') THEN
    ALTER TABLE public.companies ADD COLUMN subscription_start_date TIMESTAMPTZ;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'companies' AND column_name = 'subscription_end_date') THEN
    ALTER TABLE public.companies ADD COLUMN subscription_end_date TIMESTAMPTZ;
  END IF;
END $$;

-- Create cagio_subscription_payments table for tracking platform subscription payments
CREATE TABLE IF NOT EXISTS public.cagio_subscription_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.cagio_subscription_plans(id),
  billing_period TEXT NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('multibanco', 'mbway')),
  transaction_id UUID REFERENCES public.payment_transactions(id),
  due_date TIMESTAMPTZ NOT NULL,
  paid_date TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cagio_subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cagio_subscription_payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cagio_subscription_plans (public read, admin write)
CREATE POLICY "Public can view active subscription plans"
  ON public.cagio_subscription_plans
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Cagio admins can manage subscription plans"
  ON public.cagio_subscription_plans
  FOR ALL
  USING (public.has_role(auth.uid(), 'cagio_admin', NULL));

-- RLS Policies for cagio_subscription_payments
CREATE POLICY "Box owners can view their own subscription payments"
  ON public.cagio_subscription_payments
  FOR SELECT
  USING (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
    OR public.has_role(auth.uid(), 'cagio_admin', NULL)
  );

CREATE POLICY "Box owners can create their own subscription payments"
  ON public.cagio_subscription_payments
  FOR INSERT
  WITH CHECK (
    company_id IN (
      SELECT id FROM public.companies WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "System can update subscription payments"
  ON public.cagio_subscription_payments
  FOR UPDATE
  USING (true);

-- Insert default Cagio subscription plans
INSERT INTO public.cagio_subscription_plans (name, slug, description, price_monthly, price_yearly, features, max_athletes, max_staff, max_classes_per_month, display_order)
VALUES 
  (
    'Free',
    'free',
    'Ideal para começar',
    0,
    0,
    '["Até 10 atletas", "1 staff", "Funcionalidades básicas", "Suporte por email"]'::jsonb,
    10,
    1,
    50,
    1
  ),
  (
    'Pro',
    'pro',
    'Para boxes em crescimento',
    29.99,
    299.90,
    '["Até 100 atletas", "5 staff", "Todas as funcionalidades", "Relatórios avançados", "Suporte prioritário"]'::jsonb,
    100,
    5,
    NULL,
    2
  ),
  (
    'Business',
    'business',
    'Para boxes estabelecidos',
    79.99,
    799.90,
    '["Atletas ilimitados", "Staff ilimitado", "Todas as funcionalidades", "Relatórios avançados", "Integrações premium", "Suporte 24/7"]'::jsonb,
    NULL,
    NULL,
    NULL,
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_cagio_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cagio_subscription_plans_updated_at
  BEFORE UPDATE ON public.cagio_subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_cagio_subscription_updated_at();

CREATE TRIGGER update_cagio_subscription_payments_updated_at
  BEFORE UPDATE ON public.cagio_subscription_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_cagio_subscription_updated_at();