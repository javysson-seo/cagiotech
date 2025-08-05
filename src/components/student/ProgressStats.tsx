
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Flame,
  Award,
  Activity
} from 'lucide-react';

export const ProgressStats: React.FC = () => {
  // Mock data - em produção virá da API/Supabase
  const stats = {
    monthlyGoal: {
      target: 15,
      completed: 12,
      percentage: 80
    },
    streak: {
      current: 7,
      best: 12
    },
    totalClasses: 147,
    totalPoints: 1248,
    currentRank: 'Gold',
    nextRank: 'Platinum',
    pointsToNext: 252
  };

  return (
    <div className="space-y-6">
      {/* Monthly Goal */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Target className="h-4 w-4 mr-2 text-blue-600" />
            Meta Mensal
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Progresso</span>
              <span className="font-medium">
                {stats.monthlyGoal.completed}/{stats.monthlyGoal.target} aulas
              </span>
            </div>
            
            <Progress value={stats.monthlyGoal.percentage} className="h-2" />
            
            <p className="text-xs text-muted-foreground">
              Faltam {stats.monthlyGoal.target - stats.monthlyGoal.completed} aulas para atingir a meta
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Flame className="h-4 w-4 mr-2 text-orange-600" />
            Sequência
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-orange-600">
              {stats.streak.current}
            </div>
            <p className="text-sm text-muted-foreground">
              dias consecutivos
            </p>
            <Badge variant="outline" className="text-xs">
              Recorde: {stats.streak.best} dias
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Rank Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <Award className="h-4 w-4 mr-2 text-purple-600" />
            Classificação
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className="bg-yellow-100 text-yellow-800">
                {stats.currentRank}
              </Badge>
              <Badge variant="outline" className="text-xs">
                → {stats.nextRank}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Pontos</span>
                <span className="font-medium">{stats.totalPoints}</span>
              </div>
              
              <Progress value={75} className="h-2" />
              
              <p className="text-xs text-muted-foreground">
                {stats.pointsToNext} pontos para {stats.nextRank}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Stats */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
            Estatísticas Gerais
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">
                {stats.totalClasses}
              </div>
              <p className="text-xs text-muted-foreground">
                Aulas Totais
              </p>
            </div>
            
            <div>
              <div className="text-lg font-bold text-purple-600">
                {stats.totalPoints}
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
