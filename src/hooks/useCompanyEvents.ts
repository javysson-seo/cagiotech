import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CompanyEvent {
  id: string;
  company_id: string;
  title: string;
  description?: string;
  event_date: string;
  end_date?: string;
  location?: string;
  max_participants?: number;
  current_participants: number;
  price: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useCompanyEvents = (companyId: string) => {
  const queryClient = useQueryClient();

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['company-events', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_events')
        .select('*')
        .eq('company_id', companyId)
        .order('event_date', { ascending: true });

      if (error) throw error;
      return data as CompanyEvent[];
    },
    enabled: !!companyId,
  });

  const createEvent = useMutation({
    mutationFn: async (event: Omit<Partial<CompanyEvent>, 'id' | 'created_at' | 'updated_at'> & { company_id: string; title: string; event_date: string }) => {
      const { data, error } = await supabase
        .from('company_events')
        .insert([event])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-events', companyId] });
      toast.success('Evento criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar evento');
      console.error(error);
    },
  });

  const updateEvent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CompanyEvent> & { id: string }) => {
      const { data, error } = await supabase
        .from('company_events')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-events', companyId] });
      toast.success('Evento atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar evento');
      console.error(error);
    },
  });

  const deleteEvent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-events', companyId] });
      toast.success('Evento removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover evento');
      console.error(error);
    },
  });

  return {
    events,
    isLoading,
    createEvent,
    updateEvent,
    deleteEvent,
  };
};