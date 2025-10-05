import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Equipment {
  id: string;
  company_id: string;
  name: string;
  description?: string;
  category?: string;
  quantity: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  location?: string;
  serial_number?: string;
  purchase_date?: string;
  purchase_price?: number;
  supplier?: string;
  maintenance_date?: string;
  next_maintenance?: string;
  warranty_expiry?: string;
  status: 'active' | 'maintenance' | 'retired';
  created_at: string;
  updated_at: string;
}

export const useEquipment = (companyId: string) => {
  const queryClient = useQueryClient();

  const { data: equipment = [], isLoading } = useQuery({
    queryKey: ['equipment', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Equipment[];
    },
    enabled: !!companyId,
  });

  const createEquipment = useMutation({
    mutationFn: async (newEquipment: Partial<Equipment> & { name: string }) => {
      const { data, error } = await supabase
        .from('equipment')
        .insert([{ ...newEquipment, company_id: companyId }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', companyId] });
      toast.success('Equipamento adicionado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao adicionar equipamento');
    },
  });

  const updateEquipment = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Equipment> & { id: string }) => {
      const { data, error } = await supabase
        .from('equipment')
        .update(updates)
        .eq('id', id)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', companyId] });
      toast.success('Equipamento atualizado com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao atualizar equipamento');
    },
  });

  const deleteEquipment = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('equipment')
        .delete()
        .eq('id', id)
        .eq('company_id', companyId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', companyId] });
      toast.success('Equipamento removido com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao remover equipamento');
    },
  });

  // Equipamentos padrão de CrossFit/Fitness
  const defaultEquipment = [
    { name: 'Kettlebell 8kg', category: 'Pesos Livres', quantity: 4 },
    { name: 'Kettlebell 12kg', category: 'Pesos Livres', quantity: 4 },
    { name: 'Kettlebell 16kg', category: 'Pesos Livres', quantity: 4 },
    { name: 'Kettlebell 20kg', category: 'Pesos Livres', quantity: 4 },
    { name: 'Kettlebell 24kg', category: 'Pesos Livres', quantity: 2 },
    { name: 'Barra Olímpica 20kg', category: 'Pesos Livres', quantity: 6 },
    { name: 'Bumper Plate 5kg', category: 'Pesos Livres', quantity: 8 },
    { name: 'Bumper Plate 10kg', category: 'Pesos Livres', quantity: 8 },
    { name: 'Bumper Plate 15kg', category: 'Pesos Livres', quantity: 8 },
    { name: 'Bumper Plate 20kg', category: 'Pesos Livres', quantity: 8 },
    { name: 'Bumper Plate 25kg', category: 'Pesos Livres', quantity: 4 },
    { name: 'Dumbbell 5kg (par)', category: 'Pesos Livres', quantity: 4 },
    { name: 'Dumbbell 10kg (par)', category: 'Pesos Livres', quantity: 4 },
    { name: 'Dumbbell 15kg (par)', category: 'Pesos Livres', quantity: 4 },
    { name: 'Dumbbell 20kg (par)', category: 'Pesos Livres', quantity: 2 },
    { name: 'Box Jump 60cm', category: 'Funcional', quantity: 6 },
    { name: 'Box Jump 50cm', category: 'Funcional', quantity: 6 },
    { name: 'Medicine Ball 6kg', category: 'Funcional', quantity: 6 },
    { name: 'Medicine Ball 9kg', category: 'Funcional', quantity: 6 },
    { name: 'Wall Ball 9kg', category: 'Funcional', quantity: 6 },
    { name: 'Wall Ball 6kg', category: 'Funcional', quantity: 6 },
    { name: 'Corda de Saltar', category: 'Funcional', quantity: 15 },
    { name: 'Corda de Batalha 15m', category: 'Funcional', quantity: 2 },
    { name: 'Slam Ball 10kg', category: 'Funcional', quantity: 4 },
    { name: 'Rower Concept2', category: 'Cardio', quantity: 4 },
    { name: 'Assault Bike', category: 'Cardio', quantity: 4 },
    { name: 'SkiErg', category: 'Cardio', quantity: 2 },
    { name: 'Esteira Profissional', category: 'Cardio', quantity: 2 },
    { name: 'Bicicleta Ergométrica', category: 'Cardio', quantity: 2 },
    { name: 'Pull-up Bar', category: 'Funcional', quantity: 6 },
    { name: 'Anilhas Olímpicas (par)', category: 'Ginástica', quantity: 8 },
    { name: 'Parallettes (par)', category: 'Ginástica', quantity: 6 },
    { name: 'Foam Roller', category: 'Mobilidade', quantity: 10 },
    { name: 'Banda Elástica (set)', category: 'Mobilidade', quantity: 10 },
    { name: 'Ab Mat', category: 'Funcional', quantity: 15 },
    { name: 'Colchão de Exercício', category: 'Mobilidade', quantity: 15 },
    { name: 'Landmine', category: 'Funcional', quantity: 2 },
    { name: 'GHD Machine', category: 'Ginástica', quantity: 2 },
    { name: 'Rack de Agachamento', category: 'Pesos Livres', quantity: 4 },
    { name: 'Bench Press', category: 'Pesos Livres', quantity: 2 },
  ];

  const addDefaultEquipment = useMutation({
    mutationFn: async () => {
      const equipmentToAdd = defaultEquipment.map(eq => ({
        ...eq,
        company_id: companyId,
        condition: 'good',
        status: 'active',
      }));

      const { error } = await supabase
        .from('equipment')
        .insert(equipmentToAdd);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipment', companyId] });
      toast.success('Equipamentos padrão adicionados com sucesso!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Erro ao adicionar equipamentos padrão');
    },
  });

  return {
    equipment,
    isLoading,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    addDefaultEquipment,
    defaultEquipment,
  };
};
