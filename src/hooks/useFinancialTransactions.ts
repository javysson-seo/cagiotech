import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface FinancialTransaction {
  id: string;
  company_id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  transaction_date: string;
  description: string;
  payment_method?: string;
  status: string;
  notes?: string;
  reference_type?: string;
  reference_id?: string;
  created_at: string;
}

export const useFinancialTransactions = (companyId: string, limit?: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['financial-transactions', companyId, limit],
    queryFn: async () => {
      let query = supabase
        .from('financial_transactions')
        .select('*')
        .eq('company_id', companyId)
        .order('transaction_date', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as FinancialTransaction[];
    },
    enabled: !!companyId,
  });

  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at' | 'company_id'>) => {
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          ...transaction,
          company_id: companyId,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-metrics'] });
      toast({
        title: 'Transação criada',
        description: 'A transação foi registrada com sucesso',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar transação',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    transactions,
    isLoading,
    createTransaction: createTransaction.mutate,
  };
};