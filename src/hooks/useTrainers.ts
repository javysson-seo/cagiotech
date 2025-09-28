import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Trainer {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  specialties?: string[];
  status?: string;
  company_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useTrainers = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchTrainers = async () => {
    if (!currentCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('trainers')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching trainers:', error);
        toast.error('Erro ao carregar trainers');
        return;
      }

      setTrainers(data || []);
    } catch (error) {
      console.error('Error in fetchTrainers:', error);
      toast.error('Erro ao carregar trainers');
    } finally {
      setLoading(false);
    }
  };

  const saveTrainer = async (trainerData: Trainer): Promise<boolean> => {
    if (!currentCompany?.id) {
      toast.error('Empresa não identificada');
      return false;
    }

    try {
      // Create user in Supabase Auth if new trainer and has birth_date and email
      if (!trainerData.id && trainerData.birth_date && trainerData.email) {
        // Generate password from birth date (dd/mm/yyyy -> ddmmyyyy)
        const birthDate = new Date(trainerData.birth_date);
        const day = birthDate.getDate().toString().padStart(2, '0');
        const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
        const year = birthDate.getFullYear().toString();
        const password = `${day}${month}${year}`;

        // Create auth user via Edge Function to auto-confirm and avoid email confirmation
        const { data: fnData, error: fnError } = await supabase.functions.invoke('create-student', {
          body: {
            email: trainerData.email!,
            password,
            name: trainerData.name,
            role: 'trainer',
          },
        });

        if (fnError || (fnData as any)?.error) {
          console.error('Error creating auth user:', fnError || (fnData as any)?.error);
          toast.error('Erro ao criar usuário no sistema');
          return false;
        }

        toast.success(`Usuário criado! Email: ${trainerData.email}, Senha: ${password}`);
      }

      const trainerToSave = {
        ...trainerData,
        company_id: currentCompany.id,
        status: trainerData.status || 'active',
      };

      let result;
      
      if (trainerData.id) {
        // Update existing trainer
        const { id, ...updateData } = trainerToSave;
        result = await supabase
          .from('trainers')
          .update(updateData)
          .eq('id', trainerData.id)
          .eq('company_id', currentCompany.id)
          .select()
          .single();
      } else {
        // Create new trainer
        const { id, ...insertData } = trainerToSave;
        result = await supabase
          .from('trainers')
          .insert([insertData])
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving trainer:', result.error);
        toast.error('Erro ao salvar trainer');
        return false;
      }

      // Update local state
      if (trainerData.id) {
        setTrainers(prev => prev.map(t => t.id === trainerData.id ? result.data : t));
        toast.success(`Trainer ${trainerData.name} atualizado com sucesso!`);
      } else {
        setTrainers(prev => [result.data, ...prev]);
        toast.success(`Trainer ${trainerData.name} cadastrado com sucesso!`);
      }

      return true;
    } catch (error) {
      console.error('Error in saveTrainer:', error);
      toast.error('Erro ao salvar trainer');
      return false;
    }
  };

  const deleteTrainer = async (trainerId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('trainers')
        .delete()
        .eq('id', trainerId);

      if (error) {
        console.error('Error deleting trainer:', error);
        toast.error('Erro ao excluir trainer');
        return false;
      }

      setTrainers(prev => prev.filter(t => t.id !== trainerId));
      toast.success('Trainer excluído com sucesso');
      return true;
    } catch (error) {
      console.error('Error in deleteTrainer:', error);
      toast.error('Erro ao excluir trainer');
      return false;
    }
  };

  const generatePassword = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const createUserAccount = async (email: string, name: string): Promise<string | null> => {
    try {
      const password = generatePassword();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'trainer'
          }
        }
      });

      if (error) {
        console.error('Error creating user account:', error);
        toast.error('Erro ao criar conta de utilizador');
        return null;
      }

      toast.success(`Conta criada! Senha: ${password}`);
      return data.user?.id || null;
    } catch (error) {
      console.error('Error in createUserAccount:', error);
      toast.error('Erro ao criar conta de utilizador');
      return null;
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [currentCompany?.id]);

  return {
    trainers,
    loading,
    saveTrainer,
    deleteTrainer,
    createUserAccount,
    generatePassword,
    refetchTrainers: fetchTrainers,
  };
};