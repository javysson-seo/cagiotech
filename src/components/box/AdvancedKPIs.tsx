
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
  Target,
  Activity,
  Clock,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface AdvancedKPIsProps {
  filters: {
    dateRange: any;
    trainer: string;
    modality: string;
    room: string;
  };
}

export const AdvancedKPIs: React.FC<AdvancedKPIsProps> = ({ filters }) => {
  // Mock data - em produção viria da API com base nos filtros
  const kpis = [
    {
      title: 'Receita Total',
      value: '€8,750',
      change: '+15.3%',
      trend: 'up' as const,
      icon: Euro,
      description: 'vs. período anterior',
      target: 10000,
      current: 8750,
      color: 'green'
    },
    {
      title: 'Membros Ativos',
      value: '147',
      change: '+8.2%',
      trend: 'up' as const,
      icon: Users,
      description: 'este período',
      target: 160,
      current: 147,
      color: 'blue'
    },
    {
      title: 'Taxa de Ocupação',
      value: '78%',
      change: '+5.1%',
      trend: 'up' as const,
      icon: Activity,
      description: 'média das salas',
      target: 85,
      current: 78,
      color: 'purple'
    },
    {
      title: 'Aulas Realizadas',
      value: '156',
      change: '+12.4%',
      trend: 'up' as const,
      icon: Calendar,
      description: 'este período',
      target: 180,
      current: 156,
      color: 'orange'
    },
    {
      title: 'Tempo Médio Sessão',
      value: '52min',
      change: '+3.2%',
      trend: 'up' as const,
      icon: Clock,
      description: 'por atleta',
      target: 60,
      current: 52,
      color: 'cyan'
    },
    {
      title: 'Satisfação Média',
      value: '4.7',
      change: '+0.2',
      trend: 'up' as const,
      icon: Star,
      description: 'avaliação aulas',
      target: 5.0,
      current: 4.7,
      color: 'yellow'
    },
    {
      title: 'Taxa Retenção',
      value: '94%',
      change: '-1.1%',
      trend: 'down' as const,
      icon: Target,
      description: 'últimos 3 meses',
      target: 95,
      current: 94,
      color: 'red'
    },
    {
      title: 'Revenue per User',
      value: '€59.5',
      change: '+7.8%',
      trend: 'up' as const,
      icon: TrendingUp,
      description: 'por membro ativo',
      target: 65,
      current: 59.5,
      color: 'emerald'
    }
  ];

  const detailedMetrics = [
    {
      category: 'Financeiro',
      metrics: [
        { name: 'MRR (Monthly Recurring Revenue)', value: '€6,450', change: '+12%' },
        { name: 'ARPU (Average Revenue Per User)', value: '€43.9', change: '+8%' },
        { name: 'Custos Operacionais', value: '€4,800', change: '+3%' },
        { name: 'Margem de Lucro', value: '45.2%', change: '+4%' }
      ]
    },
    {
      category: 'Operacional',
      metrics: [
        { name: 'Classes por Semana', value: '36', change: '+5%' },
        { name: 'Utilização Equipamentos', value: '67%', change: '+12%' },
        { name: 'Tempo Médio Check-in', value: '2.3min', change: '-15%' },
        { name: 'No-shows', value: '8.2%', change: '-3%' }
      ]
    },
    {
      category: 'Engagement',
      metrics: [
        { name: 'Frequência Semanal Média', value: '3.2', change: '+6%' },
        { name: 'NPS Score', value: '72', change: '+8%' },
        { name: 'App Engagement', value: '84%', change: '+11%' },
        { name: 'Participação Eventos', value: '45%', change: '+22%' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main KPIs Grid */}
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
                  {Math.round((kpi.current / kpi.target) * 100)}% do objetivo
                </Badge>
              </div>
              <div className="space-y-1">
                <Progress 
                  value={(kpi.current / kpi.target) * 100} 
                  className="h-2" 
                />
                <p className="text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-cagio-green"></div>
          </Card>
        ))}
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {detailedMetrics.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{section.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.metrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{metric.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className={`${
                        metric.change.startsWith('+') ? 'text-green-600' : 
                        metric.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change}
                      </span> vs. anterior
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{metric.value}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo de Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
              <p className="text-sm text-muted-foreground">Objetivos Atingidos</p>
              <Progress value={87} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">+23%</div>
              <p className="text-sm text-muted-foreground">Crescimento Geral</p>
              <Progress value={76} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">4.7/5</div>
              <p className="text-sm text-muted-foreground">Satisfação Média</p>
              <Progress value={94} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
