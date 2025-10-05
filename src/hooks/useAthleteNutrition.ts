import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface NutritionPlan {
  id: string;
  title: string;
  description: string | null;
  plan_details: any;
  created_at: string;
  trainers: {
    name: string;
  } | null;
}

export const useAthleteNutrition = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    if (!user?.email) return;

    try {
      // Get athlete ID
      const { data: athlete } = await supabase
        .from('athletes')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (!athlete) {
        setLoading(false);
        return;
      }

      // Get nutrition plans
      const { data, error } = await supabase
        .from('nutritional_plans')
        .select(`
          id,
          title,
          description,
          plan_details,
          created_at,
          trainers (name)
        `)
        .eq('athlete_id', athlete.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPlans(data as NutritionPlan[]);
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [user?.email]);

  return { plans, loading, refetch: fetchPlans };
};
