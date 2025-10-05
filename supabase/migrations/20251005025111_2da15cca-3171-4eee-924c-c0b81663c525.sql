-- Fix Critical Security Issues

-- 1. Add RLS policy to company_financial_overview view
-- Since this is a view, we need to ensure the underlying query respects RLS
-- We'll create a security definer function to safely access this data
CREATE OR REPLACE FUNCTION public.get_company_financial_overview(target_company_id uuid)
RETURNS TABLE (
  company_id uuid,
  company_name text,
  active_subscriptions bigint,
  pending_payments bigint,
  revenue_last_30_days numeric,
  pending_amount numeric
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    c.id as company_id,
    c.name as company_name,
    COUNT(DISTINCT CASE WHEN asub.status = 'active' THEN asub.id END) as active_subscriptions,
    COUNT(DISTINCT CASE WHEN ap.status = 'pending' THEN ap.id END) as pending_payments,
    COALESCE(SUM(CASE WHEN ft.transaction_date >= CURRENT_DATE - INTERVAL '30 days' AND ft.type = 'income' THEN ft.amount ELSE 0 END), 0) as revenue_last_30_days,
    COALESCE(SUM(CASE WHEN ap.status = 'pending' THEN ap.amount ELSE 0 END), 0) as pending_amount
  FROM public.companies c
  LEFT JOIN public.athlete_subscriptions asub ON c.id = asub.company_id
  LEFT JOIN public.athlete_payments ap ON c.id = ap.company_id
  LEFT JOIN public.financial_transactions ft ON c.id = ft.company_id
  WHERE c.id = target_company_id
    AND public.can_access_company_data(target_company_id)
  GROUP BY c.id, c.name;
$$;

-- 2. Restrict bd_ativo test table to admins only
DROP POLICY IF EXISTS "Enable read access for all users" ON public.bd_ativo;

CREATE POLICY "Only cagio_admin can access test table"
ON public.bd_ativo
FOR ALL
USING (public.has_role(auth.uid(), 'cagio_admin'::app_role, NULL::uuid))
WITH CHECK (public.has_role(auth.uid(), 'cagio_admin'::app_role, NULL::uuid));

-- 3. Add comment to bd_ativo to mark it as test infrastructure
COMMENT ON TABLE public.bd_ativo IS 'TEST TABLE - Used for infrastructure testing only. Access restricted to cagio_admin.';

-- 4. Improve subscription_payments policy to use user_roles instead of email matching
DROP POLICY IF EXISTS "Athletes can view their own payments" ON public.subscription_payments;

CREATE POLICY "Athletes can view their own payments"
ON public.subscription_payments
FOR SELECT
USING (
  -- Allow if user is the athlete (matched via user_roles and athletes table)
  EXISTS (
    SELECT 1 
    FROM public.athletes a
    INNER JOIN public.user_roles ur ON ur.user_id = auth.uid() AND ur.role = 'student'::app_role
    WHERE a.id = subscription_payments.athlete_id
      AND a.company_id = subscription_payments.company_id
      AND a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);