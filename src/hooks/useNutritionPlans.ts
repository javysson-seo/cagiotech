import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface NutritionPlan {
  id: string;
  company_id: string;
  trainer_id: string;
  athlete_id: string;
  title: string;
  description?: string;
  plan_details: any;
  created_at: string;
  updated_at: string;
}

export const useNutritionPlans = (companyId: string) => {
  const queryClient = useQueryClient();

  const { data: nutritionPlans = [], isLoading } = useQuery({
    queryKey: ['nutrition-plans', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nutritional_plans')
        .select(`
          *,
          trainer:trainers(name),
          athlete:athletes(name, email)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as NutritionPlan[];
    },
    enabled: !!companyId,
  });

  const createNutritionPlan = useMutation({
    mutationFn: async (plan: Omit<NutritionPlan, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('nutritional_plans')
        .insert([plan])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans', companyId] });
      toast.success('Plano nutricional criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar plano nutricional');
      console.error(error);
    },
  });

  const updateNutritionPlan = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NutritionPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('nutritional_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans', companyId] });
      toast.success('Plano nutricional atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar plano');
      console.error(error);
    },
  });

  const deleteNutritionPlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('nutritional_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nutrition-plans', companyId] });
      toast.success('Plano nutricional removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover plano');
      console.error(error);
    },
  });

  return {
    nutritionPlans,
    isLoading,
    createNutritionPlan,
    updateNutritionPlan,
    deleteNutritionPlan,
  };
};
