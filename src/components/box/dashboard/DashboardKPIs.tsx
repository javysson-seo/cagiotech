
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Euro, 
  Calendar, 
  Activity,
  Clock,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface DashboardKPIsProps {
  metrics: {
    revenue: number;
    revenueGrowth: number;
    activeAthletes: number;
    occupationRate: number;
    totalClasses: number;
  };
  isLoading?: boolean;
}

export const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ metrics, isLoading }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (value: number) => {
    return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Receita Total',
      value: `€${formatCurrency(metrics.revenue)}`,
      change: formatPercentage(metrics.revenueGrowth),
      trend: metrics.revenueGrowth >= 0 ? 'up' as const : 'down' as const,
      icon: Euro,
      description: 'vs. período anterior',
      progress: Math.min(100, Math.max(0, metrics.revenueGrowth + 50))
    },
    {
      title: 'Membros Ativos',
      value: metrics.activeAthletes.toString(),
      change: '+0%',
      trend: 'up' as const,
      icon: Users,
      description: 'este período',
      progress: 85
    },
    {
      title: 'Taxa de Ocupação',
      value: `${metrics.occupationRate.toFixed(1)}%`,
      change: '+0%',
      trend: 'up' as const,
      icon: Activity,
      description: 'média das salas',
      progress: metrics.occupationRate
    },
    {
      title: 'Aulas Realizadas',
      value: metrics.totalClasses.toString(),
      change: '+0%',
      trend: 'up' as const,
      icon: Calendar,
      description: 'este período',
      progress: 80
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {kpi.value}
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center space-x-1 text-sm ${
                kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {kpi.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span className="font-medium">{kpi.change}</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {kpi.progress}% objetivo
              </Badge>
            </div>
            <div className="space-y-1">
              <Progress value={kpi.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {kpi.description}
              </p>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
        </Card>
      ))}
    </div>
  );
};
