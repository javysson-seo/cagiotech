import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

export interface Payroll {
  id?: string;
  company_id: string;
  staff_id: string;
  reference_month: string; // YYYY-MM-DD format
  base_salary: number;
  hours_worked?: number;
  classes_taught?: number;
  bonuses?: number;
  deductions?: number;
  commissions?: number;
  gross_amount: number;
  net_amount: number;
  tax_amount?: number;
  social_security?: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  payment_date?: string;
  payment_method?: string;
  notes?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  staff?: {
    name: string;
    position: string;
    email?: string;
  };
}

export const usePayroll = () => {
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchPayrolls = useCallback(async (month?: string) => {
    if (!currentCompany?.id) return;

    try {
      setLoading(true);
      let query = (supabase as any)
        .from('payroll')
        .select(`
          *,
          staff:staff_id (
            name,
            position,
            email
          )
        `)
        .eq('company_id', currentCompany.id);

      if (month) {
        query = query.eq('reference_month', month);
      }

      const { data, error } = await query.order('reference_month', { ascending: false });

      if (error) {
        console.error('Error fetching payrolls:', error);
        toast.error('Erro ao carregar folhas de pagamento.');
        return;
      }

      setPayrolls((data as Payroll[]) || []);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      toast.error('Erro ao carregar folhas de pagamento.');
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.id]);

  const generatePayroll = async (month: string) => {
    if (!currentCompany?.id) {
      toast.error('Nenhuma empresa selecionada.');
      return;
    }

    try {
      // Get all active staff with payment configs
      const { data: staffData, error: staffError } = await (supabase as any)
        .from('staff')
        .select(`
          id,
          name,
          position,
          staff_payment_config!inner (
            payment_type,
            base_amount,
            hourly_rate,
            per_class_rate,
            commission_percentage
          )
        `)
        .eq('company_id', currentCompany.id)
        .eq('status', 'active');

      if (staffError) throw staffError;

      // Get work logs for the month
      const monthStart = `${month}-01`;
      const monthEnd = new Date(month + '-01');
      monthEnd.setMonth(monthEnd.getMonth() + 1);
      const monthEndStr = monthEnd.toISOString().split('T')[0];

      const { data: workLogs, error: logsError } = await (supabase as any)
        .from('staff_work_log')
        .select('*')
        .eq('company_id', currentCompany.id)
        .gte('log_date', monthStart)
        .lt('log_date', monthEndStr);

      if (logsError) throw logsError;

      // Generate payroll for each staff member
      const payrollData = staffData.map((staff: any) => {
        const config = staff.staff_payment_config[0];
        const staffLogs = workLogs?.filter((log: any) => log.staff_id === staff.id) || [];
        
        const hoursWorked = staffLogs
          .filter((log: any) => log.log_type === 'hours')
          .reduce((sum: number, log: any) => sum + (log.hours_worked || 0), 0);
        
        const classesTaught = staffLogs.filter((log: any) => log.log_type === 'class').length;

        let grossAmount = 0;
        
        switch (config.payment_type) {
          case 'monthly_salary':
            grossAmount = config.base_amount;
            break;
          case 'hourly':
            grossAmount = hoursWorked * (config.hourly_rate || 0);
            break;
          case 'per_class':
            grossAmount = classesTaught * (config.per_class_rate || 0);
            break;
          case 'mixed':
            grossAmount = config.base_amount + (classesTaught * (config.per_class_rate || 0));
            break;
        }

        // Simple tax calculation (23% IRS + 11% SS)
        const taxAmount = grossAmount * 0.23;
        const socialSecurity = grossAmount * 0.11;
        const netAmount = grossAmount - taxAmount - socialSecurity;

        return {
          company_id: currentCompany.id,
          staff_id: staff.id,
          reference_month: monthStart,
          base_salary: config.base_amount,
          hours_worked: hoursWorked,
          classes_taught: classesTaught,
          bonuses: 0,
          deductions: 0,
          commissions: 0,
          gross_amount: grossAmount,
          net_amount: netAmount,
          tax_amount: taxAmount,
          social_security: socialSecurity,
          payment_status: 'pending',
          created_at: new Date().toISOString()
        };
      });

      const { error: insertError } = await (supabase as any)
        .from('payroll')
        .insert(payrollData);

      if (insertError) {
        console.error('Error generating payroll:', insertError);
        toast.error('Erro ao gerar folha de pagamento.');
        return;
      }

      toast.success('Folha de pagamento gerada com sucesso!');
      await fetchPayrolls(monthStart);
    } catch (error) {
      console.error('Error generating payroll:', error);
      toast.error('Erro ao gerar folha de pagamento.');
    }
  };

  const updatePayrollStatus = async (payrollId: string, status: string, paymentDate?: string) => {
    try {
      const { error } = await (supabase as any)
        .from('payroll')
        .update({
          payment_status: status,
          payment_date: paymentDate || new Date().toISOString().split('T')[0],
          updated_at: new Date().toISOString()
        })
        .eq('id', payrollId);

      if (error) {
        console.error('Error updating payroll status:', error);
        toast.error('Erro ao atualizar status do pagamento.');
        return;
      }

      toast.success('Status atualizado com sucesso!');
      await fetchPayrolls();
    } catch (error) {
      console.error('Error updating payroll status:', error);
      toast.error('Erro ao atualizar status do pagamento.');
    }
  };

  useEffect(() => {
    if (currentCompany?.id) {
      fetchPayrolls();
    }
  }, [currentCompany?.id, fetchPayrolls]);

  return {
    payrolls,
    loading,
    generatePayroll,
    updatePayrollStatus,
    refetch: fetchPayrolls
  };
};
