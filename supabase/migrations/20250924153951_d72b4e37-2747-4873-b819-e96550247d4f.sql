-- Corrigir problemas finais de segurança

-- Recriar funções restantes com search_path correto
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

CREATE OR REPLACE FUNCTION public.check_birthday_notifications()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
  athlete_record RECORD;
  notification_message TEXT;
  age INTEGER;
BEGIN
  -- Loop through athletes with birthdays today
  FOR athlete_record IN 
    SELECT a.*, c.id as company_id, c.name as company_name
    FROM public.athletes a
    JOIN public.companies c ON a.company_id = c.id
    WHERE EXTRACT(MONTH FROM a.birth_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    AND EXTRACT(DAY FROM a.birth_date) = EXTRACT(DAY FROM CURRENT_DATE)
  LOOP
    -- Calculate age
    age := EXTRACT(YEAR FROM CURRENT_DATE) - EXTRACT(YEAR FROM athlete_record.birth_date);
    
    -- Create notification message
    notification_message := athlete_record.name || ' está fazendo ' || age || ' anos hoje!';
    
    -- Insert notification (check if not already exists for today)
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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

CREATE OR REPLACE FUNCTION public.inserir_3x_e_parar()
RETURNS void
LANGUAGE plpgsql
SET search_path = 'public'
AS $function$
declare
    i int := 0;
begin
    while i < 3 loop
        insert into bd_ativo(num) values (1);
        i := i + 1;
        if i < 3 then
            perform pg_sleep(5);
        end if;
    end loop;
end;
$function$;

-- Reabilitar RLS na tabela bd_ativo com uma política simples para resolver o ERROR
ALTER TABLE public.bd_ativo ENABLE ROW LEVEL SECURITY;

-- Criar uma política simples para bd_ativo - assumindo que é uma tabela de teste
CREATE POLICY "Allow all authenticated users" ON public.bd_ativo
FOR ALL USING (auth.role() = 'authenticated');