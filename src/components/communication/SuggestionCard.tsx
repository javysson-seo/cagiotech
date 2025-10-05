import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PlatformSuggestion } from '@/hooks/usePlatformSuggestions';

interface SuggestionCardProps {
  suggestion: PlatformSuggestion;
  onVote?: (suggestionId: string, voteType: 'positive' | 'negative') => void;
  canVote?: boolean;
}

const statusColors = {
  pending: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
  implemented: 'bg-blue-500',
};

const statusLabels = {
  pending: 'Pendente',
  approved: 'Aprovada',
  rejected: 'Rejeitada',
  implemented: 'Implementada',
};

export const SuggestionCard: React.FC<SuggestionCardProps> = ({ suggestion, onVote, canVote }) => {
  const userVote = suggestion.votes?.user_vote;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{suggestion.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <span>{suggestion.company?.name}</span>
              <span>•</span>
              <span>{format(new Date(suggestion.created_at), 'dd/MM/yyyy', { locale: ptBR })}</span>
            </div>
          </div>
          <Badge className={statusColors[suggestion.status]}>
            {statusLabels[suggestion.status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm whitespace-pre-wrap">{suggestion.description}</p>

        {suggestion.admin_notes && (
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs font-medium mb-1">Nota da Administração:</p>
            <p className="text-sm">{suggestion.admin_notes}</p>
          </div>
        )}

        {suggestion.status === 'approved' && canVote && onVote && (
          <div className="flex items-center gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={userVote === 'positive' ? 'default' : 'outline'}
                onClick={() => onVote(suggestion.id, 'positive')}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {suggestion.votes?.positive || 0}
              </Button>
              <Button
                size="sm"
                variant={userVote === 'negative' ? 'destructive' : 'outline'}
                onClick={() => onVote(suggestion.id, 'negative')}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {suggestion.votes?.negative || 0}
              </Button>
            </div>
          </div>
        )}

        {suggestion.status !== 'approved' && suggestion.votes && (
          <div className="flex items-center gap-4 pt-4 border-t text-sm text-muted-foreground">
            <span>{suggestion.votes.positive} positivos</span>
            <span>•</span>
            <span>{suggestion.votes.negative} negativos</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};