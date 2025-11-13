import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CompanyAnnouncement {
  id: string;
  company_id: string;
  title: string;
  content?: string;
  image_url?: string;
  link_url?: string;
  background_color: string;
  text_color: string;
  is_active: boolean;
  display_order: number;
  start_date?: string;
  end_date?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useCompanyAnnouncements = (companyId: string) => {
  const queryClient = useQueryClient();

  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['company-announcements', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_announcements')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as CompanyAnnouncement[];
    },
    enabled: !!companyId,
  });

  const { data: allAnnouncements = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['company-announcements-all', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_announcements')
        .select('*')
        .eq('company_id', companyId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as CompanyAnnouncement[];
    },
    enabled: !!companyId,
  });

  const createAnnouncement = useMutation({
    mutationFn: async (announcement: Omit<Partial<CompanyAnnouncement>, 'id' | 'created_at' | 'updated_at'> & { company_id: string; title: string }) => {
      const { data, error } = await supabase
        .from('company_announcements')
        .insert([announcement])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-announcements', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-announcements-all', companyId] });
      toast.success('Anúncio criado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar anúncio');
      console.error(error);
    },
  });

  const updateAnnouncement = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CompanyAnnouncement> & { id: string }) => {
      const { data, error } = await supabase
        .from('company_announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-announcements', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-announcements-all', companyId] });
      toast.success('Anúncio atualizado!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar anúncio');
      console.error(error);
    },
  });

  const deleteAnnouncement = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('company_announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-announcements', companyId] });
      queryClient.invalidateQueries({ queryKey: ['company-announcements-all', companyId] });
      toast.success('Anúncio removido!');
    },
    onError: (error) => {
      toast.error('Erro ao remover anúncio');
      console.error(error);
    },
  });

  return {
    announcements,
    allAnnouncements,
    isLoading,
    isLoadingAll,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  };
};
