import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

interface CRMStage {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  color: string;
  position: number;
  is_active: boolean;
  is_won: boolean;
  is_lost: boolean;
  created_at: string;
  updated_at: string;
}

export const useCRMStages = () => {
  const [stages, setStages] = useState<CRMStage[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchStages = async () => {
    if (!currentCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('crm_stages')
        .select('*')
        .eq('company_id', currentCompany.id)
        .eq('is_active', true)
        .order('position');

      if (error) throw error;

      setStages(data || []);
    } catch (error) {
      console.error('Erro ao carregar estágios:', error);
      toast.error('Erro ao carregar estágios do CRM');
    } finally {
      setLoading(false);
    }
  };

  const saveStage = async (stageData: Partial<CRMStage>): Promise<boolean> => {
    if (!currentCompany?.id) {
      toast.error('Empresa não identificada');
      return false;
    }

    try {
      const stageToSave: any = {
        ...stageData,
        company_id: currentCompany.id,
      };

      if (stageData.id) {
        const { error } = await supabase
          .from('crm_stages')
          .update(stageToSave)
          .eq('id', stageData.id);

        if (error) throw error;
        toast.success('Estágio atualizado!');
      } else {
        const { error } = await supabase
          .from('crm_stages')
          .insert([stageToSave]);

        if (error) throw error;
        toast.success('Estágio criado!');
      }

      await fetchStages();
      return true;
    } catch (error) {
      console.error('Erro ao salvar estágio:', error);
      toast.error('Erro ao salvar estágio');
      return false;
    }
  };

  useEffect(() => {
    if (currentCompany?.id) fetchStages();
  }, [currentCompany?.id]);

  return {
    stages,
    loading,
    saveStage,
    refetch: fetchStages,
  };
};
