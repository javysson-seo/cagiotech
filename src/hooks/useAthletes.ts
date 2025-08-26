
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Athlete {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  gender?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  plan?: string;
  trainer?: string;
  group?: string;
  status?: string;
  join_date?: string;
  monthly_fee?: number;
  medical_conditions?: string;
  goals?: string[];
  notes?: string;
  nutrition_preview?: string;
  profile_photo?: string;
  company_id?: string;
}

export const useAthletes = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAthletes = async () => {
    try {
      setLoading(true);
      
      // Get user's company first
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        return;
      }

      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      if (companiesError || !companies || companies.length === 0) {
        console.log('No company found for user');
        return;
      }

      const companyId = companies[0].id;
      
      const { data, error } = await supabase
        .from('athletes')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching athletes:', error);
        toast.error('Erro ao carregar atletas');
        return;
      }

      setAthletes(data || []);
    } catch (error) {
      console.error('Error in fetchAthletes:', error);
      toast.error('Erro ao carregar atletas');
    } finally {
      setLoading(false);
    }
  };

  const saveAthlete = async (athleteData: Athlete): Promise<boolean> => {
    try {
      // Get user's company
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Usuário não autenticado');
        return false;
      }

      const { data: companies, error: companiesError } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', user.id)
        .limit(1);

      if (companiesError || !companies || companies.length === 0) {
        toast.error('Empresa não encontrada');
        return false;
      }

      const companyId = companies[0].id;

      const athleteToSave = {
        ...athleteData,
        company_id: companyId,
        monthly_fee: athleteData.monthly_fee ? Number(athleteData.monthly_fee) : 0,
      };

      let result;
      
      if (athleteData.id) {
        // Update existing athlete
        const { id, ...updateData } = athleteToSave;
        result = await supabase
          .from('athletes')
          .update(updateData)
          .eq('id', athleteData.id)
          .eq('company_id', companyId)
          .select()
          .single();
      } else {
        // Create new athlete
        const { id, ...insertData } = athleteToSave;
        result = await supabase
          .from('athletes')
          .insert([insertData])
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving athlete:', result.error);
        toast.error('Erro ao salvar atleta');
        return false;
      }

      // Update local state
      if (athleteData.id) {
        setAthletes(prev => prev.map(a => a.id === athleteData.id ? result.data : a));
        toast.success(`Atleta ${athleteData.name} atualizado com sucesso!`);
      } else {
        setAthletes(prev => [result.data, ...prev]);
        toast.success(`Atleta ${athleteData.name} cadastrado com sucesso!`);
      }

      // Check for birthday
      if (athleteData.birth_date) {
        const today = new Date();
        const birthDate = new Date(athleteData.birth_date);
        
        if (
          today.getMonth() === birthDate.getMonth() && 
          today.getDate() === birthDate.getDate()
        ) {
          const age = today.getFullYear() - birthDate.getFullYear();
          toast.success(`🎉 ${athleteData.name} está fazendo ${age} anos hoje!`);
        }
      }

      return true;
    } catch (error) {
      console.error('Error in saveAthlete:', error);
      toast.error('Erro ao salvar atleta');
      return false;
    }
  };

  const deleteAthlete = async (athleteId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('athletes')
        .delete()
        .eq('id', athleteId);

      if (error) {
        console.error('Error deleting athlete:', error);
        toast.error('Erro ao excluir atleta');
        return false;
      }

      setAthletes(prev => prev.filter(a => a.id !== athleteId));
      toast.success('Atleta excluído com sucesso');
      return true;
    } catch (error) {
      console.error('Error in deleteAthlete:', error);
      toast.error('Erro ao excluir atleta');
      return false;
    }
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  return {
    athletes,
    loading,
    saveAthlete,
    deleteAthlete,
    refetchAthletes: fetchAthletes,
  };
};
