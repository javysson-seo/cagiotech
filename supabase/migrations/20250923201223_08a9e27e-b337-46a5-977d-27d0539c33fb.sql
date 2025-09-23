-- Add slug column to companies table for URL-friendly company names
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS slug text;

-- First, update existing companies with unique slugs
DO $$
DECLARE
  company_record RECORD;
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER;
BEGIN
  FOR company_record IN SELECT id, name FROM public.companies WHERE slug IS NULL LOOP
    -- Generate base slug from name
    base_slug := lower(regexp_replace(company_record.name, '[^a-zA-Z0-9]+', '-', 'g'));
    final_slug := base_slug;
    counter := 1;
    
    -- Ensure slug is unique
    WHILE EXISTS (SELECT 1 FROM public.companies WHERE slug = final_slug AND id != company_record.id) LOOP
      final_slug := base_slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    -- Update the company with unique slug
    UPDATE public.companies SET slug = final_slug WHERE id = company_record.id;
  END LOOP;
END $$;

-- Create unique index on slug after updating all records
CREATE UNIQUE INDEX IF NOT EXISTS companies_slug_unique ON public.companies(slug);

-- Update handle_new_user function to include slug generation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  company_id UUID;
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  -- Insert into profiles table
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'box_admin')
  );

  -- If user is box_admin, create a company for them
  IF COALESCE(NEW.raw_user_meta_data ->> 'role', 'box_admin') = 'box_admin' THEN
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
    )
    RETURNING id INTO company_id;
  END IF;

  RETURN NEW;
END;
$function$;