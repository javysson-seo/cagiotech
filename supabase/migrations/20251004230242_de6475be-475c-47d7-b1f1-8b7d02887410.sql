-- ============================================================================
-- FASE 1: ESTRUTURA SEGURA DE ROLES - Multi-Tenant System
-- ============================================================================

-- 1. Criar ENUM para roles
CREATE TYPE public.app_role AS ENUM (
  'cagio_admin',
  'box_owner',
  'personal_trainer',
  'staff_member',
  'student'
);

-- 2. Criar tabela user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role, company_id)
);

-- 3. Criar função has_role (SECURITY DEFINER - evita recursão)
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id UUID, 
  _role public.app_role, 
  _company_id UUID DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles
    WHERE user_id = _user_id 
      AND role = _role
      AND (
        company_id = _company_id 
        OR _company_id IS NULL 
        OR company_id IS NULL
      )
  )
$$;

-- 4. Adicionar campo role_type em staff
ALTER TABLE public.staff 
ADD COLUMN IF NOT EXISTS role_type TEXT DEFAULT 'staff_member';

COMMENT ON COLUMN public.staff.role_type IS 
'Tipo específico do colaborador: personal_trainer, receptionist, hr, cleaning, maintenance, nutritionist, etc.';

-- 5. MIGRAÇÃO DE DADOS EXISTENTES

-- 5.1 Migrar Box Owners
INSERT INTO public.user_roles (user_id, role, company_id)
SELECT 
  c.owner_id,
  'box_owner'::public.app_role,
  c.id
FROM public.companies c
WHERE c.owner_id IS NOT NULL
ON CONFLICT (user_id, role, company_id) DO NOTHING;

-- 5.2 Migrar Personal Trainers
INSERT INTO public.user_roles (user_id, role, company_id)
SELECT 
  t.user_id,
  'personal_trainer'::public.app_role,
  t.company_id
FROM public.trainers t
WHERE t.user_id IS NOT NULL
ON CONFLICT (user_id, role, company_id) DO NOTHING;

-- 5.3 Atualizar role_type em staff para personal trainers existentes
UPDATE public.staff s
SET role_type = 'personal_trainer'
WHERE EXISTS (
  SELECT 1 FROM public.trainers t 
  WHERE t.user_id = s.user_id AND t.company_id = s.company_id
);

-- 5.4 Migrar Cagio Admins
INSERT INTO public.user_roles (user_id, role, company_id)
SELECT 
  p.id,
  'cagio_admin'::public.app_role,
  NULL
FROM public.profiles p
WHERE p.role = 'cagio_admin'
ON CONFLICT (user_id, role, company_id) DO NOTHING;

-- 5.5 Migrar Students
INSERT INTO public.user_roles (user_id, role, company_id)
SELECT 
  p.id,
  'student'::public.app_role,
  NULL
FROM public.profiles p
WHERE p.role = 'student'
ON CONFLICT (user_id, role, company_id) DO NOTHING;

-- 6. ATUALIZAR FUNÇÃO can_access_company_data
CREATE OR REPLACE FUNCTION public.can_access_company_data(target_company_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    public.has_role(auth.uid(), 'cagio_admin', NULL)
    OR public.has_role(auth.uid(), 'box_owner', target_company_id)
    OR public.has_role(auth.uid(), 'personal_trainer', target_company_id)
    OR public.has_role(auth.uid(), 'staff_member', target_company_id)
$$;

-- 7. ATUALIZAR FUNÇÃO can_access_profile
CREATE OR REPLACE FUNCTION public.can_access_profile(target_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    auth.uid() = target_profile_id
    OR public.has_role(auth.uid(), 'cagio_admin', NULL)
    OR EXISTS (
      SELECT 1 FROM public.companies c
      WHERE public.has_role(auth.uid(), 'box_owner', c.id)
        AND (
          c.owner_id = target_profile_id
          OR EXISTS (
            SELECT 1 FROM public.trainers t 
            WHERE t.user_id = target_profile_id AND t.company_id = c.id
          )
          OR EXISTS (
            SELECT 1 FROM public.staff s 
            WHERE s.user_id = target_profile_id AND s.company_id = c.id
          )
        )
    )
$$;

-- 8. ATUALIZAR FUNÇÃO can_update_profile
CREATE OR REPLACE FUNCTION public.can_update_profile(target_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    auth.uid() = target_profile_id
    OR public.has_role(auth.uid(), 'cagio_admin', NULL)
    OR EXISTS (
      SELECT 1 FROM public.companies c
      WHERE public.has_role(auth.uid(), 'box_owner', c.id)
        AND (
          EXISTS (
            SELECT 1 FROM public.trainers t 
            WHERE t.user_id = target_profile_id AND t.company_id = c.id
          )
          OR EXISTS (
            SELECT 1 FROM public.staff s 
            WHERE s.user_id = target_profile_id AND s.company_id = c.id
          )
        )
    )
$$;

-- 9. ATUALIZAR TRIGGER prevent_role_tampering
CREATE OR REPLACE FUNCTION public.prevent_role_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Role agora é gerenciado em user_roles, não em profiles
  IF OLD.role IS DISTINCT FROM NEW.role THEN
    RAISE EXCEPTION 'Role modification is disabled. Roles are now managed in user_roles table.';
  END IF;
  
  -- Apenas admins podem aprovar usuários
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
$$;

-- 10. ATUALIZAR TRIGGER handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
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
  app_user_role public.app_role;
BEGIN
  -- Get user role from metadata, default to 'box_owner'
  user_role := COALESCE(NEW.raw_user_meta_data ->> 'role', 'box_owner');
  
  -- Convert to app_role enum
  app_user_role := CASE user_role
    WHEN 'cagio_admin' THEN 'cagio_admin'::public.app_role
    WHEN 'box_admin' THEN 'box_owner'::public.app_role
    WHEN 'box_owner' THEN 'box_owner'::public.app_role
    WHEN 'trainer' THEN 'personal_trainer'::public.app_role
    WHEN 'personal_trainer' THEN 'personal_trainer'::public.app_role
    WHEN 'student' THEN 'student'::public.app_role
    ELSE 'box_owner'::public.app_role
  END;
  
  -- Insert into profiles table (sem campo role)
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.email),
    NEW.email,
    user_role -- Manter temporariamente para compatibilidade
  );

  -- Se user_role é box_owner, criar empresa
  IF app_user_role = 'box_owner' THEN
    -- Generate URL-friendly slug from company name
    base_slug := lower(regexp_replace(
      COALESCE(NEW.raw_user_meta_data ->> 'company_name', 'Minha Empresa'), 
      '[^a-zA-Z0-9]+', '-', 'g'
    ));
    
    final_slug := base_slug;
    
    -- Ensure slug is unique
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
    
    -- Criar entrada em user_roles
    INSERT INTO public.user_roles (user_id, role, company_id)
    VALUES (NEW.id, 'box_owner'::public.app_role, company_id);
    
  ELSE
    -- Para outros roles (student, cagio_admin), criar entrada sem company_id
    INSERT INTO public.user_roles (user_id, role, company_id)
    VALUES (NEW.id, app_user_role, NULL);
  END IF;

  RETURN NEW;
END;
$function$;

-- 11. RLS POLICIES PARA user_roles

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Cagio admins can view all roles
CREATE POLICY "Cagio admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'cagio_admin', NULL));

-- Box owners can view roles in their company
CREATE POLICY "Box owners can view company roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.companies c
    WHERE c.id = user_roles.company_id
      AND public.has_role(auth.uid(), 'box_owner', c.id)
  )
);

