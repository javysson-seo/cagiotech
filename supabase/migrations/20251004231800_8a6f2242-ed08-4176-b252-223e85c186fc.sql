-- ============================================================================
-- CORREÇÃO DE SEGURANÇA: Remover SECURITY DEFINER da VIEW
-- ============================================================================

-- Recriar a view sem SECURITY DEFINER (padrão é SECURITY INVOKER)
DROP VIEW IF EXISTS public.company_financial_overview;

CREATE VIEW public.company_financial_overview 
WITH (security_invoker = true)
AS
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

-- Garantir que apenas usuários com permissão vejam os dados
COMMENT ON VIEW public.company_financial_overview IS 'Dashboard financeiro - respeita RLS policies das tabelas subjacentes';