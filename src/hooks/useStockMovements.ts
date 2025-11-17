import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StockMovement {
  id: string;
  company_id: string;
  product_id: string;
  movement_type: 'entrada' | 'saida' | 'ajuste' | 'venda' | 'devolucao';
  quantity: number;
  previous_stock: number;
  new_stock: number;
  reason?: string;
  reference_id?: string;
  performed_by?: string;
  performed_by_name?: string;
  created_at: string;
}

export const useStockMovements = (productId?: string) => {
  const queryClient = useQueryClient();

  const { data: movements = [], isLoading } = useQuery({
    queryKey: ['stock-movements', productId],
    queryFn: async () => {
      let query = supabase
        .from('stock_movements')
        .select('*')
        .order('created_at', { ascending: false });

      if (productId) {
        query = query.eq('product_id', productId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as StockMovement[];
    },
    enabled: !!productId,
  });

  const createMovement = useMutation({
    mutationFn: async (movement: Omit<StockMovement, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('stock_movements')
        .insert([movement])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      queryClient.invalidateQueries({ queryKey: ['store-products'] });
      toast.success('Movimentação registrada!');
    },
    onError: (error) => {
      toast.error('Erro ao registrar movimentação');
      console.error(error);
    },
  });

  return {
    movements,
    isLoading,
    createMovement,
  };
};
