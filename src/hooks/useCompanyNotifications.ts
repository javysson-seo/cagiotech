import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanyNotification {
  id: string;
  company_id: string;
  created_by: string;
  title: string;
  message: string;
  is_urgent: boolean;
  created_at: string;
  creator?: {
    name: string;
  };
}

export const useCompanyNotifications = (companyId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['company-notifications', companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_notifications')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch creator profiles separately
      const notificationsWithCreators = await Promise.all(
        (data || []).map(async (notification: any) => {
          const { data: creator } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', notification.created_by)
            .maybeSingle();

          return {
            ...notification,
            creator,
          };
        })
      );

      return notificationsWithCreators as CompanyNotification[];
    },
    enabled: !!companyId,
  });

  const createNotification = useMutation({
    mutationFn: async (params: {
      title: string;
      message: string;
      isUrgent?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('company_notifications')
        .insert({
          company_id: companyId,
          created_by: user.id,
          title: params.title,
          message: params.message,
          is_urgent: params.isUrgent || false,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-notifications'] });
      toast({
        title: 'Notificação enviada',
        description: 'A notificação foi enviada para todos os membros',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao enviar notificação',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    notifications,
    isLoading,
    createNotification: createNotification.mutate,
  };
};