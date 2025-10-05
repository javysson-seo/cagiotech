import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

interface Class {
  id?: string;
  company_id?: string;
  modality_id: string;
  room_id?: string;
  trainer_id?: string;
  title: string;
  description?: string;
  date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  current_bookings?: number;
  status?: string;
  notes?: string;
  modality?: any;
  room?: any;
  trainer?: any;
}

export const useClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchClasses = async (startDate?: string, endDate?: string) => {
    if (!currentCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      let query = supabase
        .from('classes')
        .select(`
          *,
          modality:modality_id(name, color),
          room:room_id(name),
          trainer:trainer_id(name)
        `)
        .eq('company_id', currentCompany.id)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (startDate) {
        query = query.gte('date', startDate);
      }
      
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query;

      if (error) throw error;

      setClasses(data || []);
    } catch (error) {
      console.error('Erro ao carregar aulas:', error);
      toast.error('Erro ao carregar aulas');
    } finally {
      setLoading(false);
    }
  };

  const saveClass = async (classData: Class): Promise<boolean> => {
    if (!currentCompany?.id) {
      toast.error('Empresa não identificada');
      return false;
    }

    try {
      const classToSave = {
        ...classData,
        company_id: currentCompany.id,
      };

      let result;
      
      if (classData.id) {
        const { id, modality, room, trainer, ...updateData } = classToSave;
        result = await supabase
          .from('classes')
          .update(updateData)
          .eq('id', classData.id)
          .eq('company_id', currentCompany.id)
          .select(`
            *,
            modality:modality_id(name, color),
            room:room_id(name),
            trainer:trainer_id(name)
          `)
          .single();
      } else {
        const { id, modality, room, trainer, ...insertData } = classToSave;
        result = await supabase
          .from('classes')
          .insert([insertData])
          .select(`
            *,
            modality:modality_id(name, color),
            room:room_id(name),
            trainer:trainer_id(name)
          `)
          .single();
      }

      if (result.error) throw result.error;

      if (classData.id) {
        setClasses(prev => prev.map(c => c.id === classData.id ? result.data : c));
        toast.success('Aula atualizada com sucesso!');
      } else {
        setClasses(prev => [result.data, ...prev]);
        toast.success('Aula criada com sucesso!');
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar aula:', error);
      toast.error('Erro ao salvar aula');
      return false;
    }
  };

  const deleteClass = async (classId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);

      if (error) throw error;

      setClasses(prev => prev.filter(c => c.id !== classId));
      toast.success('Aula excluída com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao excluir aula:', error);
      toast.error('Erro ao excluir aula');
      return false;
    }
  };

  const cancelClass = async (classId: string, reason?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('classes')
        .update({ 
          status: 'cancelled',
          notes: reason 
        })
        .eq('id', classId);

      if (error) throw error;

      setClasses(prev => prev.map(c => 
        c.id === classId ? { ...c, status: 'cancelled', notes: reason } : c
      ));
      toast.success('Aula cancelada com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao cancelar aula:', error);
      toast.error('Erro ao cancelar aula');
      return false;
    }
  };

  useEffect(() => {
    if (currentCompany?.id) fetchClasses();
  }, [currentCompany?.id]);

  return {
    classes,
    loading,
    saveClass,
    deleteClass,
    cancelClass,
    refetchClasses: fetchClasses,
  };
};