import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Exercise {
  id: string;
  name: string;
  category: 'bodybuilding' | 'crossfit' | 'other';
  muscle_group: string;
  is_default: boolean;
  company_id?: string;
  description?: string;
  video_url?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export const useExerciseLibrary = (companyId?: string) => {
  const queryClient = useQueryClient();

  // Fetch all exercises (default + company custom)
  const { data: exercises = [], isLoading } = useQuery({
    queryKey: ['exercise-library', companyId],
    queryFn: async () => {
      // Get default exercises
      const { data: defaultExercises, error: defaultError } = await supabase
        .from('exercise_library')
        .select('*')
        .eq('is_default', true)
        .order('name');

      if (defaultError) throw defaultError;

      // Get company custom exercises if companyId is provided
      let customExercises = [];
      if (companyId) {
        const { data, error } = await supabase
          .from('exercise_library')
          .select('*')
          .eq('company_id', companyId)
          .eq('is_default', false)
          .order('name');

        if (error) throw error;
        customExercises = data || [];
      }

      return [...defaultExercises, ...customExercises] as Exercise[];
    },
    enabled: true,
  });

  // Create custom exercise
  const createExercise = useMutation({
    mutationFn: async (exercise: Omit<Exercise, 'id' | 'created_at' | 'updated_at' | 'is_default'>) => {
      const { data, error } = await supabase
        .from('exercise_library')
        .insert([{ ...exercise, is_default: false }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-library', companyId] });
      toast.success('Exercício adicionado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar exercício');
      console.error(error);
    },
  });

  // Update custom exercise
  const updateExercise = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Exercise> & { id: string }) => {
      const { data, error } = await supabase
        .from('exercise_library')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-library', companyId] });
      toast.success('Exercício atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar exercício');
      console.error(error);
    },
  });

  // Delete custom exercise
  const deleteExercise = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('exercise_library')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-library', companyId] });
      toast.success('Exercício removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover exercício');
      console.error(error);
    },
  });

  return {
    exercises,
    isLoading,
    createExercise,
    updateExercise,
    deleteExercise,
  };
};