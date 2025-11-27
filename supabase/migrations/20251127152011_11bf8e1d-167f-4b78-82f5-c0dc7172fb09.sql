-- Remove ALL existing policies from user_roles to start fresh
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Cagio admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Box owners can view company roles" ON public.user_roles;
DROP POLICY IF EXISTS "Cagio admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Box owners can manage company roles" ON public.user_roles;

-- Simple policy: users can ALWAYS view their own roles (no recursion)
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Policy: users who own a company can view all roles for that company
-- This uses companies table directly, avoiding user_roles recursion
CREATE POLICY "Company owners can view company roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
);

-- Policy: Service role can do everything (for backend operations)
CREATE POLICY "Service role full access"
ON public.user_roles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Simple INSERT policy: users can only create roles for themselves or for their companies
CREATE POLICY "Users can insert own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  user_id = auth.uid()
  OR company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
);

-- Simple UPDATE policy: company owners can update roles in their company
CREATE POLICY "Company owners can update company roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (
  company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
)
WITH CHECK (
  company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
);

-- Simple DELETE policy: company owners can delete roles in their company
CREATE POLICY "Company owners can delete company roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (
  company_id IN (
    SELECT id FROM public.companies 
    WHERE owner_id = auth.uid()
  )
);