
import React, { useState } from 'react';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkoutTimer } from '@/components/student/WorkoutTimer';
import { RecentActivity } from '@/components/student/RecentActivity';
import { 
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Book,
  Users,
  Award,
  Activity,
  Timer,
  Play
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                  Bem-vindo de volta! Acompanhe seu progresso e treinos.
                </p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="timer">Cronômetro</TabsTrigger>
                <TabsTrigger value="progress">Progresso</TabsTrigger>
                <TabsTrigger value="activity">Atividades</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Treinos Este Mês</p>
                          <p className="text-3xl font-bold">12</p>
                        </div>
                        <Calendar className="h-8 w-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">Tempo Total</p>
                          <p className="text-3xl font-bold">24h</p>
                        </div>
                        <Clock className="h-8 w-8 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">Meta do Mês</p>
                          <p className="text-3xl font-bold">85%</p>
                        </div>
                        <Target className="h-8 w-8 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100">Progresso</p>
                          <p className="text-3xl font-bold">+5%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Today's Workout */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Book className="h-5 w-5 mr-2" />
                      Treino de Hoje
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <h3 className="font-semibold">Treino A - Peito, Ombro, Tríceps</h3>
                          <p className="text-sm text-muted-foreground">Duração estimada: 60-75 min</p>
                        </div>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar Treino
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Exercícios</p>
                          <p className="text-lg font-semibold">8</p>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Séries Totais</p>
                          <p className="text-lg font-semibold">24</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">Descanso</p>
                          <p className="text-lg font-semibold">60-90s</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                      <h3 className="font-semibold mb-2">Agendar Aula</h3>
                      <p className="text-sm text-muted-foreground">Marque sua próxima sessão</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Users className="h-12 w-12 mx-auto text-green-600 mb-4" />
                      <h3 className="font-semibold mb-2">Aulas em Grupo</h3>
                      <p className="text-sm text-muted-foreground">Veja aulas disponíveis</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Award className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                      <h3 className="font-semibold mb-2">Conquistas</h3>
                      <p className="text-sm text-muted-foreground">Veja suas medalhas</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="timer">
                <WorkoutTimer />
              </TabsContent>

              <TabsContent value="progress" className="space-y-6">
                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Activity className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-muted-foreground">Força</p>
                          <p className="text-2xl font-bold">+15%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Timer className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-muted-foreground">Resistência</p>
                          <p className="text-2xl font-bold">+22%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Target className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-muted-foreground">Flexibilidade</p>
                          <p className="text-2xl font-bold">+8%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-orange-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-muted-foreground">Geral</p>
                          <p className="text-2xl font-bold">+18%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Progress Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução dos Últimos 3 Meses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Gráfico de progresso será exibido aqui</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="activity">
                <RecentActivity />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
