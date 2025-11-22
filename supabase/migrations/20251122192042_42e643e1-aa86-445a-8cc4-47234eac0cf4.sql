-- Add RLS policies for user_roles table to fix "permission denied" errors
CREATE POLICY "Users can read own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
    AND role = 'cagio_admin'
  )
);

CREATE POLICY "Service role can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  current_setting('request.jwt.claims', true)::json->>'role' = 'service_role'
);

-- Create Enterprise subscription plan
INSERT INTO public.cagio_subscription_plans (
  name,
  slug,
  description,
  price_monthly,
  price_yearly,
  features,
  max_athletes,
  max_staff,
  max_classes_per_month,
  is_active,
  display_order
) VALUES (
  'Enterprise',
  'enterprise',
  'Plano completo com todas as funcionalidades e acesso ilimitado',
  149.99,
  1599.99,
  '["Atletas ilimitados", "Staff ilimitado", "Classes ilimitadas", "Todas as funcionalidades", "Relatórios avançados completos", "Integrações premium", "API completa", "Suporte 24/7 prioritário", "White label disponível", "Treinamento personalizado", "Gestor de conta dedicado", "SLA garantido"]'::jsonb,
  NULL,
  NULL,
  NULL,
  true,
  4
) ON CONFLICT (slug) DO NOTHING;