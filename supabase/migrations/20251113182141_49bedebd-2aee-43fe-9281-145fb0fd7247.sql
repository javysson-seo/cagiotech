-- Create exercise library table
CREATE TABLE IF NOT EXISTS exercise_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('bodybuilding', 'crossfit', 'other')),
  muscle_group TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  description TEXT,
  video_url TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for better performance
CREATE INDEX idx_exercise_library_category ON exercise_library(category);
CREATE INDEX idx_exercise_library_muscle_group ON exercise_library(muscle_group);
CREATE INDEX idx_exercise_library_company_id ON exercise_library(company_id);
CREATE INDEX idx_exercise_library_is_default ON exercise_library(is_default);

-- Enable RLS
ALTER TABLE exercise_library ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view default exercises
CREATE POLICY "Everyone can view default exercises"
  ON exercise_library
  FOR SELECT
  USING (is_default = true);

-- Policy: Company members can view their custom exercises
CREATE POLICY "Company members can view custom exercises"
  ON exercise_library
  FOR SELECT
  USING (
    is_default = false 
    AND can_access_company_data(company_id)
  );

-- Policy: Company members can create custom exercises
CREATE POLICY "Company members can create custom exercises"
  ON exercise_library
  FOR INSERT
  WITH CHECK (
    is_default = false 
    AND can_access_company_data(company_id)
  );

-- Policy: Company members can update their custom exercises
CREATE POLICY "Company members can update custom exercises"
  ON exercise_library
  FOR UPDATE
  USING (
    is_default = false 
    AND can_access_company_data(company_id)
  );

-- Policy: Company members can delete their custom exercises
CREATE POLICY "Company members can delete custom exercises"
  ON exercise_library
  FOR DELETE
  USING (
    is_default = false 
    AND can_access_company_data(company_id)
  );

-- Trigger for updated_at
CREATE TRIGGER update_exercise_library_updated_at
  BEFORE UPDATE ON exercise_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();