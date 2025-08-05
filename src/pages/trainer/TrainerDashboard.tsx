
import React from 'react';
import { TrainerSidebar } from '@/components/trainer/TrainerSidebar';
import { TrainerHeader } from '@/components/trainer/TrainerHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, BookOpen, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const TrainerDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Alunos Ativos',
      value: '28',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Aulas Hoje',
      value: '5',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Planos Ativos',
      value: '15',
      icon: BookOpen,
      color: 'text-orange-600',
    },
    {
      title: 'Avaliações',
      value: '4.8',
      icon: Award,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <TrainerSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <TrainerHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard do Treinador</h1>
                <p className="text-muted-foreground mt-2">
                  Gerencie seus alunos e planos de treino
                </p>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0">
                <Button variant="outline">
                  Novo Plano
                </Button>
                <Button>
                  Adicionar Aluno
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
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
                  <CardTitle>Próximas Aulas</CardTitle>
                  <CardDescription>
                    Sua agenda de hoje
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">CrossFit Iniciantes</p>
                        <p className="text-sm text-muted-foreground">09:00 - 10:00</p>
                      </div>
                      <span className="text-sm font-medium">12 alunos</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium">Treino Funcional</p>
                        <p className="text-sm text-muted-foreground">18:00 - 19:00</p>
                      </div>
                      <span className="text-sm font-medium">8 alunos</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Alunos Recentes</CardTitle>
                  <CardDescription>
                    Últimas atividades dos seus alunos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">JS</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">João Silva</p>
                        <p className="text-xs text-muted-foreground">Completou treino há 2h</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-green-600">MS</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Maria Santos</p>
                        <p className="text-xs text-muted-foreground">Nova avaliação física</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