-- Only system can INSERT/UPDATE/DELETE user_roles (via triggers or cagio_admin)
CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'cagio_admin', NULL))
WITH CHECK (public.has_role(auth.uid(), 'cagio_admin', NULL));

-- 12. ATUALIZAR RLS POLICIES DAS TABELAS EXISTENTES

-- 12.1 COMPANIES
DROP POLICY IF EXISTS "Company owners can manage their company" ON public.companies;
CREATE POLICY "Company owners can manage their company"
ON public.companies
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', id)
);

-- 12.2 TRAINERS
DROP POLICY IF EXISTS "Company members can manage trainers" ON public.trainers;
CREATE POLICY "Company members can manage trainers"
ON public.trainers
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'staff_member', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
);

-- 12.3 STAFF
DROP POLICY IF EXISTS "Company members can manage staff" ON public.staff;
CREATE POLICY "Company members can manage staff"
ON public.staff
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
);

-- 12.4 PLANS
DROP POLICY IF EXISTS "Company members can manage plans" ON public.plans;
CREATE POLICY "Company members can manage plans"
ON public.plans
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
);

-- 12.5 GROUPS
DROP POLICY IF EXISTS "Company members can manage groups" ON public.groups;
CREATE POLICY "Company members can manage groups"
ON public.groups
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'personal_trainer', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'personal_trainer', company_id)
);

-- 12.6 ATHLETE_GROUPS
DROP POLICY IF EXISTS "Company members can manage athlete groups" ON public.athlete_groups;
CREATE POLICY "Company members can manage athlete groups"
ON public.athlete_groups
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = athlete_groups.group_id
    AND (
      public.has_role(auth.uid(), 'cagio_admin', NULL)
      OR public.has_role(auth.uid(), 'box_owner', g.company_id)
      OR public.has_role(auth.uid(), 'personal_trainer', g.company_id)
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.groups g
    WHERE g.id = athlete_groups.group_id
    AND (
      public.has_role(auth.uid(), 'cagio_admin', NULL)
      OR public.has_role(auth.uid(), 'box_owner', g.company_id)
      OR public.has_role(auth.uid(), 'personal_trainer', g.company_id)
    )
  )
);

-- 12.7 NUTRITIONAL_PLANS
DROP POLICY IF EXISTS "Company members can manage nutritional plans" ON public.nutritional_plans;
CREATE POLICY "Company members can manage nutritional plans"
ON public.nutritional_plans
FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'personal_trainer', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'personal_trainer', company_id)
);

-- 12.8 NOTIFICATIONS
DROP POLICY IF EXISTS "Company members can view notifications" ON public.notifications;
CREATE POLICY "Company members can view notifications"
ON public.notifications
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
  OR public.has_role(auth.uid(), 'personal_trainer', company_id)
  OR public.has_role(auth.uid(), 'staff_member', company_id)
);

-- 13. CRIAR ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_company_id ON public.user_roles(company_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON public.user_roles(role);
CREATE INDEX IF NOT EXISTS idx_staff_role_type ON public.staff(role_type);
CREATE INDEX IF NOT EXISTS idx_user_roles_lookup ON public.user_roles(user_id, role, company_id);

-- 14. CRIAR TRIGGER PARA updated_at em user_roles
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();