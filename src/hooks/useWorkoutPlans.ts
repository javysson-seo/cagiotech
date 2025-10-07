import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WorkoutPlan {
  id: string;
  company_id: string;
  trainer_id: string;
  athlete_id?: string;
  name: string;
  description?: string;
  exercises: any[];
  duration_weeks?: number;
  frequency_per_week?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useWorkoutPlans = (companyId: string) => {
  const queryClient = useQueryClient();

  const { data: workoutPlans = [], isLoading } = useQuery({
    queryKey: ['workout-plans', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workout_plans')
        .select(`
          *,
          trainer:trainers(name),
          athlete:athletes(name)
        `)
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as WorkoutPlan[];
    },
    enabled: !!companyId,
  });

  const createWorkoutPlan = useMutation({
    mutationFn: async (plan: Omit<Partial<WorkoutPlan>, 'id' | 'created_at' | 'updated_at'> & { company_id: string; trainer_id: string; name: string }) => {
      const { data, error } = await supabase
        .from('workout_plans')
        .insert([plan])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans', companyId] });
      toast.success('Plano de treino criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar plano de treino');
      console.error(error);
    },
  });

  const updateWorkoutPlan = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WorkoutPlan> & { id: string }) => {
      const { data, error } = await supabase
        .from('workout_plans')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans', companyId] });
      toast.success('Plano de treino atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar plano');
      console.error(error);
    },
  });

  const deleteWorkoutPlan = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-plans', companyId] });
      toast.success('Plano de treino removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover plano');
      console.error(error);
    },
  });

  return {
    workoutPlans,
    isLoading,
    createWorkoutPlan,
    updateWorkoutPlan,
    deleteWorkoutPlan,
  };
};