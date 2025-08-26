
-- Verificar se a tabela athletes tem todas as colunas necessárias
ALTER TABLE public.athletes 
ADD COLUMN IF NOT EXISTS emergency_contact_name text,
ADD COLUMN IF NOT EXISTS emergency_contact_phone text,
ADD COLUMN IF NOT EXISTS medical_conditions text;

-- Renomear coluna se necessário para compatibilidade
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'athletes' AND column_name = 'medical_notes') THEN
    ALTER TABLE public.athletes RENAME COLUMN medical_notes TO medical_conditions;
  END IF;
END $$;

-- Garantir que a coluna company_id existe e tem a constraint correta
ALTER TABLE public.athletes 
ADD CONSTRAINT IF NOT EXISTS athletes_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;
