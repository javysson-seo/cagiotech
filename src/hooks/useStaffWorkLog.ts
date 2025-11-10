import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

export interface StaffWorkLog {
  id?: string;
  company_id: string;
  staff_id: string;
  log_date: string;
  log_type: 'hours' | 'class' | 'bonus' | 'deduction';
  hours_worked?: number;
  class_id?: string;
  amount?: number;
  description?: string;
  created_by?: string;
  created_at?: string;
  staff?: {
    name: string;
    position: string;
  };
}

export const useStaffWorkLog = () => {
  const [logs, setLogs] = useState<StaffWorkLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchLogs = useCallback(async (staffId?: string, startDate?: string, endDate?: string) => {
    if (!currentCompany?.id) return;

    try {
      setLoading(true);
      let query = (supabase as any)
        .from('staff_work_log')
        .select(`
          *,
          staff:staff_id (
            name,
            position
          )
        `)
        .eq('company_id', currentCompany.id);

      if (staffId) {
        query = query.eq('staff_id', staffId);
      }

      if (startDate) {
        query = query.gte('log_date', startDate);
      }

      if (endDate) {
        query = query.lte('log_date', endDate);
      }

      const { data, error } = await query.order('log_date', { ascending: false });

      if (error) {
        console.error('Error fetching work logs:', error);
        toast.error('Erro ao carregar registros de trabalho.');
        return;
      }

      setLogs((data as StaffWorkLog[]) || []);
    } catch (error) {
      console.error('Error fetching work logs:', error);
      toast.error('Erro ao carregar registros de trabalho.');
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.id]);

  const saveLog = async (logData: StaffWorkLog) => {
    if (!currentCompany?.id) {
      toast.error('Nenhuma empresa selecionada.');
      return;
    }

    try {
      const logWithCompany = {
        ...logData,
        company_id: currentCompany.id,
        created_at: new Date().toISOString()
      };

      if (logData.id) {
        // Update existing log
        const { error } = await (supabase as any)
          .from('staff_work_log')
          .update(logWithCompany)
          .eq('id', logData.id);

        if (error) {
          console.error('Error updating work log:', error);
          toast.error('Erro ao atualizar registro de trabalho.');
          return;
        }

        toast.success('Registro atualizado com sucesso!');
      } else {
        // Create new log
        const { error } = await (supabase as any)
          .from('staff_work_log')
          .insert([logWithCompany]);

        if (error) {
          console.error('Error creating work log:', error);
          toast.error('Erro ao criar registro de trabalho.');
          return;
        }

        toast.success('Registro criado com sucesso!');
      }

      await fetchLogs();
    } catch (error) {
      console.error('Error saving work log:', error);
      toast.error('Erro ao salvar registro de trabalho.');
    }
  };

  const deleteLog = async (logId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('staff_work_log')
        .delete()
        .eq('id', logId);

      if (error) {
        console.error('Error deleting work log:', error);
        toast.error('Erro ao excluir registro de trabalho.');
        return;
      }

      toast.success('Registro excluído com sucesso!');
      await fetchLogs();
    } catch (error) {
      console.error('Error deleting work log:', error);
      toast.error('Erro ao excluir registro de trabalho.');
    }
  };

  useEffect(() => {
    if (currentCompany?.id) {
      fetchLogs();
    }
  }, [currentCompany?.id, fetchLogs]);

  return {
    logs,
    loading,
    saveLog,
    deleteLog,
    refetch: fetchLogs
  };
};
