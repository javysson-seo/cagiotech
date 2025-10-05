import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfDay, endOfDay, startOfWeek, startOfMonth, subMonths, format } from 'date-fns';

export const useDashboardMetrics = (companyId: string, dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['dashboard-metrics', companyId, dateRange],
    queryFn: async () => {
      const now = new Date();
      const startDate = dateRange?.from || startOfMonth(now);
      const endDate = dateRange?.to || endOfDay(now);
      const previousPeriodStart = subMonths(startDate, 1);
      const previousPeriodEnd = subMonths(endDate, 1);

      // Get athletes data
      const { data: athletes } = await supabase
        .from('athletes')
        .select('*, athlete_subscriptions(*)')
        .eq('company_id', companyId);

      const activeAthletes = athletes?.filter(a => a.status === 'active').length || 0;
      const totalAthletes = athletes?.length || 0;
      
      // Get current period financial data
      const { data: currentTransactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('company_id', companyId)
        .gte('transaction_date', format(startDate, 'yyyy-MM-dd'))
        .lte('transaction_date', format(endDate, 'yyyy-MM-dd'));

      // Get previous period financial data
      const { data: previousTransactions } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('company_id', companyId)
        .gte('transaction_date', format(previousPeriodStart, 'yyyy-MM-dd'))
        .lte('transaction_date', format(previousPeriodEnd, 'yyyy-MM-dd'));

      const currentRevenue = (currentTransactions || [])
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const currentExpenses = (currentTransactions || [])
        .filter(t => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const previousRevenue = (previousTransactions || [])
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const previousExpenses = (previousTransactions || [])
        .filter(t => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Get classes data
      const { data: classes } = await supabase
        .from('classes')
        .select('*, class_bookings(*)')
        .eq('company_id', companyId)
        .gte('date', format(startDate, 'yyyy-MM-dd'))
        .lte('date', format(endDate, 'yyyy-MM-dd'));

      const totalClasses = classes?.length || 0;
      const totalCapacity = classes?.reduce((sum, c) => sum + c.max_capacity, 0) || 1;
      const totalBookings = classes?.reduce((sum, c) => sum + (c.class_bookings?.length || 0), 0) || 0;
      const occupationRate = (totalBookings / totalCapacity) * 100;

      // Get overdue payments
      const { data: overduePayments } = await supabase
        .from('athlete_payments')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'pending')
        .lt('due_date', format(now, 'yyyy-MM-dd'));

      const totalOverdue = (overduePayments || []).reduce((sum, p) => sum + Number(p.amount), 0);

      // Calculate growth rates
      const revenueGrowth = previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;

      const profitGrowth = previousRevenue - previousExpenses > 0 
        ? (((currentRevenue - currentExpenses) - (previousRevenue - previousExpenses)) / (previousRevenue - previousExpenses)) * 100 
        : 0;

      return {
        revenue: currentRevenue,
        revenueGrowth,
        expenses: currentExpenses,
        profit: currentRevenue - currentExpenses,
        profitGrowth,
        activeAthletes,
        totalAthletes,
        totalClasses,
        occupationRate,
        overduePayments: overduePayments?.length || 0,
        overdueAmount: totalOverdue,
      };
    },
    enabled: !!companyId,
  });
};
