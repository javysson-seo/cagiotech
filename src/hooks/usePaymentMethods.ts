import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type PaymentMethodType = 'credit_card' | 'mb_way' | 'multibanco' | 'bank_transfer' | 'paypal';

export interface PaymentMethod {
  id: string;
  company_id: string;
  method_type: PaymentMethodType;
  is_enabled: boolean;
  configuration: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const usePaymentMethods = (companyId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: methods, isLoading } = useQuery({
    queryKey: ['payment-methods', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('company_payment_methods')
        .select('*')
        .eq('company_id', companyId)
        .order('method_type');

      if (error) throw error;
      return data as PaymentMethod[];
    },
    enabled: !!companyId,
  });

  const toggleMethodMutation = useMutation({
    mutationFn: async ({ methodType, enabled }: { methodType: PaymentMethodType; enabled: boolean }) => {
      if (!companyId) throw new Error('Company ID is required');

      // Tentar atualizar primeiro
      const { data: existing } = await supabase
        .from('company_payment_methods')
        .select('id')
        .eq('company_id', companyId)
        .eq('method_type', methodType)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('company_payment_methods')
          .update({ is_enabled: enabled })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('company_payment_methods')
          .insert({
            company_id: companyId,
            method_type: methodType,
            is_enabled: enabled,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-methods', companyId] });
      toast({
        title: 'Método atualizado',
        description: 'O método de pagamento foi atualizado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar método',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    methods: methods || [],
    isLoading,
    toggleMethod: toggleMethodMutation.mutate,
  };
};
