import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface PlatformSuggestion {
  id: string;
  company_id: string;
  created_by: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'implemented';
  admin_notes: string | null;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  company?: {
    name: string;
  };
  creator?: {
    name: string;
  };
  votes?: {
    positive: number;
    negative: number;
    user_vote?: 'positive' | 'negative' | null;
  };
}

export const usePlatformSuggestions = (companyId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: suggestions = [], isLoading, refetch } = useQuery({
    queryKey: ['platform-suggestions', companyId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('platform_suggestions')
        .select(`
          *,
          company:companies(name, email, logo_url)
        `)
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []) as PlatformSuggestion[];
    },
  });

  const createSuggestion = useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!companyId) throw new Error('Company ID required');

      const { error } = await supabase
        .from('platform_suggestions')
        .insert({
          company_id: companyId,
          created_by: user.id,
          title: params.title,
          description: params.description,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-suggestions'] });
      toast({
        title: 'Sugestão enviada',
        description: 'Sua sugestão foi enviada para análise',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao enviar sugestão',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const vote = useMutation({
    mutationFn: async (params: {
      suggestionId: string;
      voteType: 'positive' | 'negative';
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (!companyId) throw new Error('Company ID required');

      // Check if user already voted
      const { data: existingVote } = await supabase
        .from('suggestion_votes')
        .select('id')
        .eq('suggestion_id', params.suggestionId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingVote) {
        // Delete existing vote
        await supabase
          .from('suggestion_votes')
          .delete()
          .eq('id', existingVote.id);
      }

      // Insert new vote
      const { error } = await supabase
        .from('suggestion_votes')
        .insert({
          suggestion_id: params.suggestionId,
          company_id: companyId,
          user_id: user.id,
          vote_type: params.voteType,
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-suggestions'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao votar',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateSuggestionStatus = useMutation({
    mutationFn: async ({
      id,
      status,
      admin_notes,
      is_public,
    }: {
      id: string;
      status: string;
      admin_notes?: string;
      is_public?: boolean;
    }) => {
      const { error } = await supabase
        .from('platform_suggestions')
        .update({
          status,
          admin_notes,
          is_public,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform-suggestions'] });
      toast({
        title: 'Sugestão atualizada',
        description: 'A sugestão foi atualizada com sucesso',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao atualizar sugestão',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    suggestions,
    isLoading,
    refetch,
    createSuggestion: createSuggestion.mutate,
    vote: vote.mutate,
    updateSuggestionStatus: updateSuggestionStatus.mutate,
  };
};