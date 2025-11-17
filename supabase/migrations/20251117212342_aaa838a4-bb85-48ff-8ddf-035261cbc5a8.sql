-- ETAPA 1: Corrigir estrutura da tabela athletes e RLS policies
-- Versão corrigida apenas com tabelas existentes

-- 1. Adicionar coluna user_id na tabela athletes (nullable inicialmente)
ALTER TABLE public.athletes 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_athletes_user_id ON public.athletes(user_id);
CREATE INDEX IF NOT EXISTS idx_athletes_email ON public.athletes(email);

-- 3. Criar função helper para verificar se user é dono do athlete
CREATE OR REPLACE FUNCTION public.is_athlete_owner(_athlete_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.athletes
    WHERE id = _athlete_id 
      AND (
        user_id = auth.uid()
        OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
  )
$$;

-- 4. ATUALIZAR RLS POLICIES PARA ATHLETES

-- Permitir que atletas vejam seus próprios dados
DROP POLICY IF EXISTS "Athletes can view their own data" ON public.athletes;
CREATE POLICY "Athletes can view their own data" 
ON public.athletes 
FOR SELECT 
USING (
  user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  OR can_access_company_data(company_id)
);

-- Permitir que atletas atualizem seus próprios dados
DROP POLICY IF EXISTS "Athletes can update their own data" ON public.athletes;
CREATE POLICY "Athletes can update their own data" 
ON public.athletes 
FOR UPDATE 
USING (
  user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
)
WITH CHECK (
  user_id = auth.uid() 
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- 5. CORRIGIR RLS PARA ATHLETE_PAYMENTS (CRÍTICO!)

DROP POLICY IF EXISTS "Athletes can view their own payments" ON public.athlete_payments;
CREATE POLICY "Athletes can view their own payments" 
ON public.athlete_payments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.athletes a 
    WHERE a.id = athlete_payments.athlete_id 
      AND (
        a.user_id = auth.uid()
        OR a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
  )
  OR can_access_company_data(company_id)
);

-- 6. CORRIGIR RLS PARA NUTRITIONAL_PLANS

DROP POLICY IF EXISTS "Athletes can view their nutrition plans" ON public.nutritional_plans;
CREATE POLICY "Athletes can view their nutrition plans" 
ON public.nutritional_plans 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.athletes a 
    WHERE a.id = nutritional_plans.athlete_id 
      AND (
        a.user_id = auth.uid()
        OR a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
  )
  OR can_access_company_data(company_id)
);

-- 7. CORRIGIR RLS PARA PHYSICAL_ASSESSMENTS

DROP POLICY IF EXISTS "Athletes can view their physical assessments" ON public.physical_assessments;
CREATE POLICY "Athletes can view their physical assessments" 
ON public.physical_assessments 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.athletes a 
    WHERE a.id = physical_assessments.athlete_id 
      AND (
        a.user_id = auth.uid()
        OR a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
  )
  OR can_access_company_data(company_id)
);

-- 8. CORRIGIR RLS PARA WORKOUT_PLANS

DROP POLICY IF EXISTS "Athletes can view their workout plans" ON public.workout_plans;
CREATE POLICY "Athletes can view their workout plans" 
ON public.workout_plans 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.athletes a 
    WHERE a.id = workout_plans.athlete_id 
      AND (
        a.user_id = auth.uid()
        OR a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
  )
  OR can_access_company_data(company_id)
);

-- 9. Permitir que atletas vejam classes disponíveis da sua company
DROP POLICY IF EXISTS "Athletes can view classes from their company" ON public.classes;
CREATE POLICY "Athletes can view classes from their company" 
ON public.classes 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.athletes a 
    WHERE a.company_id = classes.company_id 
      AND (
        a.user_id = auth.uid()
        OR a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
  )
  OR can_access_company_data(company_id)
);

-- 10. Permitir que atletas criem suas próprias reservas
DROP POLICY IF EXISTS "Athletes can create their own bookings" ON public.class_bookings;
CREATE POLICY "Athletes can create their own bookings" 
ON public.class_bookings 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.athletes a 
    WHERE a.id = class_bookings.athlete_id 
      AND (
        a.user_id = auth.uid()
        OR a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
  )
);

-- 11. Permitir que atletas cancelem suas próprias reservas
DROP POLICY IF EXISTS "Athletes can cancel their own bookings" ON public.class_bookings;
CREATE POLICY "Athletes can cancel their own bookings" 
ON public.class_bookings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.athletes a 
    WHERE a.id = class_bookings.athlete_id 
      AND (
        a.user_id = auth.uid()
        OR a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM public.athletes a 
    WHERE a.id = class_bookings.athlete_id 
      AND (
        a.user_id = auth.uid()
        OR a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )
  )
);

-- 12. Comentários para documentação
COMMENT ON COLUMN public.athletes.user_id IS 'Referência ao usuário autenticado. Permite que o atleta faça login e acesse seus dados.';
COMMENT ON FUNCTION public.is_athlete_owner IS 'Verifica se o usuário autenticado é dono do registro de atleta (por user_id ou email).';