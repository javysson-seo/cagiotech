import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MultibancoPayment {
  entity: string;
  reference: string;
  amount: number;
  expires_at: string;
  transaction_id: string;
}

export interface MBWayPayment {
  request_id: string;
  status: string;
  message: string;
  expires_at: string;
  transaction_id: string;
}

export const usePaymentGateway = (companyId: string) => {
  const [loading, setLoading] = useState(false);

  const generateMultibancoReference = async (
    paymentId: string,
    amount: number
  ): Promise<MultibancoPayment | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ifthenpay-multibanco', {
        body: {
          company_id: companyId,
          payment_id: paymentId,
          amount: amount,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Erro ao gerar referência Multibanco');
      }

      return {
        entity: data.entity,
        reference: data.reference,
        amount: data.amount,
        expires_at: data.expires_at,
        transaction_id: data.transaction_id,
      };
    } catch (error) {
      console.error('Erro ao gerar referência Multibanco:', error);
      toast.error('Erro ao gerar referência Multibanco');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const processMBWayPayment = async (
    paymentId: string,
    amount: number,
    phoneNumber: string
  ): Promise<MBWayPayment | null> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ifthenpay-mbway', {
        body: {
          company_id: companyId,
          payment_id: paymentId,
          amount: amount,
          phone_number: phoneNumber,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Erro ao processar pagamento MBWay');
      }

      return {
        request_id: data.request_id,
        status: data.status,
        message: data.message,
        expires_at: data.expires_at,
        transaction_id: data.transaction_id,
      };
    } catch (error) {
      console.error('Erro ao processar pagamento MBWay:', error);
      toast.error('Erro ao processar pagamento MBWay');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (transactionId: string) => {
    try {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erro ao verificar status da transação:', error);
      return null;
    }
  };

  return {
    loading,
    generateMultibancoReference,
    processMBWayPayment,
    checkTransactionStatus,
  };
};
