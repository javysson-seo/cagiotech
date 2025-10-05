-- Corrigir search_path em todas as funções do banco de dados

-- 1. Atualizar função handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
DECLARE
  company_id UUID;
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
  user_role TEXT;
  app_user_role public.app_role;
BEGIN
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'box_owner');
  
  app_user_role := CASE user_role
    WHEN 'cagio_admin' THEN 'cagio_admin'::public.app_role
    WHEN 'box_admin' THEN 'box_owner'::public.app_role
    WHEN 'box_owner' THEN 'box_owner'::public.app_role
    WHEN 'trainer' THEN 'personal_trainer'::public.app_role
    WHEN 'personal_trainer' THEN 'personal_trainer'::public.app_role
    WHEN 'student' THEN 'student'::public.app_role
    ELSE 'box_owner'::public.app_role
  END;
  
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    user_role
  );

  IF app_user_role = 'box_owner' THEN
    base_slug := lower(regexp_replace(
      COALESCE(NEW.raw_user_meta_data ->> 'company_name', 'Minha Empresa'), 
      '[^a-zA-Z0-9]+', '-', 'g'
    ));
    
    final_slug := base_slug;
    
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
    
    INSERT INTO public.user_roles (user_id, role, company_id)
    VALUES (NEW.id, 'box_owner'::public.app_role, company_id);
  ELSE
    INSERT INTO public.user_roles (user_id, role, company_id)
    VALUES (NEW.id, app_user_role, NULL);
  END IF;

  RETURN NEW;
END;
$function$;

-- 2. Atualizar função validate_athlete_subscription_company
CREATE OR REPLACE FUNCTION public.validate_athlete_subscription_company()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  athlete_company_id UUID;
BEGIN
  SELECT company_id INTO athlete_company_id
  FROM public.athletes
  WHERE id = NEW.athlete_id;
  
  IF athlete_company_id != NEW.company_id THEN
    RAISE EXCEPTION 'Athlete does not belong to this company';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 3. Atualizar função check_birthday_notifications
CREATE OR REPLACE FUNCTION public.check_birthday_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  athlete_record RECORD;
  notification_message TEXT;
  age INTEGER;
BEGIN
  FOR athlete_record IN 
    SELECT a.*, c.id as company_id, c.name as company_name
    FROM public.athletes a
    JOIN public.companies c ON a.company_id = c.id
    WHERE EXTRACT(MONTH FROM a.birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(DAY FROM a.birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
  LOOP
    age := EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM athlete_record.birth_date);
    
    notification_message := athlete_record.name || ' está fazendo ' || age || ' anos hoje!';
    
    INSERT INTO public.notifications (company_id, type, title, message, data)
    SELECT 
      athlete_record.company_id,
      'birthday',
      'Aniversário',
      notification_message,
      jsonb_build_object('athlete_id', athlete_record.id, 'age', age)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.notifications 
      WHERE company_id = athlete_record.company_id 
      AND type = 'birthday'
      AND data->>'athlete_id' = athlete_record.id::text
      AND DATE(created_at) = CURRENT_DATE
    );
  END LOOP;
END;
$function$;

-- 4. Atualizar função prevent_role_tampering
CREATE OR REPLACE FUNCTION public.prevent_role_tampering()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'auth'
AS $function$
BEGIN
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Role modification is disabled. Roles are now managed in user_roles table.';
  END IF;
  
  IF OLD.is_approved IS DISTINCT FROM NEW.is_approved THEN
    IF NOT (
      public.has_role(auth.uid(), 'cagio_admin', NULL)
      OR EXISTS (
        SELECT 1 FROM public.companies c
        WHERE public.has_role(auth.uid(), 'box_owner', c.id)
      )
    ) THEN
      RAISE EXCEPTION 'Only administrators can change approval status';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- 5. Atualizar função inserir_3x_e_parar (se ainda for necessária)
CREATE OR REPLACE FUNCTION public.inserir_3x_e_parar()
RETURNS void
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
DECLARE
    i int := 0;
BEGIN
    WHILE i < 3 LOOP
        INSERT INTO bd_ativo(num) VALUES (1);
        i := i + 1;
        IF i < 3 THEN
            PERFORM pg_sleep(5);
        END IF;
    END LOOP;
END;
$function$;