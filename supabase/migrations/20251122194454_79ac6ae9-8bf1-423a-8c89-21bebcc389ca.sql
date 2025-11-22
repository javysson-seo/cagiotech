-- Fix existing users without roles
-- Add box_owner role for company owners that don't have roles yet

INSERT INTO public.user_roles (user_id, role, company_id)
SELECT 
  c.owner_id,
  'box_owner'::app_role,
  c.id
FROM public.companies c
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles ur 
  WHERE ur.user_id = c.owner_id AND ur.company_id = c.id
)
ON CONFLICT (user_id, role, company_id) DO NOTHING;

-- Update companies without subscription_plan to use enterprise
UPDATE public.companies
SET subscription_plan = 'enterprise'
WHERE subscription_plan IS NULL;