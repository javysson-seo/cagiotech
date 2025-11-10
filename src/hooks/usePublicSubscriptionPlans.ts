import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PublicSubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  max_athletes?: number;
  max_staff?: number;
  max_classes_per_month?: number;
  is_active: boolean;
  display_order: number;
}

export const usePublicSubscriptionPlans = () => {
  const [plans, setPlans] = useState<PublicSubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) {
          console.error('Error fetching subscription plans:', error);
          return;
        }

        setPlans((data as PublicSubscriptionPlan[]) || []);
      } catch (error) {
        console.error('Error fetching subscription plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading };
};
