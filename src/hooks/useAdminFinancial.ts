import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAdminFinancial = () => {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin-financial-metrics'],
    queryFn: async () => {
      // Get total companies
      const { count: totalCompanies } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true });

      // Get active subscriptions
      const { count: activeSubscriptions } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_status', 'active');

      // Get new companies this month
      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      firstDayOfMonth.setHours(0, 0, 0, 0);

      const { count: newCompanies } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', firstDayOfMonth.toISOString());

      // Get pending approvals
      const { count: pendingApprovals } = await supabase
        .from('companies')
        .select('*', { count: 'exact', head: true })
        .eq('is_approved', false);

      // Calculate MRR (Monthly Recurring Revenue)
      const { data: subscriptionPlans } = await supabase
        .from('cagio_subscription_plans')
        .select('price_monthly');

      const { data: activeCompanies } = await supabase
        .from('companies')
        .select('subscription_plan')
        .eq('subscription_status', 'active');

      let totalMRR = 0;
      if (activeCompanies && subscriptionPlans) {
        activeCompanies.forEach((company) => {
          const plan = subscriptionPlans.find(
            (p) => p.price_monthly && company.subscription_plan
          );
          if (plan) totalMRR += plan.price_monthly;
        });
      }

      return {
        totalCompanies: totalCompanies || 0,
        activeSubscriptions: activeSubscriptions || 0,
        newCompanies: newCompanies || 0,
        pendingApprovals: pendingApprovals || 0,
        mrr: totalMRR,
        arr: totalMRR * 12,
      };
    },
  });

  return {
    metrics,
    isLoading,
  };
};