import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanyMessage {
  id: string;
  company_id: string;
  sender_id: string;
  recipient_id: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
  sender?: {
    id: string;
    name: string;
  };
  recipient?: {
    id: string;
    name: string;
  };
}

export const useCompanyMessages = (companyId: string, recipientId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['company-messages', companyId, recipientId],
    queryFn: async () => {
      let query = supabase
        .from('company_messages')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: true });

      if (recipientId) {
        query = query.or(`recipient_id.eq.${recipientId},recipient_id.is.null`);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch profile data separately
      const messagesWithProfiles = await Promise.all(
        (data || []).map(async (msg: any) => {
          const { data: sender } = await supabase
            .from('profiles')
            .select('id, name')
            .eq('id', msg.sender_id)
            .single();

          let recipient = null;
          if (msg.recipient_id) {
            const { data: recipientData } = await supabase
              .from('profiles')
              .select('id, name')
              .eq('id', msg.recipient_id)
              .maybeSingle();
            recipient = recipientData;
          }

          return {
            ...msg,
            sender,
            recipient,
          };
        })
      );

      return messagesWithProfiles as CompanyMessage[];
    },
    enabled: !!companyId,
  });

  const sendMessage = useMutation({
    mutationFn: async (params: {
      message: string;
      recipientId?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('company_messages')
        .insert({
          company_id: companyId,
          sender_id: user.id,
          recipient_id: params.recipientId || null,
          message: params.message,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-messages'] });
      toast({
        title: 'Mensagem enviada',
        description: 'A mensagem foi enviada com sucesso',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao enviar mensagem',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const markAsRead = useMutation({
    mutationFn: async (messageId: string) => {
      const { error } = await supabase
        .from('company_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-messages'] });
    },
  });

  return {
    messages,
    isLoading,
    sendMessage: sendMessage.mutate,
    markAsRead: markAsRead.mutate,
  };
};