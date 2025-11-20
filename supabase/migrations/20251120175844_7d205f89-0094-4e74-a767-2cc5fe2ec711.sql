-- Add approval system for companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Create platform_suggestions table for companies to suggest features
CREATE TABLE IF NOT EXISTS public.platform_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  votes INTEGER DEFAULT 1,
  is_public BOOLEAN DEFAULT false,
  admin_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  implemented_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create admin_financial_overview table
CREATE TABLE IF NOT EXISTS public.admin_financial_overview (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month DATE NOT NULL UNIQUE,
  total_companies INTEGER DEFAULT 0,
  active_subscriptions INTEGER DEFAULT 0,
  revenue_mrr DECIMAL(10,2) DEFAULT 0,
  revenue_arr DECIMAL(10,2) DEFAULT 0,
  new_companies INTEGER DEFAULT 0,
  churned_companies INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.platform_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_financial_overview ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Companies can create suggestions" ON public.platform_suggestions;
DROP POLICY IF EXISTS "Companies can view their own suggestions" ON public.platform_suggestions;
DROP POLICY IF EXISTS "Admins can manage all suggestions" ON public.platform_suggestions;
DROP POLICY IF EXISTS "Only admins can view financial overview" ON public.admin_financial_overview;
DROP POLICY IF EXISTS "Only admins can manage financial overview" ON public.admin_financial_overview;

-- RLS Policies for platform_suggestions
CREATE POLICY "Companies can create suggestions"
ON public.platform_suggestions
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = company_id
    AND c.owner_id = auth.uid()
  )
);

CREATE POLICY "Companies can view their own suggestions"
ON public.platform_suggestions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = company_id
    AND c.owner_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'cagio_admin', NULL)
);

CREATE POLICY "Admins can manage all suggestions"
ON public.platform_suggestions
FOR ALL
USING (public.has_role(auth.uid(), 'cagio_admin', NULL));

-- RLS Policies for admin_financial_overview
CREATE POLICY "Only admins can view financial overview"
ON public.admin_financial_overview
FOR SELECT
USING (public.has_role(auth.uid(), 'cagio_admin', NULL));

CREATE POLICY "Only admins can manage financial overview"
ON public.admin_financial_overview
FOR ALL
USING (public.has_role(auth.uid(), 'cagio_admin', NULL));

-- Drop and recreate triggers
DROP TRIGGER IF EXISTS update_platform_suggestions_updated_at ON public.platform_suggestions;
DROP TRIGGER IF EXISTS update_admin_financial_overview_updated_at ON public.admin_financial_overview;

CREATE TRIGGER update_platform_suggestions_updated_at
BEFORE UPDATE ON public.platform_suggestions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_financial_overview_updated_at
BEFORE UPDATE ON public.admin_financial_overview
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_platform_suggestions_company_id ON public.platform_suggestions(company_id);
CREATE INDEX IF NOT EXISTS idx_platform_suggestions_status ON public.platform_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_companies_is_approved ON public.companies(is_approved);
CREATE INDEX IF NOT EXISTS idx_companies_subscription_status ON public.companies(subscription_status);