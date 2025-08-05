
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2,
  Users,
  TrendingUp,
  Euro,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export const DashboardMetrics: React.FC = () => {
  const metrics = [
    {
      title: 'Total de BOX',
      value: '147',
      change: '+12%',
      trend: 'up',
      icon: Building2,
      description: 'vs. mês anterior'
    },
    {
      title: 'Utilizadores Ativos',
      value: '12,543',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      description: 'últimos 30 dias'
    },
    {
      title: 'Receita Mensal',
      value: '€284,560',
      change: '+15.3%',
      trend: 'up',
      icon: Euro,
      description: 'vs. mês anterior'
    },
    {
      title: 'Taxa de Crescimento',
      value: '23.1%',
      change: '-2.1%',
      trend: 'down',
      icon: TrendingUp,
      description: 'crescimento anual'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title}>
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
            <div className="flex items-center space-x-2">
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
              <span className="text-xs text-muted-foreground">
                {metric.description}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
