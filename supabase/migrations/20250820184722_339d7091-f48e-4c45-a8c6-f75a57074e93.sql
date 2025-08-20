
-- Fix SECURITY DEFINER functions by adding proper search_path
CREATE OR REPLACE FUNCTION public.can_access_company_data(target_company_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Create a proper function for profile update permissions
CREATE OR REPLACE FUNCTION public.can_update_profile(target_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
  SELECT EXISTS (
    -- Users can always update their own profile
    SELECT 1 WHERE auth.uid() = target_profile_id
    
    UNION
    
    -- Company owners can update profiles of users in their company ONLY
    SELECT 1 FROM profiles p
    JOIN companies c ON c.owner_id = auth.uid()
    WHERE p.id = target_profile_id
    AND (
      -- Profile belongs to a trainer in the company
      EXISTS (SELECT 1 FROM trainers t WHERE t.user_id = target_profile_id AND t.company_id = c.id)
    )
  );
$function$;

-- Update the existing can_access_profile function with proper search_path
CREATE OR REPLACE FUNCTION public.can_access_profile(target_profile_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = 'public'
AS $function$
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
$function$;

-- Drop the existing problematic UPDATE policy for profiles
DROP POLICY IF EXISTS "Users can update authorized profiles" ON public.profiles;

-- Create a secure UPDATE policy for profiles using the new function
CREATE POLICY "Users can update authorized profiles" ON public.profiles
FOR UPDATE TO authenticated
USING (can_update_profile(id))
WITH CHECK (can_update_profile(id));

-- Create a trigger to prevent unauthorized role and approval changes
CREATE OR REPLACE FUNCTION public.prevent_role_tampering()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Allow users to update their own profile, but not role or is_approved
  IF auth.uid() = NEW.id THEN
    -- Prevent self-escalation of role
    IF OLD.role != NEW.role THEN
      RAISE EXCEPTION 'Users cannot change their own role';
    END IF;
    
    -- Prevent self-approval
    IF OLD.is_approved != NEW.is_approved THEN
      RAISE EXCEPTION 'Users cannot change their own approval status';
    END IF;
  ELSE
    -- For company owners updating other profiles, allow role changes only within their company
    IF NOT EXISTS (
      SELECT 1 FROM companies c
      JOIN trainers t ON t.company_id = c.id
      WHERE c.owner_id = auth.uid() AND t.user_id = NEW.id
    ) THEN
      -- If not a trainer in the company, only allow role changes by cagio_admin
      IF OLD.role != NEW.role AND NOT EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'cagio_admin'
      ) THEN
        RAISE EXCEPTION 'Insufficient permissions to change user role';
      END IF;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create the trigger
DROP TRIGGER IF EXISTS prevent_role_tampering_trigger ON public.profiles;
CREATE TRIGGER prevent_role_tampering_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION prevent_role_tampering();

-- Update other policies to use 'authenticated' role instead of 'public'
DROP POLICY IF EXISTS "Users can view authorized profiles" ON public.profiles;
CREATE POLICY "Users can view authorized profiles" ON public.profiles
FOR SELECT TO authenticated
USING (can_access_profile(id));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = id);

-- Update company policies to use authenticated role
DROP POLICY IF EXISTS "Company owners can manage their company" ON public.companies;
CREATE POLICY "Company owners can manage their company" ON public.companies
FOR ALL TO authenticated
USING (owner_id = auth.uid());

-- Update other table policies to use authenticated role where applicable
DROP POLICY IF EXISTS "Authorized users can view athletes" ON public.athletes;
CREATE POLICY "Authorized users can view athletes" ON public.athletes
FOR SELECT TO authenticated
USING (can_access_company_data(company_id));

DROP POLICY IF EXISTS "Authorized users can insert athletes" ON public.athletes;
CREATE POLICY "Authorized users can insert athletes" ON public.athletes
FOR INSERT TO authenticated
WITH CHECK (can_access_company_data(company_id));

DROP POLICY IF EXISTS "Authorized users can update athletes" ON public.athletes;
CREATE POLICY "Authorized users can update athletes" ON public.athletes
FOR UPDATE TO authenticated
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

DROP POLICY IF EXISTS "Authorized users can delete athletes" ON public.athletes;
CREATE POLICY "Authorized users can delete athletes" ON public.athletes
FOR DELETE TO authenticated
USING (can_access_company_data(company_id));
