import React from 'react';
import { ResponsiveStudentSidebar } from '@/components/student/ResponsiveStudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Footer } from '@/components/Footer';
import { 
  Dumbbell, 
  Clock, 
  Target, 
  Calendar,
  Play,
  CheckCircle2,
  BarChart3
} from 'lucide-react';

export const Workouts: React.FC = () => {
  const workouts = [
    {
      id: 1,
      name: 'Treino de Peito e Tríceps',
      trainer: 'João Silva',
      duration: '45 min',
      difficulty: 'Intermediário',
      status: 'pending',
      exercises: 8,
      scheduledDate: 'Hoje, 16:00'
    },
    {
      id: 2,
      name: 'Treino de Pernas',
      trainer: 'João Silva', 
      duration: '50 min',
      difficulty: 'Avançado',
      status: 'completed',
      exercises: 10,
      completedDate: 'Ontem'
    },
    {
      id: 3,
      name: 'Treino de Costa e Bíceps',
      trainer: 'João Silva',
      duration: '40 min', 
      difficulty: 'Intermediário',
      status: 'scheduled',
      exercises: 7,
      scheduledDate: 'Amanhã, 14:00'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { label: 'Concluído', variant: 'default' as const, color: 'text-green-600' };
      case 'pending':
        return { label: 'Pendente', variant: 'secondary' as const, color: 'text-orange-600' };
      case 'scheduled':
        return { label: 'Agendado', variant: 'outline' as const, color: 'text-blue-600' };
      default:
        return { label: 'Pendente', variant: 'secondary' as const, color: 'text-gray-600' };
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante':
        return 'text-green-600 bg-green-100';
      case 'Intermediário':
        return 'text-orange-600 bg-orange-100';
      case 'Avançado':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ResponsiveStudentSidebar />
      
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Meus Exercícios</h1>
              <p className="text-muted-foreground">
                Acompanhe seus treinos e exercícios personalizados
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Treinos Esta Semana</p>
                      <p className="text-xl font-bold">4</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Horas Treinadas</p>
                      <p className="text-xl font-bold">3.2h</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                      <p className="text-xl font-bold">85%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workouts List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5" />
                  Planos de Treino
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workouts.map((workout) => {
                    const statusBadge = getStatusBadge(workout.status);
                    
                    return (
                      <div key={workout.id} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Dumbbell className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">{workout.name}</h3>
                              <p className="text-sm text-muted-foreground">por {workout.trainer}</p>
                            </div>
                          </div>
                          <Badge variant={statusBadge.variant} className={statusBadge.color}>
                            {statusBadge.label}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{workout.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-muted-foreground" />
                            <span>{workout.exercises} exercícios</span>
                          </div>
                          <div>
                            <Badge className={getDifficultyColor(workout.difficulty)} variant="outline">
                              {workout.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{workout.scheduledDate || workout.completedDate}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {workout.status === 'pending' && (
                            <Button size="sm" className="flex items-center gap-2">
                              <Play className="h-4 w-4" />
                              Iniciar Treino
                            </Button>
                          )}
                          {workout.status === 'completed' && (
                            <Button size="sm" variant="outline" className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4" />
                              Ver Resultado
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    );
                  })}
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