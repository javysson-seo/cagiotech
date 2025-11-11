import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

export interface HRActivity {
  id: string;
  company_id: string;
  activity_type: string;
  title: string;
  description?: string;
  performed_by: string;
  performed_by_name?: string;
  reference_id?: string;
  metadata?: any;
  created_at: string;
}

export const useHRActivities = () => {
  const { currentCompany } = useCompany();
  const [activities, setActivities] = useState<HRActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    if (!currentCompany?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hr_activities')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
      console.error('Error fetching HR activities:', error);
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (
    activityType: string,
    title: string,
    description?: string,
    referenceId?: string,
    metadata?: any
  ) => {
    if (!currentCompany?.id) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      const { error } = await supabase
        .from('hr_activities')
        .insert({
          company_id: currentCompany.id,
          activity_type: activityType,
          title,
          description,
          performed_by: user?.id || '',
          performed_by_name: user?.email || 'Usuário',
          reference_id: referenceId,
          metadata: metadata || {}
        });

      if (error) throw error;
      
      // Refresh activities
      await fetchActivities();
    } catch (error: any) {
      console.error('Error logging activity:', error);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [currentCompany?.id]);

  return {
    activities,
    loading,
    logActivity,
    refetch: fetchActivities
  };
};
