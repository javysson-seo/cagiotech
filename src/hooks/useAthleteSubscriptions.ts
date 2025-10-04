import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SubscriptionStatus = 'pending' | 'active' | 'cancelled' | 'expired' | 'suspended';

export interface AthleteSubscription {
  id: string;
  athlete_id: string;
  company_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string | null;
  next_billing_date: string | null;
  payment_method: string | null;
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  cancellation_reason: string | null;
}

export const useAthleteSubscriptions = (companyId?: string, athleteId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ['athlete-subscriptions', companyId, athleteId],
    queryFn: async () => {
      let query = supabase
        .from('athlete_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            price,
            billing_period
          ),
          athletes (
            name,
            email
          )
        `);

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      if (athleteId) {
        query = query.eq('athlete_id', athleteId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!(companyId || athleteId),
  });

  const createSubscriptionMutation = useMutation({
    mutationFn: async (subscription: {
      athlete_id: string;
      company_id: string;
      plan_id: string;
      payment_method?: string;
    }) => {
      const { data, error } = await supabase
        .from('athlete_subscriptions')
        .insert({
          ...subscription,
          status: 'pending',
          start_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-subscriptions'] });
      toast({
        title: 'Assinatura criada',
        description: 'A assinatura foi criada com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar assinatura',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AthleteSubscription> & { id: string }) => {
      const { data, error } = await supabase
        .from('athlete_subscriptions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-subscriptions'] });
      toast({
        title: 'Assinatura atualizada',
        description: 'A assinatura foi atualizada com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar assinatura',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const { data, error } = await supabase
        .from('athlete_subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: reason,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-subscriptions'] });
      toast({
        title: 'Assinatura cancelada',
        description: 'A assinatura foi cancelada com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao cancelar assinatura',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    subscriptions: subscriptions || [],
    isLoading,
    createSubscription: createSubscriptionMutation.mutate,
    updateSubscription: updateSubscriptionMutation.mutate,
    cancelSubscription: cancelSubscriptionMutation.mutate,
  };
};
