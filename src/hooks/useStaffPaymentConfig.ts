import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

export interface StaffPaymentConfig {
  id?: string;
  staff_id: string;
  company_id: string;
  payment_type: 'monthly_salary' | 'hourly' | 'per_class' | 'commission' | 'mixed';
  base_amount: number;
  currency?: string;
  hourly_rate?: number;
  per_class_rate?: number;
  commission_percentage?: number;
  payment_day?: number;
  payment_frequency?: string;
  bank_account?: string;
  nib?: string;
  iban?: string;
  notes?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const useStaffPaymentConfig = () => {
  const [configs, setConfigs] = useState<StaffPaymentConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchConfigs = useCallback(async () => {
    if (!currentCompany?.id) return;

    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('staff_payment_config')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payment configs:', error);
        toast.error('Erro ao carregar configurações de pagamento.');
        return;
      }

      setConfigs((data as StaffPaymentConfig[]) || []);
    } catch (error) {
      console.error('Error fetching payment configs:', error);
      toast.error('Erro ao carregar configurações de pagamento.');
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.id]);

  const saveConfig = async (configData: StaffPaymentConfig) => {
    if (!currentCompany?.id) {
      toast.error('Nenhuma empresa selecionada.');
      return;
    }

    try {
      const configWithCompany = {
        ...configData,
        company_id: currentCompany.id,
        currency: 'EUR',
        updated_at: new Date().toISOString()
      };

      if (configData.id) {
        // Update existing config
        const { error } = await (supabase as any)
          .from('staff_payment_config')
          .update(configWithCompany)
          .eq('id', configData.id);

        if (error) {
          console.error('Error updating payment config:', error);
          toast.error('Erro ao atualizar configuração de pagamento.');
          return;
        }

        toast.success('Configuração atualizada com sucesso!');
      } else {
        // Create new config
        const { error } = await (supabase as any)
          .from('staff_payment_config')
          .insert([{ ...configWithCompany, created_at: new Date().toISOString() }]);

        if (error) {
          console.error('Error creating payment config:', error);
          toast.error('Erro ao criar configuração de pagamento.');
          return;
        }

        toast.success('Configuração criada com sucesso!');
      }

      await fetchConfigs();
    } catch (error) {
      console.error('Error saving payment config:', error);
      toast.error('Erro ao salvar configuração de pagamento.');
    }
  };

  const deleteConfig = async (configId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('staff_payment_config')
        .delete()
        .eq('id', configId);

      if (error) {
        console.error('Error deleting payment config:', error);
        toast.error('Erro ao excluir configuração de pagamento.');
        return;
      }

      toast.success('Configuração excluída com sucesso!');
      await fetchConfigs();
    } catch (error) {
      console.error('Error deleting payment config:', error);
      toast.error('Erro ao excluir configuração de pagamento.');
    }
  };

  const getConfigByStaffId = (staffId: string) => {
    return configs.find(config => config.staff_id === staffId);
  };

  useEffect(() => {
    if (currentCompany?.id) {
      fetchConfigs();
    }
  }, [currentCompany?.id, fetchConfigs]);

  return {
    configs,
    loading,
    saveConfig,
    deleteConfig,
    getConfigByStaffId,
    refetch: fetchConfigs
  };
};
