import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

interface Room {
  id?: string;
  company_id?: string;
  name: string;
  description?: string;
  capacity: number;
  floor?: string;
  amenities?: string[];
  is_active?: boolean;
}

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentCompany } = useCompany();

  const fetchRooms = async () => {
    if (!currentCompany?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('name');

      if (error) throw error;

      setRooms(data || []);
    } catch (error) {
      console.error('Erro ao carregar salas:', error);
      toast.error('Erro ao carregar salas');
    } finally {
      setLoading(false);
    }
  };

  const saveRoom = async (roomData: Room): Promise<boolean> => {
    if (!currentCompany?.id) {
      toast.error('Empresa não identificada');
      return false;
    }

    try {
      const roomToSave = {
        ...roomData,
        company_id: currentCompany.id,
      };

      let result;
      
      if (roomData.id) {
        const { id, ...updateData } = roomToSave;
        result = await supabase
          .from('rooms')
          .update(updateData)
          .eq('id', roomData.id)
          .eq('company_id', currentCompany.id)
          .select()
          .single();
      } else {
        const { id, ...insertData } = roomToSave;
        result = await supabase
          .from('rooms')
          .insert([insertData])
          .select()
          .single();
      }

      if (result.error) throw result.error;

      if (roomData.id) {
        setRooms(prev => prev.map(r => r.id === roomData.id ? result.data : r));
        toast.success('Sala atualizada com sucesso!');
      } else {
        setRooms(prev => [result.data, ...prev]);
        toast.success('Sala criada com sucesso!');
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar sala:', error);
      toast.error('Erro ao salvar sala');
      return false;
    }
  };

  const deleteRoom = async (roomId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;

      setRooms(prev => prev.filter(r => r.id !== roomId));
      toast.success('Sala excluída com sucesso');
      return true;
    } catch (error) {
      console.error('Erro ao excluir sala:', error);
      toast.error('Erro ao excluir sala');
      return false;
    }
  };

  useEffect(() => {
    if (currentCompany?.id) fetchRooms();
  }, [currentCompany?.id]);

  return {
    rooms,
    loading,
    saveRoom,
    deleteRoom,
    refetchRooms: fetchRooms,
  };
};