import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';

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
  created_at?: string;
  updated_at?: string;
}

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();
  const { toast } = useToast();

  const fetchStaff = async () => {
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
        toast({
          title: "Erro",
          description: "Erro ao carregar funcionários.",
          variant: "destructive"
        });
        return;
      }

      setStaff((data as Staff[]) || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar funcionários.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveStaff = async (staffData: Staff) => {
    if (!currentCompany?.id) {
      toast({
        title: "Erro",
        description: "Nenhuma empresa selecionada.",
        variant: "destructive"
      });
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
          toast({
            title: "Erro",
            description: "Erro ao atualizar funcionário.",
            variant: "destructive"
          });
          return;
        }

        toast({
          title: "Sucesso",
          description: "Funcionário atualizado com sucesso!"
        });
      } else {
        // Create new staff
        const { data: newStaff, error } = await (supabase as any)
          .from('staff')
          .insert([{ ...staffWithCompany, created_at: new Date().toISOString() }])
          .select()
          .single();

        if (error) {
          console.error('Error creating staff:', error);
          toast({
            title: "Erro",
            description: "Erro ao criar funcionário.",
            variant: "destructive"
          });
          return;
        }

        // Create user account if email and birth_date are provided
        if (staffData.email && staffData.birth_date) {
          try {
            await createUserAccount(staffData.email, staffData.name, staffData.birth_date);
          } catch (userError) {
            console.error('Error creating user account:', userError);
            toast({
              title: "Aviso",
              description: "Funcionário criado, mas houve erro ao criar a conta de acesso.",
              variant: "destructive"
            });
          }
        }

        toast({
          title: "Sucesso",
          description: "Funcionário criado com sucesso!"
        });
      }

      await fetchStaff();
    } catch (error) {
      console.error('Error saving staff:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar funcionário.",
        variant: "destructive"
      });
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
        toast({
          title: "Erro",
          description: "Erro ao excluir funcionário.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Sucesso",
        description: "Funcionário excluído com sucesso!"
      });

      await fetchStaff();
    } catch (error) {
      console.error('Error deleting staff:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir funcionário.",
        variant: "destructive"
      });
    }
  };

  const generatePasswordFromDate = (date: string): string => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();
    return `${day}${month}${year}`;
  };

  const createUserAccount = async (email: string, name: string, birthDate: string) => {
    const password = generatePasswordFromDate(birthDate);
    
    const { data, error } = await supabase.functions.invoke('create-student', {
      body: {
        email,
        password,
        name,
        role: 'staff'
      }
    });

    const msg = (error as any)?.message || (data as any)?.error || '';
    if (error && !msg.toString().includes('already been registered') && !msg.toString().includes('email_exists')) {
      console.error('Error creating user account:', error);
      throw error;
    }
  };

  const refetchStaff = () => {
    fetchStaff();
  };

  useEffect(() => {
    if (currentCompany?.id) {
      fetchStaff();
    }
  }, [currentCompany?.id]);

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