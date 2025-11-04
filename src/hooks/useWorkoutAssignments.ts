import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface WorkoutAssignment {
  id: string;
  company_id: string;
  athlete_id: string;
  workout_plan_id: string;
  assigned_by?: string;
  assigned_at: string;
  start_date: string;
  end_date?: string;
  status: 'active' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export const useWorkoutAssignments = (companyId: string, athleteId?: string) => {
  const queryClient = useQueryClient();

  const { data: assignments = [], isLoading } = useQuery({
    queryKey: ['workout-assignments', companyId, athleteId],
    queryFn: async () => {
      let query = supabase
        .from('athlete_workout_assignments' as any)
        .select(`
          *,
          athlete:athletes(name, email),
          workout_plan:workout_plans(name, description, difficulty),
          assigned_by_trainer:trainers!athlete_workout_assignments_assigned_by_fkey(name)
        `)
        .eq('company_id', companyId);

      if (athleteId) {
        query = query.eq('athlete_id', athleteId);
      }

      const { data, error } = await query.order('assigned_at', { ascending: false });

      if (error) throw error;
      return data as unknown as WorkoutAssignment[];
    },
    enabled: !!companyId,
  });

  const assignWorkoutPlan = useMutation({
    mutationFn: async (assignment: Omit<WorkoutAssignment, 'id' | 'created_at' | 'assigned_at'>) => {
      const { data, error } = await supabase
        .from('athlete_workout_assignments' as any)
        .insert([assignment])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-assignments', companyId] });
      toast.success('Plano de treino atribuído com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atribuir plano de treino');
      console.error(error);
    },
  });

  const updateAssignment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WorkoutAssignment> & { id: string }) => {
      const { data, error } = await supabase
        .from('athlete_workout_assignments' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workout-assignments', companyId] });
      toast.success('Atribuição atualizada!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar atribuição');
      console.error(error);
    },
  });

  return {
    assignments,
    isLoading,
    assignWorkoutPlan,
    updateAssignment,
  };
};
