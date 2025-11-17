-- Add missing columns to company_notifications table
ALTER TABLE public.company_notifications 
ADD COLUMN IF NOT EXISTS type text DEFAULT 'info',
ADD COLUMN IF NOT EXISTS data jsonb,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create index on company_id and is_active for better query performance
CREATE INDEX IF NOT EXISTS idx_company_notifications_company_active 
ON public.company_notifications(company_id, is_active) 
WHERE is_active = true;