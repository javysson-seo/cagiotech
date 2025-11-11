import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';
import { useHRActivities } from './useHRActivities';

export interface StaffEvent {
  id: string;
  company_id: string;
  title: string;
  description?: string;
  event_type: string;
  start_date: string;
  end_date?: string;
  location?: string;
  staff_ids?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useStaffEvents = () => {
  const { currentCompany } = useCompany();
  const { logActivity } = useHRActivities();
  const [events, setEvents] = useState<StaffEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    if (!currentCompany?.id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('staff_events')
        .select('*')
        .eq('company_id', currentCompany.id)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      console.error('Error fetching staff events:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: Partial<StaffEvent>) => {
    if (!currentCompany?.id) return;

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const insertData: any = {
        company_id: currentCompany.id,
        title: eventData.title,
        description: eventData.description,
        event_type: eventData.event_type,
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        location: eventData.location,
        staff_ids: eventData.staff_ids,
        created_by: userData.user?.id || ''
      };

      const { data, error } = await supabase
        .from('staff_events')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      toast.success('Evento criado com sucesso');
      
      await logActivity(
        'event_created',
        'Novo evento criado',
        `${eventData.title} - ${eventData.event_type}`,
        data.id
      );

      await fetchEvents();
    } catch (error: any) {
      console.error('Error creating event:', error);
      toast.error('Erro ao criar evento');
    }
  };

  const updateEvent = async (eventId: string, eventData: Partial<StaffEvent>) => {
    if (!currentCompany?.id) return;

    try {
      const { error } = await supabase
        .from('staff_events')
        .update({
          ...eventData,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .eq('company_id', currentCompany.id);

      if (error) throw error;

      toast.success('Evento atualizado com sucesso');
      await fetchEvents();
    } catch (error: any) {
      console.error('Error updating event:', error);
      toast.error('Erro ao atualizar evento');
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!currentCompany?.id) return;

    try {
      const { error } = await supabase
        .from('staff_events')
        .delete()
        .eq('id', eventId)
        .eq('company_id', currentCompany.id);

      if (error) throw error;

      toast.success('Evento removido com sucesso');
      await fetchEvents();
    } catch (error: any) {
      console.error('Error deleting event:', error);
      toast.error('Erro ao remover evento');
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentCompany?.id]);

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    refetch: fetchEvents
  };
};
