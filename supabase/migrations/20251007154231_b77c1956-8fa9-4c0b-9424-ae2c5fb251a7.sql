-- Tabela de planos de treino
CREATE TABLE public.workout_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  exercises JSONB DEFAULT '[]'::jsonb,
  duration_weeks INTEGER,
  frequency_per_week INTEGER,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de produtos da loja
CREATE TABLE public.store_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL CHECK (price >= 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  category TEXT,
  image_url TEXT,
  sku TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de vendas da loja
CREATE TABLE public.store_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE RESTRICT,
  athlete_id UUID REFERENCES public.athletes(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  payment_method TEXT,
  sold_by UUID REFERENCES auth.users(id),
  sale_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de eventos da empresa
CREATE TABLE public.company_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  price NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de inscrições em eventos
CREATE TABLE public.event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES public.company_events(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  notes TEXT,
  UNIQUE(event_id, athlete_id)
);

-- Habilitar RLS
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.company_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para workout_plans
CREATE POLICY "Company members can manage workout plans"
ON public.workout_plans
FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

CREATE POLICY "Athletes can view their own workout plans"
ON public.workout_plans
FOR SELECT
USING (
  athlete_id IN (
    SELECT id FROM public.athletes 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Políticas RLS para store_products
CREATE POLICY "Company members can manage products"
ON public.store_products
FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

CREATE POLICY "Athletes can view active products"
ON public.store_products
FOR SELECT
USING (is_active = true);

-- Políticas RLS para store_sales
CREATE POLICY "Company members can manage sales"
ON public.store_sales
FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

-- Políticas RLS para company_events
CREATE POLICY "Company members can manage events"
ON public.company_events
FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

CREATE POLICY "Everyone can view active events"
ON public.company_events
FOR SELECT
USING (is_active = true);

-- Políticas RLS para event_registrations
CREATE POLICY "Company members can manage event registrations"
ON public.event_registrations
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.company_events ce
    WHERE ce.id = event_registrations.event_id
    AND can_access_company_data(ce.company_id)
  )
);

CREATE POLICY "Athletes can view their own registrations"
ON public.event_registrations
FOR SELECT
USING (
  athlete_id IN (
    SELECT id FROM public.athletes 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
);

-- Triggers para updated_at
CREATE TRIGGER update_workout_plans_updated_at
BEFORE UPDATE ON public.workout_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_products_updated_at
BEFORE UPDATE ON public.store_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_company_events_updated_at
BEFORE UPDATE ON public.company_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();