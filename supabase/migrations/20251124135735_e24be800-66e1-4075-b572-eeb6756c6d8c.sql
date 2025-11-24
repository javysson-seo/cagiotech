-- Add index on companies.slug for better performance
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);

-- Ensure all companies have a slug (generate from name if missing)
UPDATE public.companies
SET slug = lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'))
WHERE slug IS NULL OR slug = '';