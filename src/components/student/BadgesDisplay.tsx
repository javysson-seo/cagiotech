import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { AthleteBadge } from '@/hooks/useGamification';

interface BadgesDisplayProps {
  badges: AthleteBadge[];
  isLoading: boolean;
}

export const BadgesDisplay: React.FC<BadgesDisplayProps> = ({ badges, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Badges Conquistados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  if (!badges || badges.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Badges Conquistados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Continue treinando para conquistar seus primeiros badges!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="h-5 w-5 mr-2" />
            Badges Conquistados
          </div>
          <Badge variant="secondary">{badges.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              style={{ borderColor: badge.badge_definitions.color + '40' }}
            >
              <div
                className="text-4xl mb-2"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
              >
                {badge.badge_definitions.icon}
              </div>
              <h4 className="font-semibold text-sm text-center mb-1">
                {badge.badge_definitions.name}
              </h4>
              {badge.badge_definitions.description && (
                <p className="text-xs text-muted-foreground text-center mb-2">
                  {badge.badge_definitions.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(badge.earned_at), {
                  addSuffix: true,
                  locale: ptBR,
                })}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
