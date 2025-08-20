
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
  address?: string;
  plan?: string;
  trainer?: string;
  group?: string;
  status?: string;
  join_date?: string;
  monthly_fee?: number;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  goals?: string[];
  notes?: string;
  nutrition_preview?: string;
  profile_photo?: string;
  company_id: string;
  created_at?: string;
  updated_at?: string;
}

export const useAthletes = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('athletes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setAthletes(data || []);
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao carregar atletas: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const createAthlete = async (athleteData: Omit<Athlete, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      // Get the user's company
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', profile?.id)
        .single();

      if (!company) {
        throw new Error('Empresa não encontrada');
      }

      const { data, error } = await supabase
        .from('athletes')
        .insert([{ ...athleteData, company_id: company.id }])
        .select()
        .single();

      if (error) throw error;

      setAthletes(prev => [data, ...prev]);
      
      // Log activity
      await supabase
        .from('athlete_activities')
        .insert([{
          athlete_id: data.id,
          company_id: company.id,
          type: 'created',
          description: `Atleta ${data.name} foi cadastrado`,
          performed_by: (await supabase.auth.getUser()).data.user?.id,
          performed_by_name: profile?.id // You might want to get the actual name
        }]);

      toast.success(`Atleta ${data.name} cadastrado com sucesso!`);
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao criar atleta: ' + err.message);
      throw err;
    }
  };

  const updateAthlete = async (id: string, athleteData: Partial<Athlete>) => {
    try {
      const { data, error } = await supabase
        .from('athletes')
        .update(athleteData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setAthletes(prev => prev.map(athlete => 
        athlete.id === id ? { ...athlete, ...data } : athlete
      ));

      // Log activity
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (company) {
        await supabase
          .from('athlete_activities')
          .insert([{
            athlete_id: id,
            company_id: company.id,
            type: 'updated',
            description: `Dados do atleta foram atualizados`,
            performed_by: (await supabase.auth.getUser()).data.user?.id
          }]);
      }

      toast.success(`Dados do atleta atualizados com sucesso!`);
      return data;
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao atualizar atleta: ' + err.message);
      throw err;
    }
  };

  const deleteAthlete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('athletes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAthletes(prev => prev.filter(athlete => athlete.id !== id));
      toast.success('Atleta excluído com sucesso!');
    } catch (err: any) {
      setError(err.message);
      toast.error('Erro ao excluir atleta: ' + err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  return {
    athletes,
    loading,
    error,
    createAthlete,
    updateAthlete,
    deleteAthlete,
    refetch: fetchAthletes
  };
};
