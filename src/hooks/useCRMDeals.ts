import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

interface CRMDeal {
  id: string;
  company_id: string;
  prospect_id?: string;
  stage_id: string;
  assigned_to?: string;
  title: string;
  description?: string;
  value?: number;
  currency: string;
  probability: number;
  expected_close_date?: string;
  actual_close_date?: string;
  status: 'active' | 'won' | 'lost' | 'on_hold';
  lost_reason?: string;
  tags?: string[];
  custom_fields?: Record<string, any>;
  created_at: string;
  updated_at: string;
  created_by?: string;
  prospect?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
  };
}

export const useCRMDeals = () => {
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchDeals = async () => {
    if (!currentCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('crm_deals')
        .select(`
          *,
          prospect:prospect_id(id, name, email, phone)
        `)
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setDeals((data || []) as CRMDeal[]);
    } catch (error) {
      console.error('Erro ao carregar deals:', error);
      toast.error('Erro ao carregar oportunidades');
    } finally {
      setLoading(false);
    }
  };

  const saveDeal = async (dealData: Partial<CRMDeal>): Promise<boolean> => {
    if (!currentCompany?.id) {
      toast.error('Empresa não identificada');
      return false;
    }

    try {
      const { prospect, ...dealToSave } = dealData as any;
      dealToSave.company_id = currentCompany.id;

      if (dealData.id) {
        const { error } = await supabase
          .from('crm_deals')
          .update(dealToSave)
          .eq('id', dealData.id);

        if (error) throw error;
        toast.success('Oportunidade atualizada!');
      } else {
        const { error } = await supabase
          .from('crm_deals')
          .insert([dealToSave]);

        if (error) throw error;
        toast.success('Oportunidade criada!');
      }

      await fetchDeals();
      return true;
    } catch (error) {
      console.error('Erro ao salvar deal:', error);
      toast.error('Erro ao salvar oportunidade');
      return false;
    }
  };

  const updateDealStage = async (dealId: string, newStageId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('crm_deals')
        .update({ stage_id: newStageId })
        .eq('id', dealId);

      if (error) throw error;

      await fetchDeals();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar estágio:', error);
      toast.error('Erro ao mover oportunidade');
      return false;
    }
  };

  const deleteDeal = async (dealId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('crm_deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;

      setDeals(prev => prev.filter(d => d.id !== dealId));
      toast.success('Oportunidade excluída');
      return true;
    } catch (error) {
      console.error('Erro ao excluir deal:', error);
      toast.error('Erro ao excluir oportunidade');
      return false;
    }
  };

  useEffect(() => {
    if (currentCompany?.id) fetchDeals();
  }, [currentCompany?.id]);

  return {
    deals,
    loading,
    saveDeal,
    updateDealStage,
    deleteDeal,
    refetch: fetchDeals,
  };
};
