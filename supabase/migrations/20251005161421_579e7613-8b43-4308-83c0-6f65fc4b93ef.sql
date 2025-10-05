-- Create roles table to store custom roles per company
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(company_id, name)
);

-- Create role_permissions table to store permissions for each role
CREATE TABLE IF NOT EXISTS public.role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(role_id, permission_key)
);

-- Add role_id to staff table
ALTER TABLE public.staff 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for roles table
CREATE POLICY "Company members can view roles"
ON public.roles FOR SELECT
USING (can_access_company_data(company_id));

CREATE POLICY "Box owners can manage roles"
ON public.roles FOR ALL
USING (
  has_role(auth.uid(), 'cagio_admin', NULL) 
  OR has_role(auth.uid(), 'box_owner', company_id)
)
WITH CHECK (
  has_role(auth.uid(), 'cagio_admin', NULL) 
  OR has_role(auth.uid(), 'box_owner', company_id)
);

-- RLS Policies for role_permissions table
CREATE POLICY "Users can view role permissions"
ON public.role_permissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.roles r
    WHERE r.id = role_permissions.role_id
    AND can_access_company_data(r.company_id)
  )
);

CREATE POLICY "Box owners can manage role permissions"
ON public.role_permissions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.roles r
    WHERE r.id = role_permissions.role_id
    AND (
      has_role(auth.uid(), 'cagio_admin', NULL)
      OR has_role(auth.uid(), 'box_owner', r.company_id)
    )
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.roles r
    WHERE r.id = role_permissions.role_id
    AND (
      has_role(auth.uid(), 'cagio_admin', NULL)
      OR has_role(auth.uid(), 'box_owner', r.company_id)
    )
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_roles_updated_at
BEFORE UPDATE ON public.roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_roles_company_id ON public.roles(company_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON public.role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_staff_role_id ON public.staff(role_id);