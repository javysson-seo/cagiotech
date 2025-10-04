import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SubscriptionPlan {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billing_period: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  is_active: boolean;
  max_classes_per_week: number | null;
  created_at: string;
  updated_at: string;
}

export const useSubscriptionPlans = (companyId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['subscription-plans', companyId],
    queryFn: async () => {
      if (!companyId) return [];
      
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as SubscriptionPlan[];
    },
    enabled: !!companyId,
  });

  const createPlanMutation = useMutation({
    mutationFn: async (plan: Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .insert(plan)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans', companyId] });
      toast({
        title: 'Plano criado',
        description: 'O plano de assinatura foi criado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao criar plano',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<SubscriptionPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans', companyId] });
      toast({
        title: 'Plano atualizado',
        description: 'O plano foi atualizado com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar plano',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from('subscription_plans')
        .delete()
        .eq('id', planId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans', companyId] });
      toast({
        title: 'Plano removido',
        description: 'O plano foi removido com sucesso.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao remover plano',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    plans: plans || [],
    isLoading,
    error,
    createPlan: createPlanMutation.mutate,
    updatePlan: updatePlanMutation.mutate,
    deletePlan: deletePlanMutation.mutate,
  };
};
