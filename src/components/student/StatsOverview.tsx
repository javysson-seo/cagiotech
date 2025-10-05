import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Flame, 
  Trophy, 
  Calendar,
  Award
} from 'lucide-react';
import { useAthleteStats } from '@/hooks/useAthleteStats';

export const StatsOverview: React.FC = () => {
  const { stats, loading } = useAthleteStats();

  const displayStats = useMemo(() => [
    {
      label: 'Sequência',
      value: stats.currentStreak.toString(),
      unit: 'dias',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      change: stats.currentStreak > 0 ? `+${stats.currentStreak}` : ''
    },
    {
      label: 'Pontos',
      value: stats.totalPoints.toLocaleString('pt-BR'),
      unit: 'pts',
      icon: Trophy,
      color: 'text-cagio-green',
      bgColor: 'bg-cagio-green-light',
      change: stats.totalPoints > 0 ? '+' + stats.totalPoints : ''
    },
    {
      label: 'Aulas',
      value: stats.monthlyClasses.toString(),
      unit: 'mês',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: stats.monthlyClasses > 0 ? `+${stats.monthlyClasses}` : ''
    },
    {
      label: 'Nível',
      value: stats.currentLevel,
      unit: '',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      change: ''
    }
  ], [stats]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-md animate-pulse">
            <CardContent className="p-4">
              <div className="h-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {displayStats.map((stat) => (
        <Card 
          key={stat.label} 
          className="border-0 shadow-md hover:shadow-lg transition-shadow"
        >
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              {stat.change && (
                <span className="text-xs font-semibold text-cagio-green">
                  {stat.change}
                </span>
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-foreground">
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-xs text-muted-foreground">
                    {stat.unit}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
