-- Remover política problemática com recursão
DROP POLICY IF EXISTS "Admins can read all roles" ON public.user_roles;

-- As outras políticas já estão corretas usando a função has_role() 
-- que é SECURITY DEFINER e evita recursão

-- Comentário: As políticas restantes já funcionam corretamente:
-- 1. "Users can view their own roles" - permite ver próprias roles
-- 2. "Cagio admins can view all roles" - usa has_role() corretamente
-- 3. "Box owners can view company roles" - usa has_role() corretamente