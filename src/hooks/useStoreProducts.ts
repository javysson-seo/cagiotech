import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface StoreProduct {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  low_stock_threshold?: number;
  category?: string;
  image_url?: string;
  sku?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useStoreProducts = (companyId: string) => {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['store-products', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_products')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as StoreProduct[];
    },
    enabled: !!companyId,
  });

  const createProduct = useMutation({
    mutationFn: async (product: Omit<Partial<StoreProduct>, 'id' | 'created_at' | 'updated_at'> & { company_id: string; name: string; price: number }) => {
      const { data, error } = await supabase
        .from('store_products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-products', companyId] });
      toast.success('Produto criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar produto');
      console.error(error);
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<StoreProduct> & { id: string }) => {
      const { data, error } = await supabase
        .from('store_products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-products', companyId] });
      toast.success('Produto atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar produto');
      console.error(error);
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('store_products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-products', companyId] });
      toast.success('Produto removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover produto');
      console.error(error);
    },
  });

  return {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};