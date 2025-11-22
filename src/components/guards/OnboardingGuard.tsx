import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CompanyOnboardingModal } from '@/components/modals/CompanyOnboardingModal';
import { Loading } from '@/components/ui/loading';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [companyId, setCompanyId] = useState<string>('');

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Get user's role
      const { data: userRole } = await supabase
        .from('user_roles')
        .select('role, company_id')
        .eq('user_id', user.id)
        .single();

      // Only check onboarding for box_owners
      if (userRole?.role !== 'box_owner' || !userRole.company_id) {
        setLoading(false);
        return;
      }

      // Check if company needs onboarding
      const { data: company } = await supabase
        .from('companies')
        .select('id, onboarding_completed, trial_end_date')
        .eq('id', userRole.company_id)
        .single();

      if (company && !company.onboarding_completed) {
        setCompanyId(company.id);
        setNeedsOnboarding(true);
      }

      // Check if trial has expired
      if (company && company.trial_end_date) {
        const trialEnd = new Date(company.trial_end_date);
        if (trialEnd < new Date()) {
          // Trial expired - redirect to subscription page
          navigate(`/${company.id}/subscription`);
          return;
        }
      }
    } catch (error) {
      console.error('Error checking onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="Carregando..." />
      </div>
    );
  }

  if (needsOnboarding) {
    return (
      <>
        {children}
        <CompanyOnboardingModal companyId={companyId} />
      </>
    );
  }

  return <>{children}</>;
};