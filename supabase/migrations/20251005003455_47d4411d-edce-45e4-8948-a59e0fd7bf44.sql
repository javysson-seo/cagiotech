-- Adicionar campos de contato na tabela companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS address text;

-- Adicionar campo de motivo de bloqueio na tabela athletes
ALTER TABLE public.athletes 
ADD COLUMN IF NOT EXISTS blocked_reason text,
ADD COLUMN IF NOT EXISTS blocked_at timestamp with time zone;

-- Criar tabela de cupons de desconto
CREATE TABLE IF NOT EXISTS public.discount_coupons (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  code text NOT NULL,
  discount_percentage numeric NOT NULL,
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(company_id, code)
);

-- Enable RLS on discount_coupons
ALTER TABLE public.discount_coupons ENABLE ROW LEVEL SECURITY;

-- RLS policies for discount_coupons
CREATE POLICY "Company members can manage discount coupons"
ON public.discount_coupons
FOR ALL
USING (can_access_company_data(company_id));

-- Criar tabela de permissões de staff
CREATE TABLE IF NOT EXISTS public.staff_permissions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_id uuid NOT NULL REFERENCES public.staff(id) ON DELETE CASCADE,
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  permission_key text NOT NULL,
  can_access boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(staff_id, permission_key)
);

-- Enable RLS on staff_permissions
ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;

-- RLS policies for staff_permissions
CREATE POLICY "Box owners can manage staff permissions"
ON public.staff_permissions
FOR ALL
USING (has_role(auth.uid(), 'cagio_admin'::app_role, NULL::uuid) OR has_role(auth.uid(), 'box_owner'::app_role, company_id));

-- Trigger para updated_at
CREATE TRIGGER update_discount_coupons_updated_at
BEFORE UPDATE ON public.discount_coupons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_staff_permissions_updated_at
BEFORE UPDATE ON public.staff_permissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();