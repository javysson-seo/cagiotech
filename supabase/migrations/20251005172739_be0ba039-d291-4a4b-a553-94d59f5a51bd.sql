-- Tabela de definições de badges
CREATE TABLE public.badge_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('attendance', 'streak', 'performance', 'social', 'special')),
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('attendance_count', 'streak_days', 'points_total', 'referrals', 'personal_record')),
  requirement_value INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT '#10b981',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de pontos dos atletas
CREATE TABLE public.athlete_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  points INTEGER NOT NULL DEFAULT 0,
  reason TEXT NOT NULL CHECK (reason IN ('attendance', 'punctuality', 'personal_record', 'referral', 'streak_bonus', 'manual')),
  reference_id UUID,
  awarded_by UUID REFERENCES auth.users(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de badges conquistados
CREATE TABLE public.athlete_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id UUID NOT NULL REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badge_definitions(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(athlete_id, badge_id)
);

-- Tabela de níveis dos atletas
CREATE TABLE public.athlete_levels (
  athlete_id UUID PRIMARY KEY REFERENCES public.athletes(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  current_level TEXT NOT NULL DEFAULT 'Novato',
  total_points INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  current_streak INTEGER NOT NULL DEFAULT 0,
  last_check_in_date DATE,
  total_classes INTEGER NOT NULL DEFAULT 0,
  total_referrals INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de configurações de gamificação por empresa
CREATE TABLE public.gamification_settings (
  company_id UUID PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT true,
  points_per_attendance INTEGER DEFAULT 10,
  points_per_punctuality INTEGER DEFAULT 5,
  points_per_personal_record INTEGER DEFAULT 50,
  points_per_referral INTEGER DEFAULT 100,
  streak_bonus_enabled BOOLEAN DEFAULT true,
  streak_bonus_points INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_athlete_points_athlete ON public.athlete_points(athlete_id);
CREATE INDEX idx_athlete_points_company ON public.athlete_points(company_id);
CREATE INDEX idx_athlete_points_created ON public.athlete_points(created_at);
CREATE INDEX idx_athlete_badges_athlete ON public.athlete_badges(athlete_id);
CREATE INDEX idx_athlete_levels_company ON public.athlete_levels(company_id);

-- RLS Policies
ALTER TABLE public.badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.athlete_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_settings ENABLE ROW LEVEL SECURITY;

-- Badge Definitions (público para todos verem)
CREATE POLICY "Everyone can view badge definitions"
ON public.badge_definitions FOR SELECT
USING (true);

CREATE POLICY "Box owners can manage badge definitions"
ON public.badge_definitions FOR ALL
USING (EXISTS (
  SELECT 1 FROM public.companies c
  WHERE public.has_role(auth.uid(), 'box_owner'::app_role, c.id)
));

-- Athlete Points
CREATE POLICY "Athletes can view their own points"
ON public.athlete_points FOR SELECT
USING (
  athlete_id IN (
    SELECT id FROM public.athletes 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  OR public.can_access_company_data(company_id)
);

CREATE POLICY "Company members can manage points"
ON public.athlete_points FOR ALL
USING (public.can_access_company_data(company_id))
WITH CHECK (public.can_access_company_data(company_id));

-- Athlete Badges
CREATE POLICY "Athletes can view their own badges"
ON public.athlete_badges FOR SELECT
USING (
  athlete_id IN (
    SELECT id FROM public.athletes 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  OR public.can_access_company_data(company_id)
);

CREATE POLICY "Company members can manage badges"
ON public.athlete_badges FOR ALL
USING (public.can_access_company_data(company_id))
WITH CHECK (public.can_access_company_data(company_id));

-- Athlete Levels
CREATE POLICY "Athletes can view their own level"
ON public.athlete_levels FOR SELECT
USING (
  athlete_id IN (
    SELECT id FROM public.athletes 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )
  OR public.can_access_company_data(company_id)
);

CREATE POLICY "Company members can manage levels"
ON public.athlete_levels FOR ALL
USING (public.can_access_company_data(company_id))
WITH CHECK (public.can_access_company_data(company_id));

-- Gamification Settings
CREATE POLICY "Box owners can manage gamification settings"
ON public.gamification_settings FOR ALL
USING (public.has_role(auth.uid(), 'box_owner'::app_role, company_id))
WITH CHECK (public.has_role(auth.uid(), 'box_owner'::app_role, company_id));

-- Função para atualizar nível do atleta
CREATE OR REPLACE FUNCTION public.update_athlete_level()
RETURNS TRIGGER AS $$
DECLARE
  current_total INTEGER;
  new_level TEXT;
BEGIN
  -- Calcula total de pontos
  SELECT COALESCE(SUM(points), 0) INTO current_total
  FROM public.athlete_points
  WHERE athlete_id = NEW.athlete_id;
  
  -- Define o nível baseado nos pontos
  IF current_total < 100 THEN
    new_level := 'Novato';
  ELSIF current_total < 500 THEN
    new_level := 'Intermediário';
  ELSIF current_total < 1000 THEN
    new_level := 'Avançado';
  ELSIF current_total < 2500 THEN
    new_level := 'Elite';
  ELSE
    new_level := 'Lendário';
  END IF;
  
  -- Atualiza ou insere o nível
  INSERT INTO public.athlete_levels (athlete_id, company_id, current_level, total_points)
  VALUES (NEW.athlete_id, NEW.company_id, new_level, current_total)
  ON CONFLICT (athlete_id) 
  DO UPDATE SET 
    total_points = current_total,
    current_level = new_level,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para atualizar nível quando pontos são adicionados
CREATE TRIGGER trigger_update_athlete_level
AFTER INSERT ON public.athlete_points
FOR EACH ROW
EXECUTE FUNCTION public.update_athlete_level();

-- Função para atualizar streak
CREATE OR REPLACE FUNCTION public.update_athlete_streak()
RETURNS TRIGGER AS $$
DECLARE
  last_checkin DATE;
  current_streak_val INTEGER := 1;
  best_streak_val INTEGER;
BEGIN
  -- Pega o último check-in e streak atual
  SELECT last_check_in_date, current_streak, best_streak 
  INTO last_checkin, current_streak_val, best_streak_val
  FROM public.athlete_levels
  WHERE athlete_id = NEW.athlete_id;
  
  -- Se não existe registro, cria um novo
  IF last_checkin IS NULL THEN
    INSERT INTO public.athlete_levels (athlete_id, company_id, current_streak, best_streak, last_check_in_date, total_classes)
    VALUES (NEW.athlete_id, NEW.company_id, 1, 1, CURRENT_DATE, 1)
    ON CONFLICT (athlete_id) DO UPDATE SET
      current_streak = 1,
      best_streak = GREATEST(athlete_levels.best_streak, 1),
      last_check_in_date = CURRENT_DATE,
      total_classes = athlete_levels.total_classes + 1;
    RETURN NEW;
  END IF;
  
  -- Calcula streak
  IF CURRENT_DATE = last_checkin THEN
    -- Mesmo dia, não faz nada
    RETURN NEW;
  ELSIF CURRENT_DATE = last_checkin + 1 THEN
    -- Dia consecutivo
    current_streak_val := COALESCE(current_streak_val, 0) + 1;
  ELSE
    -- Quebrou o streak
    current_streak_val := 1;
  END IF;
  
  -- Atualiza
  UPDATE public.athlete_levels
  SET 
    current_streak = current_streak_val,
    best_streak = GREATEST(COALESCE(best_streak, 0), current_streak_val),
    last_check_in_date = CURRENT_DATE,
    total_classes = total_classes + 1,
    updated_at = now()
  WHERE athlete_id = NEW.athlete_id;
  
  -- Bônus de streak (a cada 7 dias)
  IF current_streak_val % 7 = 0 THEN
    INSERT INTO public.athlete_points (athlete_id, company_id, points, reason, notes)
    SELECT NEW.athlete_id, NEW.company_id, 
      COALESCE(gs.streak_bonus_points, 5),
      'streak_bonus',
      'Bônus de ' || current_streak_val || ' dias consecutivos'
    FROM public.gamification_settings gs
    WHERE gs.company_id = NEW.company_id AND gs.enabled = true AND gs.streak_bonus_enabled = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para atualizar streak quando há check-in
CREATE TRIGGER trigger_update_athlete_streak
AFTER INSERT ON public.class_check_ins
FOR EACH ROW
EXECUTE FUNCTION public.update_athlete_streak();

-- Função para dar pontos por check-in
CREATE OR REPLACE FUNCTION public.award_attendance_points()
RETURNS TRIGGER AS $$
DECLARE
  settings RECORD;
  class_time TIME;
  checkin_time TIME;
  is_punctual BOOLEAN := false;
BEGIN
  -- Pega as configurações de gamificação
  SELECT * INTO settings
  FROM public.gamification_settings
  WHERE company_id = NEW.company_id AND enabled = true;
  
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;
  
  -- Pontos por presença
  INSERT INTO public.athlete_points (athlete_id, company_id, points, reason, reference_id)
  VALUES (NEW.athlete_id, NEW.company_id, settings.points_per_attendance, 'attendance', NEW.id);
  
  -- Verifica pontualidade (chegou até 5 minutos após o início da aula)
  SELECT start_time INTO class_time
  FROM public.classes
  WHERE id = NEW.class_id;
  
  checkin_time := NEW.check_in_time::TIME;
  
  IF checkin_time <= class_time + INTERVAL '5 minutes' THEN
    INSERT INTO public.athlete_points (athlete_id, company_id, points, reason, reference_id, notes)
    VALUES (NEW.athlete_id, NEW.company_id, settings.points_per_punctuality, 'punctuality', NEW.id, 'Chegou no horário!');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para dar pontos quando há check-in
CREATE TRIGGER trigger_award_attendance_points
AFTER INSERT ON public.class_check_ins
FOR EACH ROW
EXECUTE FUNCTION public.award_attendance_points();

-- Inserir badges padrão
INSERT INTO public.badge_definitions (name, description, icon, category, requirement_type, requirement_value, color) VALUES
('Primeira Aula', 'Completou sua primeira aula', '🎯', 'attendance', 'attendance_count', 1, '#10b981'),
('Dedicado', 'Completou 10 aulas', '💪', 'attendance', 'attendance_count', 10, '#3b82f6'),
('Guerreiro', 'Completou 50 aulas', '⚔️', 'attendance', 'attendance_count', 50, '#8b5cf6'),
('Lendário', 'Completou 100 aulas', '👑', 'attendance', 'attendance_count', 100, '#eab308'),
('Fogo', 'Manteve 7 dias consecutivos', '🔥', 'streak', 'streak_days', 7, '#f97316'),
('Imparável', 'Manteve 30 dias consecutivos', '⚡', 'streak', 'streak_days', 30, '#dc2626'),
('Recrutador', 'Indicou 1 amigo', '🤝', 'social', 'referrals', 1, '#06b6d4'),
('Embaixador', 'Indicou 5 amigos', '🌟', 'social', 'referrals', 5, '#a855f7'),
('Ascensão', 'Alcançou 500 pontos', '📈', 'performance', 'points_total', 500, '#14b8a6'),
('Campeão', 'Alcançou 2500 pontos', '🏆', 'performance', 'points_total', 2500, '#f59e0b');

-- Função para verificar e atribuir badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  badge RECORD;
  level_data RECORD;
BEGIN
  -- Pega dados do atleta
  SELECT * INTO level_data
  FROM public.athlete_levels
  WHERE athlete_id = NEW.athlete_id;
  
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;
  
  -- Verifica cada badge
  FOR badge IN SELECT * FROM public.badge_definitions LOOP
    -- Se já tem o badge, pula
    IF EXISTS (SELECT 1 FROM public.athlete_badges WHERE athlete_id = NEW.athlete_id AND badge_id = badge.id) THEN
      CONTINUE;
    END IF;
    
    -- Verifica se qualifica para o badge
    CASE badge.requirement_type
      WHEN 'attendance_count' THEN
        IF level_data.total_classes >= badge.requirement_value THEN
          INSERT INTO public.athlete_badges (athlete_id, company_id, badge_id)
          VALUES (NEW.athlete_id, NEW.company_id, badge.id);
        END IF;
      WHEN 'streak_days' THEN
        IF level_data.current_streak >= badge.requirement_value THEN
          INSERT INTO public.athlete_badges (athlete_id, company_id, badge_id)
          VALUES (NEW.athlete_id, NEW.company_id, badge.id);
        END IF;
      WHEN 'points_total' THEN
        IF level_data.total_points >= badge.requirement_value THEN
          INSERT INTO public.athlete_badges (athlete_id, company_id, badge_id)
          VALUES (NEW.athlete_id, NEW.company_id, badge.id);
        END IF;
      WHEN 'referrals' THEN
        IF level_data.total_referrals >= badge.requirement_value THEN
          INSERT INTO public.athlete_badges (athlete_id, company_id, badge_id)
          VALUES (NEW.athlete_id, NEW.company_id, badge.id);
        END IF;
    END CASE;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger para verificar badges quando há atualização de nível
CREATE TRIGGER trigger_check_badges
AFTER INSERT OR UPDATE ON public.athlete_levels
FOR EACH ROW
EXECUTE FUNCTION public.check_and_award_badges();