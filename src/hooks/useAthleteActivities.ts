import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface AthleteActivity {
  id: string;
  type: string;
  description: string;
  performed_by_name: string | null;
  created_at: string;
  metadata: any;
}

export const useAthleteActivities = (athleteId: string, companyId: string) => {
  const [activities, setActivities] = useState<AthleteActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!athleteId || !companyId) return;

    try {
      const { data, error } = await supabase
        .from('athlete_activities')
        .select('*')
        .eq('athlete_id', athleteId)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching athlete activities:', error);
      toast.error('Erro ao carregar histórico de atividades');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [athleteId, companyId]);

  return { activities, loading, refetch: fetchActivities };
};
