-- Desabilitar RLS na tabela de códigos pois ela é acessada apenas por edge functions
ALTER TABLE public.email_verification_codes DISABLE ROW LEVEL SECURITY;