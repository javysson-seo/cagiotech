-- Criar tabela de notificações se não existir
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'system',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para notificações
CREATE POLICY "Company members can view their notifications"
  ON public.notifications
  FOR SELECT
  USING (can_access_company_data(company_id));

CREATE POLICY "Admins can insert notifications"
  ON public.notifications
  FOR INSERT
  WITH CHECK (has_role(auth.uid(), 'cagio_admin', NULL));

CREATE POLICY "Company members can update their notifications"
  ON public.notifications
  FOR UPDATE
  USING (can_access_company_data(company_id));

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_notifications_company_id ON public.notifications(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read) WHERE is_read = false;