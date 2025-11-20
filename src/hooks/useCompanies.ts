import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Company {
  id: string;
  name: string;
  email: string | null;
  logo_url: string | null;
  created_at: string | null;
  is_approved: boolean | null;
  rejection_reason: string | null;
  subscription_status: string | null;
  business_type: string | null;
  city: string | null;
  capacity: number | null;
  athletes?: { count: number }[];
  trainers?: { count: number }[];
}

export const useCompanies = () => {
  const queryClient = useQueryClient();

  const { data: companies, isLoading, refetch } = useQuery<Company[]>({
    queryKey: ['admin-companies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          *,
          athletes:athletes(count),
          trainers:trainers(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Company[];
    },
  });

  const approveCompany = useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from('companies')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
          subscription_status: 'active',
        })
        .eq('id', companyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      toast.success('Empresa aprovada com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao aprovar empresa', { description: error.message });
    },
  });

  const rejectCompany = useMutation({
    mutationFn: async ({ companyId, reason }: { companyId: string; reason: string }) => {
      const { error } = await supabase
        .from('companies')
        .update({
          is_approved: false,
          rejection_reason: reason,
          subscription_status: 'inactive',
        })
        .eq('id', companyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      toast.success('Empresa rejeitada');
    },
    onError: (error: Error) => {
      toast.error('Erro ao rejeitar empresa', { description: error.message });
    },
  });

  const deleteCompany = useMutation({
    mutationFn: async (companyId: string) => {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', companyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-companies'] });
      toast.success('Empresa removida com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao remover empresa', { description: error.message });
    },
  });

  return {
    companies,
    isLoading,
    refetch,
    approveCompany: approveCompany.mutate,
    rejectCompany: rejectCompany.mutate,
    deleteCompany: deleteCompany.mutate,
  };
};