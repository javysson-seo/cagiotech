
import React from 'react';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { ProgressStats } from '@/components/student/ProgressStats';
import { RecentActivity } from '@/components/student/RecentActivity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Target, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const StudentDashboard: React.FC = () => {
  const quickStats = [
    {
      title: 'Aulas Este Mês',
      value: '12',
      icon: Calendar,
      color: 'text-blue-600',
    },
    {
      title: 'Próxima Aula',
      value: '2h 30m',
      icon: Clock,
      color: 'text-green-600',
    },
    {
      title: 'Objetivos Ativos',
      value: '3',
      icon: Target,
      color: 'text-orange-600',
    },
    {
      title: 'Conquistas',
      value: '8',
      icon: Trophy,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Meu Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                  Acompanhe seu progresso e próximas atividades
                </p>
              </div>
              <Button className="mt-4 sm:mt-0">
                Reservar Aula
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickStats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Meu Progresso</CardTitle>
                  <CardDescription>
                    Estatísticas dos últimos 30 dias
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressStats />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>
                    Suas últimas ações na plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivity />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
