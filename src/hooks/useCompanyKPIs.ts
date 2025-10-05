import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { startOfMonth, endOfMonth, subMonths, format, differenceInDays } from 'date-fns';

export const useCompanyKPIs = (companyId: string, dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['company-kpis', companyId, dateRange],
    queryFn: async () => {
      const now = new Date();
      const startDate = dateRange?.from || startOfMonth(now);
      const endDate = dateRange?.to || endOfMonth(now);
      const previousPeriodStart = subMonths(startDate, 1);
      const previousPeriodEnd = subMonths(endDate, 1);

      // Get all data in parallel
      const [
        athletesData,
        currentTransactions,
        previousTransactions,
        currentPayments,
        previousPayments,
        classesData,
        checkInsData,
        previousCheckIns,
      ] = await Promise.all([
        supabase
          .from('athletes')
          .select('*, athlete_subscriptions(*, subscription_plans(price))')
          .eq('company_id', companyId),
        supabase
          .from('financial_transactions')
          .select('*')
          .eq('company_id', companyId)
          .gte('transaction_date', format(startDate, 'yyyy-MM-dd'))
          .lte('transaction_date', format(endDate, 'yyyy-MM-dd')),
        supabase
          .from('financial_transactions')
          .select('*')
          .eq('company_id', companyId)
          .gte('transaction_date', format(previousPeriodStart, 'yyyy-MM-dd'))
          .lte('transaction_date', format(previousPeriodEnd, 'yyyy-MM-dd')),
        supabase
          .from('athlete_payments')
          .select('*')
          .eq('company_id', companyId)
          .eq('status', 'paid')
          .gte('paid_date', format(startDate, 'yyyy-MM-dd'))
          .lte('paid_date', format(endDate, 'yyyy-MM-dd')),
        supabase
          .from('athlete_payments')
          .select('*')
          .eq('company_id', companyId)
          .eq('status', 'paid')
          .gte('paid_date', format(previousPeriodStart, 'yyyy-MM-dd'))
          .lte('paid_date', format(previousPeriodEnd, 'yyyy-MM-dd')),
        supabase
          .from('classes')
          .select('*, class_bookings(*)')
          .eq('company_id', companyId)
          .gte('date', format(startDate, 'yyyy-MM-dd'))
          .lte('date', format(endDate, 'yyyy-MM-dd')),
        supabase
          .from('athlete_check_ins')
          .select('*')
          .eq('company_id', companyId)
          .gte('check_in_time', format(startDate, 'yyyy-MM-dd'))
          .lte('check_in_time', format(endDate, 'yyyy-MM-dd')),
        supabase
          .from('athlete_check_ins')
          .select('*')
          .eq('company_id', companyId)
          .gte('check_in_time', format(previousPeriodStart, 'yyyy-MM-dd'))
          .lte('check_in_time', format(previousPeriodEnd, 'yyyy-MM-dd')),
      ]);

      const athletes = athletesData.data || [];
      const activeAthletes = athletes.filter(a => a.status === 'active');
      const newAthletes = athletes.filter(a => 
        new Date(a.created_at) >= startDate && new Date(a.created_at) <= endDate
      );

      // Financial Metrics
      const currentRevenue = (currentTransactions.data || [])
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const currentExpenses = (currentTransactions.data || [])
        .filter(t => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const previousRevenue = (previousTransactions.data || [])
        .filter(t => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const previousExpenses = (previousTransactions.data || [])
        .filter(t => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const currentProfit = currentRevenue - currentExpenses;
      const previousProfit = previousRevenue - previousExpenses;

      // MRR (Monthly Recurring Revenue)
      const mrr = activeAthletes.reduce((sum, athlete) => {
        const activeSub = athlete.athlete_subscriptions?.find((s: any) => s.status === 'active');
        if (activeSub?.subscription_plans?.price) {
          return sum + Number(activeSub.subscription_plans.price);
        }
        return sum;
      }, 0);

      // Average Ticket
      const totalPaidPayments = currentPayments.data?.length || 0;
      const averageTicket = totalPaidPayments > 0 
        ? currentRevenue / totalPaidPayments 
        : 0;

      // Churn Rate
      const previousActiveCount = athletes.filter(a => {
        const createdDate = new Date(a.created_at);
        return createdDate < previousPeriodStart && a.status === 'active';
      }).length;
      
      const canceledThisPeriod = athletes.filter(a => 
        a.status === 'inactive' && 
        a.updated_at && 
        new Date(a.updated_at) >= startDate && 
        new Date(a.updated_at) <= endDate
      ).length;

      const churnRate = previousActiveCount > 0 
        ? (canceledThisPeriod / previousActiveCount) * 100 
        : 0;

      // Retention Rate
      const retentionRate = 100 - churnRate;

      // Classes Metrics
      const classes = classesData.data || [];
      const totalClasses = classes.length;
      const totalCapacity = classes.reduce((sum, c) => sum + c.max_capacity, 0);
      const totalBookings = classes.reduce((sum, c) => sum + (c.class_bookings?.length || 0), 0);
      const occupationRate = totalCapacity > 0 ? (totalBookings / totalCapacity) * 100 : 0;

      // Check-ins
      const currentCheckIns = checkInsData.data?.length || 0;
      const previousCheckInsCount = previousCheckIns.data?.length || 0;
      const checkInGrowth = previousCheckInsCount > 0 
        ? ((currentCheckIns - previousCheckInsCount) / previousCheckInsCount) * 100 
        : 0;

      // Attendance Rate (check-ins / bookings)
      const attendanceRate = totalBookings > 0 ? (currentCheckIns / totalBookings) * 100 : 0;

      // Growth Rates
      const revenueGrowth = previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;

      const profitGrowth = previousProfit !== 0 
        ? ((currentProfit - previousProfit) / Math.abs(previousProfit)) * 100 
        : 0;

      const memberGrowth = previousActiveCount > 0 
        ? ((activeAthletes.length - previousActiveCount) / previousActiveCount) * 100 
        : 0;

      // Profit Margin
      const profitMargin = currentRevenue > 0 ? (currentProfit / currentRevenue) * 100 : 0;

      // LTV (simplified - average monthly payment * average months)
      const avgLifetimeMonths = 12; // Assumindo 12 meses médio
      const ltv = averageTicket * avgLifetimeMonths;

      // CAC (simplified - marketing expenses / new members)
      const marketingExpenses = (currentTransactions.data || [])
        .filter(t => t.type === 'expense' && t.category === 'marketing')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      const cac = newAthletes.length > 0 ? marketingExpenses / newAthletes.length : 0;

      return {
        // Financial
        revenue: currentRevenue,
        revenueGrowth,
        expenses: currentExpenses,
        profit: currentProfit,
        profitGrowth,
        profitMargin,
        mrr,
        arr: mrr * 12,
        averageTicket,
        ltv,
        cac,
        ltvCacRatio: cac > 0 ? ltv / cac : 0,

        // Members
        totalMembers: athletes.length,
        activeMembers: activeAthletes.length,
        newMembers: newAthletes.length,
        memberGrowth,
        churnRate,
        retentionRate,
        canceledMembers: canceledThisPeriod,

        // Classes
        totalClasses,
        occupationRate,
        totalBookings,
        attendanceRate,

        // Engagement
        checkIns: currentCheckIns,
        checkInGrowth,
        avgCheckInsPerMember: activeAthletes.length > 0 ? currentCheckIns / activeAthletes.length : 0,

        // Period
        periodDays: differenceInDays(endDate, startDate) + 1,
      };
    },
    enabled: !!companyId,
  });
};
