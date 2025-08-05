
import React from 'react';
import { TrainerSidebar } from '@/components/trainer/TrainerSidebar';
import { TrainerHeader } from '@/components/trainer/TrainerHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileText, 
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Plus,
  Eye
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

export const TrainerDashboard: React.FC = () => {
  const { canManageClasses, canViewAthleteDetails } = usePermissions();

  // Mock data - will come from API/Supabase
  const stats = {
    activeStudents: 18,
    todayClasses: 4,
    workoutPlans: 12,
    nutritionPlans: 8,
    rating: 4.9,
    totalEarnings: 2850
  };

  const todaySchedule = [
    { time: '09:00', class: 'CrossFit Strength', students: 8, duration: '60 min' },
    { time: '11:00', class: 'Functional Training', students: 6, duration: '45 min' },
    { time: '15:00', class: 'HIIT Session', students: 10, duration: '30 min' },
    { time: '17:00', class: 'Personal Training', students: 1, duration: '60 min' }
  ];

  const recentStudents = [
    { name: 'Maria Silva', lastClass: '2024-01-15', progress: 85, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria' },
    { name: 'João Santos', lastClass: '2024-01-15', progress: 72, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao' },
    { name: 'Ana Costa', lastClass: '2024-01-14', progress: 93, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana' }
  ];

  return (
    <div className="flex h-screen bg-background">
      <TrainerSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TrainerHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Bem-vindo de volta! Aqui está o resumo das suas atividades.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Aula
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Alunos Ativos</p>
                      <p className="text-2xl font-bold">{stats.activeStudents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Aulas Hoje</p>
                      <p className="text-2xl font-bold">{stats.todayClasses}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Planos Treino</p>
                      <p className="text-2xl font-bold">{stats.workoutPlans}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Planos Nutrição</p>
                      <p className="text-2xl font-bold">{stats.nutritionPlans}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Avaliação</p>
                      <p className="text-2xl font-bold">{stats.rating}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-emerald-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Ganhos (€)</p>
                      <p className="text-2xl font-bold">{stats.totalEarnings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Agenda de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {todaySchedule.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-bold text-blue-600 min-w-[60px]">
                            {item.time}
                          </div>
                          <div>
                            <h4 className="font-medium">{item.class}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.students} alunos • {item.duration}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-green-600" />
                    Alunos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentStudents.map((student, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Última aula: {new Date(student.lastClass).toLocaleDateString()}
                          </p>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${student.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {canViewAthleteDetails && (
                    <Button variant="outline" className="w-full mt-4">
                      Ver Todos os Alunos
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Criar Plano de Treino</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <BookOpen className="h-6 w-6" />
                    <span className="text-sm">Plano Nutricional</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Calendar className="h-6 w-6" />
                    <span className="text-sm">Agendar Aula</span>
                  </Button>
                  
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                    <Users className="h-6 w-6" />
                    <span className="text-sm">Avaliar Aluno</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
