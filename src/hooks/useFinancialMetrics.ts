import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

export const useFinancialMetrics = (companyId: string) => {
  return useQuery({
    queryKey: ['financial-metrics', companyId],
    queryFn: async () => {
      const now = new Date();
      const currentMonthStart = startOfMonth(now);
      const currentMonthEnd = endOfMonth(now);
      const lastMonthStart = startOfMonth(subMonths(now, 1));
      const lastMonthEnd = endOfMonth(subMonths(now, 1));

      // Get current month transactions
      const { data: currentTransactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('company_id', companyId)
        .gte('transaction_date', format(currentMonthStart, 'yyyy-MM-dd'))
        .lte('transaction_date', format(currentMonthEnd, 'yyyy-MM-dd'));

      // Get last month transactions
      const { data: lastTransactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('company_id', companyId)
        .gte('transaction_date', format(lastMonthStart, 'yyyy-MM-dd'))
        .lte('transaction_date', format(lastMonthEnd, 'yyyy-MM-dd'));

      // Calculate current month metrics
      const currentRevenue = (currentTransactions || [])
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const currentExpenses = (currentTransactions || [])
        .filter(t => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate last month metrics
      const lastRevenue = (lastTransactions || [])
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const lastExpenses = (lastTransactions || [])
        .filter(t => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Get overdue payments
      const { data: overduePayments } = await supabase
        .from('athlete_payments')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .lt('due_date', format(now, 'yyyy-MM-dd'));

      const totalOverdue = (overduePayments || []).reduce((sum, p) => sum + Number(p.amount), 0);

      // Get total pending payments
      const { data: pendingPayments } = await supabase
        .from('athlete_payments')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending');

      const totalPending = (pendingPayments || []).reduce((sum, p) => sum + Number(p.amount), 0);

      // Calculate growth percentages
      const revenueGrowth = lastRevenue > 0 
        ? ((currentRevenue - lastRevenue) / lastRevenue) * 100 
        : 0;

      const expenseGrowth = lastExpenses > 0 
        ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 
        : 0;

      const defaultRate = totalPending > 0 
        ? (totalOverdue / totalPending) * 100 
        : 0;

      return {
        currentRevenue,
        currentExpenses,
        currentProfit: currentRevenue - currentExpenses,
        revenueGrowth,
        expenseGrowth,
        profitGrowth: lastRevenue - lastExpenses > 0 
          ? (((currentRevenue - currentExpenses) - (lastRevenue - lastExpenses)) / (lastRevenue - lastExpenses)) * 100 
          : 0,
        defaultRate,
        totalOverdue,
        totalPending,
        overdueCount: (overduePayments || []).length,
      };
    },
    enabled: !!companyId,
  });
};