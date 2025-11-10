import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';

export interface CompanySubscription {
  subscription_plan?: string;
  subscription_status?: 'trial' | 'active' | 'cancelled' | 'expired';
  trial_start_date?: string;
  trial_end_date?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  daysLeftInTrial?: number;
  isTrialActive: boolean;
  isSubscriptionActive: boolean;
}

export const useCompanySubscription = () => {
  const { currentCompany } = useCompany();
  const [subscription, setSubscription] = useState<CompanySubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!currentCompany?.id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await (supabase as any)
          .from('companies')
          .select('subscription_plan, subscription_status, trial_start_date, trial_end_date, subscription_start_date, subscription_end_date')
          .eq('id', currentCompany.id)
          .single();

        if (error) {
          console.error('Error fetching subscription:', error);
          setLoading(false);
          return;
        }

        if (data) {
          // Calculate days left in trial
          let daysLeftInTrial = 0;
          let isTrialActive = false;
          
          if (data.trial_end_date) {
            const trialEnd = new Date(data.trial_end_date);
            const now = new Date();
            const diffTime = trialEnd.getTime() - now.getTime();
            daysLeftInTrial = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            isTrialActive = daysLeftInTrial > 0 && data.subscription_status === 'trial';
          }

          // Check if subscription is active
          const isSubscriptionActive = 
            (data.subscription_status === 'trial' && isTrialActive) ||
            (data.subscription_status === 'active' && 
             (!data.subscription_end_date || new Date(data.subscription_end_date) > new Date()));

          setSubscription({
            subscription_plan: data.subscription_plan,
            subscription_status: data.subscription_status,
            trial_start_date: data.trial_start_date,
            trial_end_date: data.trial_end_date,
            subscription_start_date: data.subscription_start_date,
            subscription_end_date: data.subscription_end_date,
            daysLeftInTrial,
            isTrialActive,
            isSubscriptionActive
          });
        }
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [currentCompany?.id]);

  return { subscription, loading };
};
