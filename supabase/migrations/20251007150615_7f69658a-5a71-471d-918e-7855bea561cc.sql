-- Criar usuário admin (você precisará definir a senha manualmente no Supabase Auth)
-- Primeiro, vamos garantir que temos um usuário admin

-- Inserir role de admin para um usuário específico (usando email admin@cagiotech.pt)
-- Nota: O usuário precisa ser criado manualmente no Supabase Auth primeiro

-- Função para criar usuário admin se não existir
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Tentar encontrar usuário admin existente
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@cagiotech.pt';
  
  -- Se não encontrou, vamos usar o primeiro usuário da lista para testes
  -- EM PRODUÇÃO: criar o usuário no Supabase Auth manualmente
  IF admin_user_id IS NULL THEN
    SELECT id INTO admin_user_id 
    FROM auth.users 
    LIMIT 1;
  END IF;
  
  -- Se encontrou algum usuário, adicionar role de admin
  IF admin_user_id IS NOT NULL THEN
    -- Remover role existente se houver
    DELETE FROM public.user_roles 
    WHERE user_id = admin_user_id AND role = 'cagio_admin';
    
    -- Inserir nova role de admin
    INSERT INTO public.user_roles (user_id, role, company_id)
    VALUES (admin_user_id, 'cagio_admin'::app_role, NULL)
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Admin role criada para usuário: %', admin_user_id;
  END IF;
END $$;