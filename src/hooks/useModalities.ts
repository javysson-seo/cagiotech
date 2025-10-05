import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

interface Modality {
  id?: string;
  company_id?: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  duration_minutes?: number;
  max_capacity?: number;
  requires_booking?: boolean;
  is_active?: boolean;
}

export const useModalities = () => {
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchModalities = async () => {
    if (!currentCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('modalities')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('name');

      if (error) throw error;

      setModalities(data || []);
    } catch (error) {
      console.error('Erro ao carregar modalidades:', error);
      toast.error('Erro ao carregar modalidades');
    } finally {
      setLoading(false);
    }
  };

  const saveModality = async (modalityData: Modality): Promise<boolean> => {
    if (!currentCompany?.id) {
      toast.error('Empresa não identificada');
      return false;
    }

    try {
      const modalityToSave = {
        ...modalityData,
        company_id: currentCompany.id,
      };

      let result;
      
      if (modalityData.id) {
        const { id, ...updateData } = modalityToSave;
        result = await supabase
          .from('modalities')
          .update(updateData)
          .eq('id', modalityData.id)
          .eq('company_id', currentCompany.id)
          .select()
          .single();
      } else {
        const { id, ...insertData } = modalityToSave;
        result = await supabase
          .from('modalities')
          .insert([insertData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      if (modalityData.id) {
        setModalities(prev => prev.map(m => m.id === modalityData.id ? result.data : m));
        toast.success('Modalidade atualizada com sucesso!');
      } else {
        setModalities(prev => [result.data, ...prev]);
        toast.success('Modalidade criada com sucesso!');
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar modalidade:', error);
      toast.error('Erro ao salvar modalidade');
      return false;
    }
  };

  const deleteModality = async (modalityId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('modalities')
        .delete()
        .eq('id', modalityId);

      if (error) throw error;

      setModalities(prev => prev.filter(m => m.id !== modalityId));
      toast.success('Modalidade excluída com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao excluir modalidade:', error);
      toast.error('Erro ao excluir modalidade');
      return false;
    }
  };

  useEffect(() => {
    if (currentCompany?.id) fetchModalities();
  }, [currentCompany?.id]);

  return {
    modalities,
    loading,
    saveModality,
    deleteModality,
    refetchModalities: fetchModalities,
  };
};