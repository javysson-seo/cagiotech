-- Adicionar campos de logo e mais detalhes à tabela companies
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS slogan TEXT,
ADD COLUMN IF NOT EXISTS business_type TEXT DEFAULT 'CrossFit',
ADD COLUMN IF NOT EXISTS nif TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS instagram TEXT,
ADD COLUMN IF NOT EXISTS founded_date DATE,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'Portugal',
ADD COLUMN IF NOT EXISTS gps_coordinates TEXT,
ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS operating_hours JSONB DEFAULT '{}'::jsonb;

-- Criar bucket para logos de empresas
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('company-logos', 'company-logos', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Políticas RLS para o bucket de logos
CREATE POLICY "Logos são públicos"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-logos');

CREATE POLICY "Box owners podem fazer upload do logo"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'company-logos' 
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.companies 
    WHERE has_role(auth.uid(), 'box_owner'::app_role, id)
  )
);

CREATE POLICY "Box owners podem atualizar logo"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.companies 
    WHERE has_role(auth.uid(), 'box_owner'::app_role, id)
  )
);

CREATE POLICY "Box owners podem deletar logo"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'company-logos'
  AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.companies 
    WHERE has_role(auth.uid(), 'box_owner'::app_role, id)
  )
);