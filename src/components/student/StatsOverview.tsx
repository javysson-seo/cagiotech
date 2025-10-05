import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Flame, 
  Trophy, 
  Target, 
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

export const StatsOverview: React.FC = () => {
  // Mock data - substituir por dados reais
  const stats = [
    {
      label: 'Sequência',
      value: '7',
      unit: 'dias',
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      change: '+2'
    },
    {
      label: 'Pontos',
      value: '1,240',
      unit: 'pts',
      icon: Trophy,
      color: 'text-cagio-green',
      bgColor: 'bg-cagio-green-light',
      change: '+150'
    },
    {
      label: 'Aulas',
      value: '32',
      unit: 'mês',
      icon: Calendar,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      change: '+5'
    },
    {
      label: 'Nível',
      value: 'Elite',
      unit: '',
      icon: Award,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      change: ''
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
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
