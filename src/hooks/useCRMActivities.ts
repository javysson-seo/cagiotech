import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

interface CRMActivity {
  id: string;
  company_id: string;
  deal_id?: string;
  prospect_id?: string;
  activity_type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'stage_change';
  title: string;
  description?: string;
  duration_minutes?: number;
  scheduled_at?: string;
  completed_at?: string;
  status: 'pending' | 'completed' | 'cancelled';
  created_by?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export const useCRMActivities = (dealId?: string) => {
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchActivities = async () => {
    if (!currentCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      let query = supabase
        .from('crm_activities')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      if (dealId) {
        query = query.eq('deal_id', dealId);
      }

      const { data, error } = await query;

      if (error) throw error;

      setActivities((data || []) as CRMActivity[]);
    } catch (error) {
      console.error('Erro ao carregar atividades:', error);
      toast.error('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  };

  const saveActivity = async (activityData: Partial<CRMActivity>): Promise<boolean> => {
    if (!currentCompany?.id) {
      toast.error('Empresa não identificada');
      return false;
    }

    try {
      const activityToSave: any = {
        ...activityData,
        company_id: currentCompany.id,
      };

      const { error } = await supabase
        .from('crm_activities')
        .insert([activityToSave]);

      if (error) throw error;

      toast.success('Atividade registrada!');
      await fetchActivities();
      return true;
    } catch (error) {
      console.error('Erro ao salvar atividade:', error);
      toast.error('Erro ao salvar atividade');
      return false;
    }
  };

  useEffect(() => {
    if (currentCompany?.id) fetchActivities();
  }, [currentCompany?.id, dealId]);

  return {
    activities,
    loading,
    saveActivity,
    refetch: fetchActivities,
  };
};
