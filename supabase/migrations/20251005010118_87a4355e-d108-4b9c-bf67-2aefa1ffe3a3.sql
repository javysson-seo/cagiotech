-- SISTEMA COMPLETO DE GESTÃO DE AULAS PARA FITNESS E WELLNESS

-- 1. TABELA DE MODALIDADES (fitness, yoga, pilates, musculação, etc)
CREATE TABLE IF NOT EXISTS public.modalities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#10b981',
  icon TEXT,
  duration_minutes INTEGER DEFAULT 60,
  max_capacity INTEGER DEFAULT 20,
  requires_booking BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE SALAS/ESPAÇOS
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  capacity INTEGER NOT NULL,
  floor TEXT,
  amenities TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABELA DE AULAS
CREATE TABLE IF NOT EXISTS public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  modality_id UUID NOT NULL REFERENCES public.modalities(id) ON DELETE RESTRICT,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 20,
  current_bookings INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'cancelled', 'completed', 'in_progress')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- 4. TABELA DE RESERVAS DE AULAS
CREATE TABLE IF NOT EXISTS public.class_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no_show', 'waitlist')),
  booking_date TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  checked_in_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, athlete_id)
);

-- 5. TABELA DE CHECK-INS DE AULAS
CREATE TABLE IF NOT EXISTS public.class_check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.class_bookings(id) ON DELETE CASCADE,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ DEFAULT NOW(),
  check_in_method TEXT DEFAULT 'manual' CHECK (check_in_method IN ('manual', 'qr_code', 'nfc', 'automatic')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABELA DE TEMPLATES DE HORÁRIOS SEMANAIS
CREATE TABLE IF NOT EXISTS public.class_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  modality_id UUID NOT NULL REFERENCES public.modalities(id) ON DELETE CASCADE,
  room_id UUID REFERENCES public.rooms(id) ON DELETE SET NULL,
  trainer_id UUID REFERENCES public.trainers(id) ON DELETE SET NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL DEFAULT 20,
  is_active BOOLEAN DEFAULT true,
  valid_from DATE,
  valid_until DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE FERIADOS E FECHAMENTOS
CREATE TABLE IF NOT EXISTS public.closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  affects_all_modalities BOOLEAN DEFAULT true,
  modality_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_classes_company_date ON public.classes(company_id, date);
CREATE INDEX idx_classes_modality ON public.classes(modality_id);
CREATE INDEX idx_classes_trainer ON public.classes(trainer_id);
CREATE INDEX idx_classes_status ON public.classes(status);
CREATE INDEX idx_class_bookings_class ON public.class_bookings(class_id);
CREATE INDEX idx_class_bookings_athlete ON public.class_bookings(athlete_id);
CREATE INDEX idx_class_bookings_status ON public.class_bookings(status);
CREATE INDEX idx_modalities_company ON public.modalities(company_id);
CREATE INDEX idx_rooms_company ON public.rooms(company_id);

-- RLS POLICIES

-- Modalities
ALTER TABLE public.modalities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage modalities"
ON public.modalities FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

-- Rooms
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage rooms"
ON public.rooms FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

-- Classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage classes"
ON public.classes FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

-- Class Bookings
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage bookings"
ON public.class_bookings FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

CREATE POLICY "Athletes can view their own bookings"
ON public.class_bookings FOR SELECT
USING (EXISTS (
  SELECT 1 FROM athletes a
  WHERE a.id = class_bookings.athlete_id
  AND a.email = (SELECT email FROM auth.users WHERE id = auth.uid())
));

-- Class Check-ins
ALTER TABLE public.class_check_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage check-ins"
ON public.class_check_ins FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

-- Class Templates
ALTER TABLE public.class_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage templates"
ON public.class_templates FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

-- Closures
ALTER TABLE public.closures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Company members can manage closures"
ON public.closures FOR ALL
USING (can_access_company_data(company_id))
WITH CHECK (can_access_company_data(company_id));

-- TRIGGERS PARA updated_at
CREATE TRIGGER update_modalities_updated_at
  BEFORE UPDATE ON public.modalities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_class_templates_updated_at
  BEFORE UPDATE ON public.class_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- FUNÇÃO PARA ATUALIZAR CONTAGEM DE RESERVAS
CREATE OR REPLACE FUNCTION update_class_bookings_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE public.classes
    SET current_bookings = current_bookings + 1
    WHERE id = NEW.class_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
      UPDATE public.classes
      SET current_bookings = current_bookings + 1
      WHERE id = NEW.class_id;
    ELSIF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
      UPDATE public.classes
      SET current_bookings = GREATEST(0, current_bookings - 1)
      WHERE id = NEW.class_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
    UPDATE public.classes
    SET current_bookings = GREATEST(0, current_bookings - 1)
    WHERE id = OLD.class_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_class_bookings_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.class_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_class_bookings_count();