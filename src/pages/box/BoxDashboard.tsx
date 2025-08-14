
import React from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { DashboardCharts } from '@/components/box/DashboardCharts';
import { QuickActions } from '@/components/box/QuickActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, Euro, ArrowUp } from 'lucide-react';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';

const BoxDashboardContent: React.FC = () => {
  const stats = [
    {
      title: 'Atletas Ativos',
      value: '142',
      change: '+12%',
      trend: 'up',
      icon: Users,
      description: 'vs mês anterior'
    },
    {
      title: 'Aulas Hoje',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Calendar,
      description: 'vs anterior'
    },
    {
      title: 'Receita Mensal',
      value: '€4,230',
      change: '+8%',
      trend: 'up',
      icon: Euro,
      description: 'vs mês anterior'
    },
    {
      title: 'Taxa Crescimento',
      value: '15%',
      change: '+3%',
      trend: 'up',
      icon: TrendingUp,
      description: 'vs mês anterior'
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <BoxHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Dashboard da BOX</h1>
              <p className="text-muted-foreground mt-1">
                Visão geral da sua BOX
              </p>
            </div>

            {/* KPIs Cards - 4 cards horizontais conforme PRD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat) => (
                <Card key={stat.title} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-sm text-[#bed700]">
                        <ArrowUp className="h-3 w-3" />
                        <span className="font-medium">{stat.change}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {stat.description}
                      </span>
                    </div>
                  </CardContent>
                  {/* Accent bar */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#bed700]"></div>
                </Card>
              ))}
            </div>

            {/* Seção Principal - Split 70/30 conforme PRD */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Esquerda - Gráficos Performance (70%) */}
              <Card className="lg:col-span-7">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Gráficos de Performance</CardTitle>
                  <CardDescription>
                    Estatísticas da sua BOX
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <DashboardCharts />
                </CardContent>
              </Card>

              {/* Direita - Ações Rápidas (30%) */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Ações Rápidas</CardTitle>
                  <CardDescription>
                    Funcionalidades mais utilizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <QuickActions />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export const BoxDashboard: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxDashboardContent />
    </AreaThemeProvider>
  );
};
