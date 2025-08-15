
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
  filters: {
    dateRange: any;
    trainer: string;
    modality: string;
    room: string;
  };
}

export const DashboardKPIs: React.FC<DashboardKPIsProps> = ({ filters }) => {
  const kpis = [
    {
      title: 'Receita Total',
      value: '€8,750',
      change: '+15.3%',
      trend: 'up' as const,
      icon: Euro,
      description: 'vs. período anterior',
      progress: 87
    },
    {
      title: 'Membros Ativos',
      value: '147',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users,
      description: 'este período',
      progress: 92
    },
    {
      title: 'Taxa de Ocupação',
      value: '78%',
      change: '+5.1%',
      trend: 'up' as const,
      icon: Activity,
      description: 'média das salas',
      progress: 78
    },
    {
      title: 'Aulas Realizadas',
      value: '156',
      change: '+12.4%',
      trend: 'up' as const,
      icon: Calendar,
      description: 'este período',
      progress: 86
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
