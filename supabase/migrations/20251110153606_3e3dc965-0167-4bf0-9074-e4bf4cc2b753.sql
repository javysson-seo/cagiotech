-- Add first_login flag to staff table
ALTER TABLE public.staff 
ADD COLUMN IF NOT EXISTS first_login BOOLEAN DEFAULT true;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_staff_user_id_first_login 
ON public.staff(user_id, first_login);

-- Add password_changed_at timestamp
ALTER TABLE public.staff
ADD COLUMN IF NOT EXISTS password_changed_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

COMMENT ON COLUMN public.staff.first_login IS 'Flag indicating if this is the user first login - used to force password change';
COMMENT ON COLUMN public.staff.password_changed_at IS 'Timestamp when the password was last changed';