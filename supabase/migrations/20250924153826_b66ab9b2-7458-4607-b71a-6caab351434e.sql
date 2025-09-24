-- Criar tabelas para o sistema completo

-- Tabela de prospects/leads para CRM
CREATE TABLE public.prospects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  source TEXT,
  notes TEXT,
  contact_date DATE,
  follow_up_date DATE,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de equipamentos/material deportivo
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  quantity INTEGER DEFAULT 1,
  condition TEXT DEFAULT 'good',
  purchase_date DATE,
  purchase_price NUMERIC,
  location TEXT,
  maintenance_date DATE,
  next_maintenance DATE,
  serial_number TEXT,
  supplier TEXT,
  warranty_expiry DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de comunicações/mensagens
CREATE TABLE public.communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  sender_id UUID,
  recipient_type TEXT NOT NULL, -- 'athlete', 'trainer', 'group', 'all'
  recipient_id UUID,
  subject TEXT,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'message', -- 'message', 'announcement', 'reminder'
  status TEXT DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de métricas/KPIs
CREATE TABLE public.kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  metric_type TEXT NOT NULL, -- 'revenue', 'attendance', 'retention', etc.
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  target_value NUMERIC,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de receitas/despesas financeiras
CREATE TABLE public.financial_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'income', 'expense'
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  transaction_date DATE NOT NULL,
  payment_method TEXT,
  reference_id UUID, -- pode referenciar athlete_payments ou outros
  reference_type TEXT, -- 'athlete_payment', 'equipment_purchase', etc.
  status TEXT DEFAULT 'completed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de relatórios do observatório
CREATE TABLE public.observatory_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL,
  report_type TEXT NOT NULL, -- 'attendance', 'performance', 'financial', etc.
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  generated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observatory_reports ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para prospects
CREATE POLICY "Company members can manage prospects" ON public.prospects
FOR ALL USING (can_access_company_data(company_id));

-- Políticas RLS para equipment
CREATE POLICY "Company members can manage equipment" ON public.equipment
FOR ALL USING (can_access_company_data(company_id));

-- Políticas RLS para communications
CREATE POLICY "Company members can manage communications" ON public.communications
FOR ALL USING (can_access_company_data(company_id));

-- Políticas RLS para kpis
CREATE POLICY "Company members can manage kpis" ON public.kpis
FOR ALL USING (can_access_company_data(company_id));

-- Políticas RLS para financial_transactions
CREATE POLICY "Company members can manage financial transactions" ON public.financial_transactions
FOR ALL USING (can_access_company_data(company_id));

-- Políticas RLS para observatory_reports
CREATE POLICY "Company members can manage observatory reports" ON public.observatory_reports
FOR ALL USING (can_access_company_data(company_id));

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at
  BEFORE UPDATE ON public.financial_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();