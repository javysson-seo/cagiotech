import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CreateCagioSubscriptionPaymentData {
  company_id: string;
  plan_id: string;
  billing_period: 'monthly' | 'yearly';
  amount: number;
  payment_method: 'multibanco' | 'mbway';
  phone_number?: string;
}

export const useCagioSubscriptionPayments = () => {
  const queryClient = useQueryClient();

  const createPayment = useMutation({
    mutationFn: async (data: CreateCagioSubscriptionPaymentData) => {
      const { data: payment, error: paymentError } = await supabase
        .from('cagio_subscription_payments')
        .insert({
          company_id: data.company_id,
          plan_id: data.plan_id,
          billing_period: data.billing_period,
          amount: data.amount,
          status: 'pending',
          due_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Generate payment reference
      if (data.payment_method === 'multibanco') {
        const { data: multibancoData, error: multibancoError } = await supabase.functions.invoke(
          'ifthenpay-multibanco',
          {
            body: {
              company_id: data.company_id,
              payment_id: payment.id,
              amount: data.amount,
            },
          }
        );

        if (multibancoError) throw multibancoError;
        if (!multibancoData.success) throw new Error(multibancoData.error);

        return {
          payment_id: payment.id,
          method: 'multibanco' as const,
          reference: {
            entity: multibancoData.entity,
            reference: multibancoData.reference,
            amount: multibancoData.amount,
            expires_at: multibancoData.expires_at,
          },
        };
      } else {
        const { data: mbwayData, error: mbwayError } = await supabase.functions.invoke(
          'ifthenpay-mbway',
          {
            body: {
              company_id: data.company_id,
              payment_id: payment.id,
              amount: data.amount,
              phone_number: data.phone_number,
            },
          }
        );

        if (mbwayError) throw mbwayError;
        if (!mbwayData.success) throw new Error(mbwayData.error);

        return {
          payment_id: payment.id,
          method: 'mbway' as const,
          reference: {
            request_id: mbwayData.request_id,
            status: mbwayData.status,
            message: mbwayData.message,
            expires_at: mbwayData.expires_at,
          },
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-subscription'] });
      toast.success('Referência de pagamento gerada com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao gerar pagamento', {
        description: error.message,
      });
    },
  });

  return {
    createPayment: createPayment.mutate,
    isCreating: createPayment.isPending,
  };
};
