-- Reabilitar RLS e criar políticas restritivas
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Nenhuma política de acesso público - apenas edge functions com service role podem acessar
-- Isso garante que a tabela está protegida mas ainda acessível por edge functions