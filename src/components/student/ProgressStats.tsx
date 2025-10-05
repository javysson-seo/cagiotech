import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Flame,
  Award
} from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const ProgressStats: React.FC = () => {
  const { user } = useAuth();
  const [athleteId, setAthleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthleteId = async () => {
      if (!user?.email) return;

      const { data } = await supabase
        .from('athletes')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (data) {
        setAthleteId(data.id);
      }
    };

    fetchAthleteId();
  }, [user?.email]);

  const { athleteLevel, isLoading, getNextLevel } = useGamification(athleteId || undefined);

  if (isLoading || !athleteLevel) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Carregando estatísticas...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextLevel = getNextLevel(athleteLevel.current_level, athleteLevel.total_points);
  const monthlyTarget = 15;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      {/* Monthly Goal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Target className="h-4 w-4 mr-2 text-primary" />
            Meta Mensal
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Progresso</span>
              <span className="font-medium">
                {athleteLevel.total_classes}/{monthlyTarget} aulas
              </span>
            </div>
            
            <Progress value={(athleteLevel.total_classes / monthlyTarget) * 100} className="h-2" />
            
            <p className="text-xs text-muted-foreground">
              {athleteLevel.total_classes >= monthlyTarget 
                ? '🎉 Meta atingida!' 
                : `Faltam ${monthlyTarget - athleteLevel.total_classes} aulas para atingir a meta`}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Flame className="h-4 w-4 mr-2 text-orange-500" />
            Sequência
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-orange-500">
              {athleteLevel.current_streak} 🔥
            </div>
            <p className="text-sm text-muted-foreground">
              dias consecutivos
            </p>
            <Badge variant="outline" className="text-xs">
              Recorde: {athleteLevel.best_streak} dias
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Rank Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Award className="h-4 w-4 mr-2 text-primary" />
            Nível
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge variant="default">
                {athleteLevel.current_level}
              </Badge>
              {nextLevel && (
                <Badge variant="outline" className="text-xs">
                  → {nextLevel.name}
                </Badge>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Pontos Totais</span>
                <span className="font-medium">{athleteLevel.total_points}</span>
              </div>
              
              {nextLevel ? (
                <>
                  <Progress value={nextLevel.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {nextLevel.pointsNeeded} pontos para {nextLevel.name}
                  </p>
                </>
              ) : (
                <p className="text-xs text-muted-foreground text-center">
                  🏆 Nível máximo alcançado!
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-primary" />
            Estatísticas Gerais
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-primary">
                {athleteLevel.total_classes}
              </div>
              <p className="text-xs text-muted-foreground">
                Aulas Totais
              </p>
            </div>
            
            <div>
              <div className="text-lg font-bold text-primary">
                {athleteLevel.total_points}
              </div>
              <p className="text-xs text-muted-foreground">
                Pontos Totais
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
