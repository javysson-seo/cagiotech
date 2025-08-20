
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Athlete {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  status: string;
  company_id: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAthletes = (companyId: string) => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('athletes')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAthletes(data || []);
    } catch (error) {
      console.error('Error fetching athletes:', error);
      toast.error('Erro ao carregar atletas');
    } finally {
      setLoading(false);
    }
  };

  const createAthlete = async (athleteData: Omit<Athlete, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('athletes')
        .insert([athleteData])
        .select()
        .single();

      if (error) throw error;
      
      setAthletes(prev => [data, ...prev]);
      toast.success(`Atleta ${athleteData.name} cadastrado com sucesso!`);
      return data;
    } catch (error) {
      console.error('Error creating athlete:', error);
      toast.error('Erro ao cadastrar atleta');
      throw error;
    }
  };

  const updateAthlete = async (id: string, athleteData: Partial<Athlete>) => {
    try {
      const { data, error } = await supabase
        .from('athletes')
        .update({ ...athleteData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setAthletes(prev => prev.map(athlete => athlete.id === id ? data : athlete));
      toast.success(`Dados do atleta ${data.name} atualizados com sucesso!`);
      return data;
    } catch (error) {
      console.error('Error updating athlete:', error);
      toast.error('Erro ao atualizar atleta');
      throw error;
    }
  };

  const deleteAthlete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('athletes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      const deletedAthlete = athletes.find(a => a.id === id);
      setAthletes(prev => prev.filter(athlete => athlete.id !== id));
      toast.success(`Atleta ${deletedAthlete?.name} foi excluído com sucesso.`);
    } catch (error) {
      console.error('Error deleting athlete:', error);
      toast.error('Erro ao excluir atleta');
      throw error;
    }
  };

  useEffect(() => {
    if (companyId) {
      fetchAthletes();
    }
  }, [companyId]);

  return {
    athletes,
    loading,
    createAthlete,
    updateAthlete,
    deleteAthlete,
    refetch: fetchAthletes
  };
};
