import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CagioSubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  max_athletes: number | null;
  max_staff: number | null;
  max_classes_per_month: number | null;
  is_active: boolean;
  display_order: number;
}

export const useCagioSubscriptionPlans = () => {
  const { data: plans = [], isLoading } = useQuery({
    queryKey: ['cagio-subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cagio_subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return (data || []) as CagioSubscriptionPlan[];
    },
  });

  return {
    plans,
    isLoading,
  };
};
