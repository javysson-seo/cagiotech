-- Fix circular dependency in user_roles RLS policies
-- Drop existing policies that use has_role()
DROP POLICY IF EXISTS "Cagio admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Box owners can view company roles" ON public.user_roles;
DROP POLICY IF EXISTS "Box owners can manage company roles" ON public.user_roles;
DROP POLICY IF EXISTS "Cagio admins can manage all roles" ON public.user_roles;

-- Recreate simplified policies without circular dependencies
-- Users can always view their own roles (no circular dependency)
-- This policy already exists and is correct:
-- CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

-- Cagio admins can view all roles (direct check without function)
CREATE POLICY "Cagio admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'cagio_admin'
    LIMIT 1
  )
);

-- Box owners can view roles in their company (direct check without function)
CREATE POLICY "Box owners can view company roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT c.id FROM public.companies c
    INNER JOIN public.user_roles ur ON ur.company_id = c.id
    WHERE c.owner_id = auth.uid()
    AND ur.user_id = auth.uid()
  )
);

-- Cagio admins can manage all roles (direct check without function)
CREATE POLICY "Cagio admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'cagio_admin'
    LIMIT 1
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.role = 'cagio_admin'
    LIMIT 1
  )
);

-- Box owners can manage roles in their company (direct check without function)
CREATE POLICY "Box owners can manage company roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (
  company_id IN (
    SELECT c.id FROM public.companies c
    WHERE c.owner_id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT c.id FROM public.companies c
    WHERE c.owner_id = auth.uid()
  )
);