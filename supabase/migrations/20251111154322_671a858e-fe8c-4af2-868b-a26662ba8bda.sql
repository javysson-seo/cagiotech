-- Criar tabela para códigos de verificação
CREATE TABLE IF NOT EXISTS public.email_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  company_name TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used BOOLEAN DEFAULT FALSE
);

-- Índice para buscar por email
CREATE INDEX idx_verification_codes_email ON public.email_verification_codes(email);

-- Índice para limpar códigos expirados
CREATE INDEX idx_verification_codes_expires ON public.email_verification_codes(expires_at);

-- RLS não é necessário pois as edge functions usam service role
ALTER TABLE public.email_verification_codes ENABLE ROW LEVEL SECURITY;

-- Função para limpar códigos expirados (executada periodicamente)
CREATE OR REPLACE FUNCTION public.clean_expired_verification_codes()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.email_verification_codes
  WHERE expires_at < NOW() OR used = TRUE;
END;
$$;