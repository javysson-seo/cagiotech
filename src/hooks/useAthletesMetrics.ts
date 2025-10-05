import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, subMonths, isBefore } from 'date-fns';

export const useAthletesMetrics = (companyId: string, dateRange?: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ['athletes-metrics', companyId, dateRange],
    queryFn: async () => {
      const now = new Date();
      const startDate = dateRange?.from || startOfMonth(now);
      const endDate = dateRange?.to || endOfMonth(now);
      const previousPeriodStart = subMonths(startDate, 1);

      // Get all athletes
      const { data: athletes } = await supabase
        .from('athletes')
        .select('*, athlete_subscriptions(*, subscription_plans(name))')
        .eq('company_id', companyId);

      const activeAthletes = athletes?.filter(a => a.status === 'active') || [];
      const inactiveAthletes = athletes?.filter(a => a.status === 'inactive') || [];
      const newAthletes = athletes?.filter(a => 
        new Date(a.created_at) >= startDate && new Date(a.created_at) <= endDate
      ) || [];

      // Get previous period active count
      const { data: previousAthletes } = await supabase
        .from('athletes')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'active')
        .lt('created_at', format(previousPeriodStart, 'yyyy-MM-dd'));

      const previousActiveCount = previousAthletes?.length || 0;
      const currentActiveCount = activeAthletes.length;
      const churnCount = Math.max(0, previousActiveCount - currentActiveCount + newAthletes.length);
      const churnRate = previousActiveCount > 0 ? (churnCount / previousActiveCount) * 100 : 0;

      // Group by subscription plan
      const byPlan = activeAthletes.reduce((acc: Record<string, number>, athlete: any) => {
        const activeSub = athlete.athlete_subscriptions?.find((s: any) => s.status === 'active');
        const planName = activeSub?.subscription_plans?.name || 'Sem plano';
        acc[planName] = (acc[planName] || 0) + 1;
        return acc;
      }, {});

      // Get today's check-ins
      const { data: todayCheckIns } = await supabase
        .from('athlete_check_ins')
        .select('*')
        .eq('company_id', companyId)
        .gte('check_in_time', format(now, 'yyyy-MM-dd'));

      // Get birthdays this month
      const birthdaysThisMonth = athletes?.filter(a => {
        if (!a.birth_date) return false;
        const birthDate = new Date(a.birth_date);
        return birthDate.getMonth() === now.getMonth();
      }) || [];

      return {
        total: athletes?.length || 0,
        active: activeAthletes.length,
        inactive: inactiveAthletes.length,
        new: newAthletes.length,
        churnRate,
        byPlan: Object.entries(byPlan).map(([name, value]) => ({ name, value: value as number })),
        todayCheckIns: todayCheckIns?.length || 0,
        birthdaysThisMonth: birthdaysThisMonth.length,
      };
    },
    enabled: !!companyId,
  });
};
