
-- Adicionar role cagio_admin para acesso total ao sistema
INSERT INTO public.user_roles (user_id, role, company_id)
VALUES (
  '381cf1a0-3dbd-4ce1-bd2e-6b15a3cbc544',
  'cagio_admin',
  NULL
)
ON CONFLICT (user_id, role, company_id) DO NOTHING;
