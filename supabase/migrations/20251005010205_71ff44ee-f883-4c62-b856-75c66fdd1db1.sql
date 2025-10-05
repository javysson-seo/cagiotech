-- Corrigir warning de segurança: recriar função com search_path correto
DROP FUNCTION IF EXISTS update_class_bookings_count() CASCADE;

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
$$ LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public;

-- Recriar o trigger
CREATE TRIGGER update_class_bookings_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.class_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_class_bookings_count();