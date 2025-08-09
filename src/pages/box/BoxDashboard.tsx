
import React from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { DashboardCharts } from '@/components/box/DashboardCharts';
import { QuickActions } from '@/components/box/QuickActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Users, TrendingUp, Euro } from 'lucide-react';
import { Footer } from '@/components/Footer';

export const BoxDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Atletas Ativos',
      value: '142',
      change: '+12%',
      icon: Users,
    },
    {
      title: 'Aulas Hoje',
      value: '8',
      change: '+2',
      icon: Calendar,
    },
    {
      title: 'Receita Mensal',
      value: '€4,230',
      change: '+8%',
      icon: Euro,
    },
    {
      title: 'Taxa Crescimento',
      value: '15%',
      change: '+3%',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <BoxHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard da BOX</h1>
              <p className="text-muted-foreground mt-2">
                Visão geral da sua BOX
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-green-600 font-medium">
                      {stat.change} vs mês anterior
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gráficos de Performance</CardTitle>
                  <CardDescription>
                    Estatísticas da sua BOX
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DashboardCharts />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                  <CardDescription>
                    Funcionalidades mais utilizadas
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
