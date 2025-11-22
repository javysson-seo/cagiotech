-- Adicionar campo para controlar o onboarding
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- Adicionar campo para o plano de trial
ALTER TABLE companies
ADD COLUMN IF NOT EXISTS trial_plan_id UUID REFERENCES cagio_subscription_plans(id);