-- Update the handle_new_user function to properly handle student role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  company_id UUID;
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
  user_role TEXT;
BEGIN
  -- Get user role from metadata, default to 'box_admin'
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'box_admin');
  
  -- Insert into profiles table
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    user_role
  );

  -- If user is box_admin, create a company for them
  IF user_role = 'box_admin' THEN
    -- Generate URL-friendly slug from company name
    base_slug := lower(regexp_replace(
      COALESCE(NEW.raw_user_meta_data ->> 'company_name', 'Minha Empresa'), 
      '[^a-zA-Z0-9]+', '-', 'g'
    ));
    
    final_slug := base_slug;
    
    -- Ensure slug is unique by appending number if needed
    WHILE EXISTS (SELECT 1 FROM public.companies WHERE slug = final_slug) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    INSERT INTO public.companies (name, owner_id, slug)
    VALUES (
      COALESCE(NEW.raw_user_meta_data ->> 'company_name', 'Minha Empresa'),
      NEW.id,
      final_slug
    );
  END IF;

  RETURN NEW;
END;
$function$;