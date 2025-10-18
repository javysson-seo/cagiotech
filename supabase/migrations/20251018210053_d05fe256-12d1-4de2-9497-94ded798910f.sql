-- Security improvements for sensitive data

-- 1. Add indexes for performance and prevent table scans
CREATE INDEX IF NOT EXISTS idx_athletes_company_email ON public.athletes(company_id, email);
CREATE INDEX IF NOT EXISTS idx_athletes_company_status ON public.athletes(company_id, status);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_role ON public.user_roles(user_id, role);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_company_status ON public.payment_transactions(company_id, status);

-- 2. Add audit logging trigger for sensitive tables
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id UUID,
  action TEXT NOT NULL,
  old_data JSONB,
  new_data JSONB,
  user_id UUID,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view audit logs"
  ON public.security_audit_log
  FOR SELECT
  USING (has_role(auth.uid(), 'cagio_admin', NULL));

-- 3. Create audit trigger function
CREATE OR REPLACE FUNCTION public.log_security_audit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND (
    OLD.email IS DISTINCT FROM NEW.email OR
    OLD.phone IS DISTINCT FROM NEW.phone OR
    OLD.nif IS DISTINCT FROM NEW.nif OR
    OLD.cc_number IS DISTINCT FROM NEW.cc_number
  ) THEN
    INSERT INTO public.security_audit_log (
      table_name,
      record_id,
      action,
      old_data,
      new_data,
      user_id
    ) VALUES (
      TG_TABLE_NAME,
      NEW.id,
      TG_OP,
      to_jsonb(OLD),
      to_jsonb(NEW),
      auth.uid()
    );
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.security_audit_log (
      table_name,
      record_id,
      action,
      old_data,
      user_id
    ) VALUES (
      TG_TABLE_NAME,
      OLD.id,
      TG_OP,
      to_jsonb(OLD),
      auth.uid()
    );
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- 4. Apply audit trigger to sensitive tables
DROP TRIGGER IF EXISTS audit_athletes_changes ON public.athletes;
CREATE TRIGGER audit_athletes_changes
  AFTER UPDATE OR DELETE ON public.athletes
  FOR EACH ROW
  EXECUTE FUNCTION public.log_security_audit();

DROP TRIGGER IF EXISTS audit_payment_transactions_changes ON public.payment_transactions;
CREATE TRIGGER audit_payment_transactions_changes
  AFTER UPDATE OR DELETE ON public.payment_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.log_security_audit();

-- 5. Add comments for sensitive fields
COMMENT ON COLUMN public.athletes.cc_number IS 'SENSITIVE: Credit card number - should be encrypted at application level';
COMMENT ON COLUMN public.athletes.medical_notes IS 'SENSITIVE: Medical information - handle with care';
COMMENT ON COLUMN public.athletes.nif IS 'SENSITIVE: Tax identification number';
COMMENT ON COLUMN public.athletes.niss IS 'SENSITIVE: Social security number';

-- 6. Create function to check for suspicious activity
CREATE OR REPLACE FUNCTION public.check_suspicious_activity(
  _user_id UUID,
  _action TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  recent_actions INTEGER;
BEGIN
  -- Count recent similar actions (last 5 minutes)
  SELECT COUNT(*) INTO recent_actions
  FROM public.security_audit_log
  WHERE user_id = _user_id
    AND action = _action
    AND created_at > now() - INTERVAL '5 minutes';
  
  -- Alert if more than 10 actions in 5 minutes
  IF recent_actions > 10 THEN
    -- Log suspicious activity
    INSERT INTO public.security_audit_log (
      table_name,
      action,
      user_id,
      new_data
    ) VALUES (
      'suspicious_activity',
      'rate_limit_exceeded',
      _user_id,
      jsonb_build_object('count', recent_actions, 'action', _action)
    );
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;