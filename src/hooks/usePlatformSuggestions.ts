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

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['platform-suggestions', companyId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('platform_suggestions')
        .select('*')
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch related data and votes for each suggestion
      const suggestionsWithData = await Promise.all(
        (data || []).map(async (suggestion: any) => {
          // Fetch company name
          const { data: company } = await supabase
            .from('companies')
            .select('name')
            .eq('id', suggestion.company_id)
            .single();

          // Fetch creator name
          const { data: creator } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', suggestion.created_by)
            .maybeSingle();

          // Fetch votes
          const { data: votes } = await supabase
            .from('suggestion_votes')
            .select('vote_type, user_id')
            .eq('suggestion_id', suggestion.id);

          const positive = votes?.filter(v => v.vote_type === 'positive').length || 0;
          const negative = votes?.filter(v => v.vote_type === 'negative').length || 0;
          const userVote = votes?.find(v => v.user_id === user.id)?.vote_type || null;

          return {
            ...suggestion,
            company,
            creator,
            votes: { positive, negative, userVote },
          };
        })
      );

      return suggestionsWithData as PlatformSuggestion[];
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

  return {
    suggestions,
    isLoading,
    createSuggestion: createSuggestion.mutate,
    vote: vote.mutate,
  };
};