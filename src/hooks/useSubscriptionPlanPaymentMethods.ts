import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SubscriptionPlanPaymentMethod {
  id: string;
  plan_id: string;
  payment_method: 'mbway' | 'multibanco' | 'cash' | 'bank_transfer';
  requires_approval: boolean;
  auto_renewal: boolean;
  is_enabled: boolean;
  configuration: any;
  created_at: string;
  updated_at: string;
}

export const useSubscriptionPlanPaymentMethods = (planId?: string) => {
  const queryClient = useQueryClient();

  const { data: paymentMethods = [], isLoading } = useQuery({
    queryKey: ['subscription-plan-payment-methods', planId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plan_payment_methods' as any)
        .select('*')
        .eq('plan_id', planId!)
        .eq('is_enabled', true);

      if (error) throw error;
      return data as unknown as SubscriptionPlanPaymentMethod[];
    },
    enabled: !!planId,
  });

  const upsertPaymentMethod = useMutation({
    mutationFn: async (method: Omit<SubscriptionPlanPaymentMethod, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('subscription_plan_payment_methods' as any)
        .upsert([method], { onConflict: 'plan_id,payment_method' })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plan-payment-methods'] });
      toast.success('Método de pagamento configurado!');
    },
    onError: (error) => {
      toast.error('Erro ao configurar método de pagamento');
      console.error(error);
    },
  });

  const deletePaymentMethod = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('subscription_plan_payment_methods' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plan-payment-methods'] });
      toast.success('Método de pagamento removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover método de pagamento');
      console.error(error);
    },
  });

  return {
    paymentMethods,
    isLoading,
    upsertPaymentMethod,
    deletePaymentMethod,
  };
};
