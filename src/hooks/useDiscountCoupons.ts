import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface DiscountCoupon {
  id: string;
  company_id: string;
  code: string;
  discount_percentage: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useDiscountCoupons = (companyId?: string) => {
  const queryClient = useQueryClient();

  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ['discount-coupons', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('discount_coupons')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as DiscountCoupon[];
    },
    enabled: !!companyId,
  });

  const createCoupon = useMutation({
    mutationFn: async (coupon: Omit<DiscountCoupon, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('discount_coupons')
        .insert(coupon)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-coupons', companyId] });
      toast.success('Cupom criado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao criar cupom: ${error.message}`);
    },
  });

  const updateCoupon = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<DiscountCoupon> & { id: string }) => {
      const { data, error } = await supabase
        .from('discount_coupons')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-coupons', companyId] });
      toast.success('Cupom atualizado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar cupom: ${error.message}`);
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('discount_coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discount-coupons', companyId] });
      toast.success('Cupom excluído com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir cupom: ${error.message}`);
    },
  });

  const validateCoupon = async (code: string): Promise<DiscountCoupon | null> => {
    if (!companyId) return null;

    const { data, error } = await supabase
      .from('discount_coupons')
      .select('*')
      .eq('company_id', companyId)
      .eq('code', code.toUpperCase())
      .eq('is_active', true)
      .single();

    if (error || !data) return null;

    // Verificar se o cupom está expirado
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return null;
    }

    return data as DiscountCoupon;
  };

  return {
    coupons,
    isLoading,
    createCoupon: createCoupon.mutate,
    updateCoupon: updateCoupon.mutate,
    deleteCoupon: deleteCoupon.mutate,
    validateCoupon,
  };
};