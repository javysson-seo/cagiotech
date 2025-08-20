-- Drop the existing restrictive policy for athletes
DROP POLICY IF EXISTS "Company members can manage athletes" ON public.athletes;

-- Create a security definer function to check if user can access company data
CREATE OR REPLACE FUNCTION public.can_access_company_data(target_company_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Check if user is company owner
    SELECT 1 FROM companies 
    WHERE id = target_company_id AND owner_id = auth.uid()
    
    UNION
    
    -- Check if user is a trainer in the company
    SELECT 1 FROM trainers 
    WHERE company_id = target_company_id AND user_id = auth.uid() AND status = 'active'
    
    UNION
    
    -- Check if user is a profile with role that belongs to the company
    SELECT 1 FROM profiles p
    JOIN companies c ON c.owner_id = p.id
    WHERE c.id = target_company_id AND p.id = auth.uid()
  );
$$;

-- Create comprehensive RLS policies for athletes table
CREATE POLICY "Authorized users can view athletes"
ON public.athletes
FOR SELECT
TO authenticated
USING (public.can_access_company_data(company_id));

CREATE POLICY "Authorized users can insert athletes"
ON public.athletes
FOR INSERT
TO authenticated
WITH CHECK (public.can_access_company_data(company_id));

CREATE POLICY "Authorized users can update athletes"
ON public.athletes
FOR UPDATE
TO authenticated
USING (public.can_access_company_data(company_id))
WITH CHECK (public.can_access_company_data(company_id));

CREATE POLICY "Authorized users can delete athletes"
ON public.athletes
FOR DELETE
TO authenticated
USING (public.can_access_company_data(company_id));

-- Ensure RLS is enabled
ALTER TABLE public.athletes ENABLE ROW LEVEL SECURITY;