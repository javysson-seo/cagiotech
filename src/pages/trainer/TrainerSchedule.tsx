
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrainerSidebar } from '@/components/trainer/TrainerSidebar';
import { TrainerHeader } from '@/components/trainer/TrainerHeader';
import { Calendar, Clock, Users, Plus, Filter } from 'lucide-react';

export const TrainerSchedule: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('today');

  // Mock schedule data
  const scheduleData = {
    today: [
      {
        id: 1,
        time: '08:00 - 09:00',
        class: 'CrossFit Iniciantes',
        students: 12,
        maxStudents: 15,
        status: 'confirmed'
      },
      {
        id: 2,
        time: '10:00 - 11:00',
        class: 'Functional Training',
        students: 8,
        maxStudents: 12,
        status: 'confirmed'
      },
      {
        id: 3,
        time: '18:00 - 19:00',
        class: 'CrossFit Avançado',
        students: 10,
        maxStudents: 10,
        status: 'full'
      }
    ],
    week: [
      // Add weekly view data
    ]
  };

  const todayClasses = scheduleData.today;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'full':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'full':
        return 'Lotada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return 'Pendente';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <TrainerSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TrainerHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Agenda</h1>
                <p className="text-muted-foreground">Gerencie suas aulas e horários</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Aula
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aulas Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    2 confirmadas, 1 lotada
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alunos Hoje</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">30</div>
                  <p className="text-xs text-muted-foreground">
                    De 37 vagas disponíveis
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próxima Aula</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">08:00</div>
                  <p className="text-xs text-muted-foreground">
                    CrossFit Iniciantes
                  </p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="today" className="space-y-6">
              <TabsList>
                <TabsTrigger value="today">Hoje</TabsTrigger>
                <TabsTrigger value="week">Esta Semana</TabsTrigger>
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
              </TabsList>

              <TabsContent value="today">
                <div className="space-y-4">
                  {todayClasses.map((classItem) => (
                    <Card key={classItem.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold">{classItem.class}</h3>
                              <Badge className={getStatusColor(classItem.status)}>
                                {getStatusText(classItem.status)}
                              </Badge>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              {classItem.time}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Users className="h-4 w-4 mr-2" />
                              {classItem.students}/{classItem.maxStudents} alunos
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Ver Lista
                            </Button>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {todayClasses.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">Nenhuma aula hoje</h3>
                        <p className="text-muted-foreground mb-4">
                          Você não tem aulas agendadas para hoje
                        </p>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Agendar Aula
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="week">
                <Card>
                  <CardHeader>
                    <CardTitle>Visão Semanal</CardTitle>
                    <CardDescription>
                      Suas aulas desta semana
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-7 gap-4">
                      {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => (
                        <div key={day} className="text-center">
                          <h4 className="font-medium mb-2">{day}</h4>
                          <div className="space-y-2">
                            {index < 5 && (
                              <div className="p-2 bg-blue-50 rounded text-xs">
                                08:00 - CF Iniciantes
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="calendar">
                <Card>
                  <CardHeader>
                    <CardTitle>Calendário</CardTitle>
                    <CardDescription>
                      Vista completa do calendário
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                      Calendário interativo será implementado aqui
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
