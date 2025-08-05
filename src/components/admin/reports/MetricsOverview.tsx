
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2,
  Users,
  Euro,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity,
  CreditCard
} from 'lucide-react';

interface MetricsOverviewProps {
  dateRange: string;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ dateRange }) => {
  // Dados simulados baseados no período selecionado
  const getMetrics = () => {
    const baseMetrics = {
      totalBoxes: 147,
      totalUsers: 12543,
      totalRevenue: 284560,
      averageRevenue: 1936,
      activeUsers: 8945,
      newRegistrations: 234,
      churnRate: 2.1,
      avgSessionTime: 45
    };

    // Simular variações baseadas no período
    const multiplier = dateRange === '7' ? 0.2 : dateRange === '90' ? 2.5 : 1;
    
    return {
      ...baseMetrics,
      totalRevenue: Math.round(baseMetrics.totalRevenue * multiplier),
      newRegistrations: Math.round(baseMetrics.newRegistrations * multiplier)
    };
  };

  const metrics = getMetrics();

  const overviewCards = [
    {
      title: 'Total de BOX',
      value: metrics.totalBoxes.toString(),
      change: '+12%',
      trend: 'up' as const,
      icon: Building2,
      description: 'BOX ativas na plataforma',
      color: 'blue'
    },
    {
      title: 'Utilizadores Totais',
      value: metrics.totalUsers.toLocaleString(),
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users,
      description: 'Utilizadores registados',
      color: 'green'
    },
    {
      title: 'Receita Total',
      value: `€${metrics.totalRevenue.toLocaleString()}`,
      change: '+15.3%',
      trend: 'up' as const,
      icon: Euro,
      description: `Últimos ${dateRange === '7' ? '7 dias' : dateRange === '30' ? '30 dias' : dateRange === '90' ? '3 meses' : 'ano'}`,
      color: 'purple'
    },
    {
      title: 'Receita Média/BOX',
      value: `€${metrics.averageRevenue}`,
      change: '+5.7%',
      trend: 'up' as const,
      icon: TrendingUp,
      description: 'Por BOX ativa',
      color: 'orange'
    },
    {
      title: 'Utilizadores Ativos',
      value: metrics.activeUsers.toLocaleString(),
      change: '+3.4%',
      trend: 'up' as const,
      icon: Activity,
      description: 'Últimos 30 dias',
      color: 'emerald'
    },
    {
      title: 'Novos Registos',
      value: metrics.newRegistrations.toString(),
      change: '+18.9%',
      trend: 'up' as const,
      icon: Users,
      description: 'Neste período',
      color: 'cyan'
    },
    {
      title: 'Taxa de Churn',
      value: `${metrics.churnRate}%`,
      change: '-0.5%',
      trend: 'down' as const,
      icon: ArrowDown,
      description: 'Cancelamentos mensais',
      color: 'red'
    },
    {
      title: 'Tempo Médio Sessão',
      value: `${metrics.avgSessionTime}min`,
      change: '+2.1%',
      trend: 'up' as const,
      icon: Activity,
      description: 'Por utilizador',
      color: 'indigo'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {overviewCards.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">
              {metric.value}
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-1 text-sm ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {metric.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                <span className="font-medium">{metric.change}</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-1">
              {metric.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
