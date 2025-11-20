-- Atualizar política de INSERT para permitir que usuários se tornem admin
-- apenas se ainda não existem admins no sistema (primeira configuração)
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;

CREATE POLICY "First user or admin can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  -- Permitir se for o próprio usuário E ainda não existe nenhum admin
  (auth.uid() = user_id AND role = 'cagio_admin' AND NOT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'cagio_admin'
  ))
  OR
  -- OU se já for admin
  public.has_role(auth.uid(), 'cagio_admin')
);

-- Comentário explicativo
COMMENT ON POLICY "First user or admin can insert roles" ON public.user_roles IS 
'Permite que o primeiro usuário se torne admin através de /admin/setup. Depois disso, apenas admins podem atribuir roles.';