-- Drop existing restrictive policies on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create a security definer function to check if user can access profile data
CREATE OR REPLACE FUNCTION public.can_access_profile(target_profile_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    -- Users can always access their own profile
    SELECT 1 WHERE auth.uid() = target_profile_id
    
    UNION
    
    -- Company owners can access profiles of users in their company
    SELECT 1 FROM profiles p
    JOIN companies c ON c.owner_id = auth.uid()
    WHERE p.id = target_profile_id
    AND (
      -- Profile belongs to a trainer in the company
      EXISTS (SELECT 1 FROM trainers t WHERE t.user_id = target_profile_id AND t.company_id = c.id)
      OR
      -- Profile belongs to the company owner
      c.owner_id = target_profile_id
    )
    
    UNION
    
    -- Trainers can access profiles of other trainers and athletes in the same company
    SELECT 1 FROM trainers t1
    JOIN companies c ON t1.company_id = c.id
    WHERE t1.user_id = auth.uid() 
    AND t1.status = 'active'
    AND (
      -- Target profile is the company owner
      c.owner_id = target_profile_id
      OR
      -- Target profile is another trainer in the same company
      EXISTS (SELECT 1 FROM trainers t2 WHERE t2.user_id = target_profile_id AND t2.company_id = c.id)
    )
  );
$$;

-- Create secure RLS policies for profiles table
CREATE POLICY "Users can view authorized profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (public.can_access_profile(id));

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update authorized profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  -- Users can update their own profile
  auth.uid() = id
  OR
  -- Company owners can update profiles in their company (limited fields only)
  EXISTS (
    SELECT 1 FROM companies c 
    WHERE c.owner_id = auth.uid()
    AND (
      EXISTS (SELECT 1 FROM trainers t WHERE t.user_id = id AND t.company_id = c.id)
      OR c.owner_id = id
    )
  )
)
WITH CHECK (
  -- Users can update their own profile
  auth.uid() = id
  OR
  -- Company owners can update profiles in their company
  EXISTS (
    SELECT 1 FROM companies c 
    WHERE c.owner_id = auth.uid()
    AND (
      EXISTS (SELECT 1 FROM trainers t WHERE t.user_id = id AND t.company_id = c.id)
      OR c.owner_id = id
    )
  )
);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;