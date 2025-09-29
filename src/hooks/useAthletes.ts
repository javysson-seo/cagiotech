
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
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
  medical_notes?: string;
  goals?: string[];
  notes?: string;
  nutrition_preview?: string;
  profile_photo?: string;
  company_id?: string;
}

export const useAthletes = () => {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchAthletes = async () => {
    if (!currentCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('athletes')
        .select('*')
        .eq('company_id', currentCompany.id)
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
    if (!currentCompany?.id) {
      toast.error('Empresa não identificada');
      return false;
    }

    try {
      // Create user in Supabase Auth if new athlete and has birth_date
      if (!athleteData.id && athleteData.birth_date) {
        // Generate password from birth date (dd/mm/yyyy -> ddmmyyyy)
        const birthDate = new Date(athleteData.birth_date);
        const day = birthDate.getDate().toString().padStart(2, '0');
        const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
        const year = birthDate.getFullYear().toString();
        const password = `${day}${month}${year}`;

        const { data: fnData, error: fnError } = await supabase.functions.invoke('create-student', {
          body: {
            email: athleteData.email!,
            password,
            name: athleteData.name,
            role: 'student',
          },
        });

        const efErrorMsg = (fnError as any)?.message || (fnData as any)?.error || '';
        if (fnError && !efErrorMsg.toString().includes('already been registered') && !efErrorMsg.toString().includes('email_exists')) {
          console.error('Error creating auth user:', fnError);
          toast.error('Erro ao criar usuário no sistema');
          // Continue saving athlete even if auth creation failed
        } else if (!fnError && (fnData as any)?.code === 'email_exists') {
          toast.info('Usuário já existente para este email. Mantendo cadastro do atleta.');
        } else if (!fnError) {
          toast.success(`Usuário criado! Email: ${athleteData.email}, Senha: ${password}`);
        }
      }

      const athleteToSave = {
        ...athleteData,
        company_id: currentCompany.id,
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
          .eq('company_id', currentCompany.id)
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
    if (currentCompany?.id) fetchAthletes();
  }, [currentCompany?.id]);

  return {
    athletes,
    loading,
    saveAthlete,
    deleteAthlete,
    refetchAthletes: fetchAthletes,
  };
};
