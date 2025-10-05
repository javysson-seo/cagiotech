-- Habilitar RLS na tabela nutritional_plans se ainda não estiver
ALTER TABLE public.nutritional_plans ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Company members can manage nutritional plans" ON public.nutritional_plans;

-- Política para Cagio Admin e Box Owner (acesso total)
CREATE POLICY "Admins and box owners can manage all nutritional plans"
ON public.nutritional_plans
FOR ALL
USING (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
)
WITH CHECK (
  public.has_role(auth.uid(), 'cagio_admin', NULL)
  OR public.has_role(auth.uid(), 'box_owner', company_id)
);

-- Política para Personal Trainer (só pode criar/editar/visualizar planos de seus atletas)
CREATE POLICY "Trainers can manage plans for their athletes"
ON public.nutritional_plans
FOR ALL
USING (
  public.has_role(auth.uid(), 'personal_trainer', company_id)
  AND EXISTS (
    SELECT 1 FROM public.athletes
    WHERE id = nutritional_plans.athlete_id
    AND trainer = (SELECT name FROM public.trainers WHERE user_id = auth.uid() LIMIT 1)
  )
)
WITH CHECK (
  public.has_role(auth.uid(), 'personal_trainer', company_id)
  AND EXISTS (
    SELECT 1 FROM public.athletes
    WHERE id = nutritional_plans.athlete_id
    AND trainer = (SELECT name FROM public.trainers WHERE user_id = auth.uid() LIMIT 1)
  )
);

-- Política para Staff Member (visualizar todos os planos da empresa)
CREATE POLICY "Staff can view all nutritional plans"
ON public.nutritional_plans
FOR SELECT
USING (
  public.has_role(auth.uid(), 'staff_member', company_id)
);

-- Política para Alunos (visualizar seus próprios planos)
CREATE POLICY "Students can view their own nutritional plans"
ON public.nutritional_plans
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.athletes
    WHERE id = nutritional_plans.athlete_id
    AND email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);