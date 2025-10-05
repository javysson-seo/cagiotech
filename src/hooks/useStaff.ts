import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

export interface Staff {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  birth_date?: string;
  hire_date?: string;
  status?: string;
  company_id?: string;
  user_id?: string;
  role_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchStaff = useCallback(async () => {
    if (!currentCompany?.id) return;

    try {
      setLoading(true);
      const { data, error } = await (supabase as any)
        .from('staff')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching staff:', error);
        toast.error('Erro ao carregar funcionários.');
        return;
      }

      setStaff((data as Staff[]) || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast.error('Erro ao carregar funcionários.');
    } finally {
      setLoading(false);
    }
  }, [currentCompany?.id]);

  const saveStaff = async (staffData: Staff) => {
    if (!currentCompany?.id) {
      toast.error('Nenhuma empresa selecionada.');
      return;
    }

    try {
      const staffWithCompany = {
        ...staffData,
        company_id: currentCompany.id,
        updated_at: new Date().toISOString()
      };

      if (staffData.id) {
        // Update existing staff
        const { error } = await (supabase as any)
          .from('staff')
          .update(staffWithCompany)
          .eq('id', staffData.id);

        if (error) {
          console.error('Error updating staff:', error);
          toast.error('Erro ao atualizar funcionário.');
          return;
        }

        toast.success('Funcionário atualizado com sucesso!');
      } else {
        // Create new staff
        const { data: newStaff, error } = await (supabase as any)
          .from('staff')
          .insert([{ ...staffWithCompany, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) {
          console.error('Error creating staff:', error);
          toast.error('Erro ao criar funcionário.');
          return;
        }

        // Create user account if email and birth_date are provided
        if (staffData.email && staffData.birth_date) {
          try {
            const userId = await createUserAccount(
              staffData.email, 
              staffData.name, 
              staffData.birth_date,
              staffData.position
            );
            
            // Update staff with user_id
            if (userId && newStaff?.id) {
              await (supabase as any)
                .from('staff')
                .update({ user_id: userId })
                .eq('id', newStaff.id);
            }
          } catch (userError) {
            console.error('Error creating user account:', userError);
            toast.warning('Funcionário criado, mas houve erro ao criar a conta de acesso.');
          }
        }

        toast.success('Funcionário criado com sucesso!');
      }

      await fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast.error('Erro ao salvar funcionário.');
    }
  };

  const deleteStaff = async (staffId: string) => {
    try {
      const { error } = await (supabase as any)
        .from('staff')
        .delete()
        .eq('id', staffId);

      if (error) {
        console.error('Error deleting staff:', error);
        toast.error('Erro ao excluir funcionário.');
        return;
      }

      toast.success('Funcionário excluído com sucesso!');

      await fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast.error('Erro ao excluir funcionário.');
    }
  };

  const generatePasswordFromDate = (date: string): string => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();
    return `${day}${month}${year}`;
  };

  const createUserAccount = async (email: string, name: string, birthDate: string, position: string) => {
    if (!currentCompany?.id) return;
    
    const password = generatePasswordFromDate(birthDate);
    
    const { data, error } = await supabase.functions.invoke('create-staff-user', {
      body: {
        email,
        password,
        name,
        position,
        company_id: currentCompany.id
      }
    });

    if (error) {
      console.error('Error creating user account:', error);
      throw error;
    }

    if (!data.success) {
      throw new Error(data.error || 'Erro ao criar usuário');
    }

    return data.user_id;
  };

  const refetchStaff = useCallback(() => {
    fetchStaff();
  }, [fetchStaff]);

  useEffect(() => {
    if (currentCompany?.id) {
      fetchStaff();
    }
  }, [currentCompany?.id, fetchStaff]);

  return {
    staff,
    loading,
    saveStaff,
    deleteStaff,
    createUserAccount,
    generatePasswordFromDate,
    refetchStaff
  };
};