
import React from 'react';
import { ResponsiveTrainerSidebar } from '@/components/trainer/ResponsiveTrainerSidebar';
import { TrainerHeader } from '@/components/trainer/TrainerHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  Clock,
  Target,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { Footer } from '@/components/Footer';

export const TrainerDashboard: React.FC = () => {
  const todayStats = [
    { label: 'Alunos Hoje', value: '12', icon: Users, color: 'text-blue-600' },
    { label: 'Aulas Ministradas', value: '8', icon: Calendar, color: 'text-primary' },
    { label: 'Próximas Aulas', value: '4', icon: Clock, color: 'text-orange-600' },
    { label: 'Mensagens', value: '3', icon: MessageSquare, color: 'text-purple-600' },
  ];

  const recentActivities = [
    { type: 'workout', student: 'João Silva', action: 'completou treino de peito', time: '2h atrás' },
    { type: 'message', student: 'Maria Santos', action: 'enviou mensagem', time: '3h atrás' },
    { type: 'progress', student: 'Pedro Costa', action: 'atualizou medidas', time: '5h atrás' },
    { type: 'booking', student: 'Ana Lima', action: 'agendou aula para amanhã', time: '1 dia atrás' },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <ResponsiveTrainerSidebar />
      
      <div className="flex-1 flex flex-col">
        <TrainerHeader />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Dashboard do Trainer</h1>
              <p className="text-muted-foreground">
                Acompanhe seu desempenho e gerencie seus alunos
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {todayStats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                      <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Agenda de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: '09:00', student: 'João Silva', type: 'Personal Training' },
                      { time: '10:30', student: 'Maria Santos', type: 'Avaliação Física' },
                      { time: '14:00', student: 'Pedro Costa', type: 'Personal Training' },
                      { time: '16:00', student: 'Ana Lima', type: 'Consulta Nutricional' },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline">{session.time}</Badge>
                          <div>
                            <p className="font-medium">{session.student}</p>
                            <p className="text-sm text-muted-foreground">{session.type}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Iniciar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Atividades Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.student}</span>{' '}
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col items-center gap-2">
                    <Users className="h-6 w-6" />
                    <span>Novo Aluno</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    <span>Agendar Aula</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                    <Target className="h-6 w-6" />
                    <span>Criar Treino</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    <span>Ver Relatórios</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
