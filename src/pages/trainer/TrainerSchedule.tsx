
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrainerSidebar } from '@/components/trainer/TrainerSidebar';
import { TrainerHeader } from '@/components/trainer/TrainerHeader';
import { Calendar, Clock, Users, Plus, Edit, X } from 'lucide-react';

export const TrainerSchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  // Mock schedule data
  const scheduleData = [
    {
      id: 1,
      title: 'CrossFit WOD',
      time: '07:00 - 08:00',
      participants: 15,
      maxParticipants: 18,
      type: 'group',
      status: 'confirmed'
    },
    {
      id: 2,
      title: 'Personal Training',
      time: '10:00 - 11:00',
      participants: 1,
      maxParticipants: 1,
      type: 'personal',
      status: 'confirmed',
      client: 'João Silva'
    },
    {
      id: 3,
      title: 'Functional Training',
      time: '19:00 - 20:00',
      participants: 12,
      maxParticipants: 15,
      type: 'group',
      status: 'available'
    }
  ];

  const weekDays = [
    'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
  ];

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00'
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
                <h1 className="text-3xl font-bold text-foreground">Horário</h1>
                <p className="text-muted-foreground">Gerir as suas aulas e disponibilidade</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === 'week' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('week')}
                    className="rounded-r-none border-r-0"
                  >
                    Semana
                  </Button>
                  <Button
                    variant={viewMode === 'day' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('day')}
                    className="rounded-l-none"
                  >
                    Dia
                  </Button>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Aula
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Aulas Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">3 confirmadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Participantes</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">Inscritos hoje</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78%</div>
                  <p className="text-xs text-muted-foreground">Média semanal</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Próxima Aula</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">07:00</div>
                  <p className="text-xs text-muted-foreground">CrossFit WOD</p>
                </CardContent>
              </Card>
            </div>

            {/* Schedule Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Horário da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'week' ? (
                  <div className="overflow-x-auto">
                    <div className="grid grid-cols-8 gap-2 min-w-[800px]">
                      {/* Header */}
                      <div className="p-2 text-sm font-medium text-center">Hora</div>
                      {weekDays.map(day => (
                        <div key={day} className="p-2 text-sm font-medium text-center border-b">
                          {day}
                        </div>
                      ))}
                      
                      {/* Time slots */}
                      {timeSlots.map(time => (
                        <React.Fragment key={time}>
                          <div className="p-2 text-xs text-muted-foreground text-right border-r">
                            {time}
                          </div>
                          {weekDays.map((day, dayIndex) => (
                            <div 
                              key={`${time}-${day}`} 
                              className="p-1 border border-border/50 min-h-[60px] hover:bg-muted/20 cursor-pointer"
                            >
                              {/* Show classes for Monday as example */}
                              {dayIndex === 0 && time === '07:00' && (
                                <div className="bg-blue-100 border border-blue-200 rounded p-1 text-xs">
                                  <div className="font-medium text-blue-800">CrossFit WOD</div>
                                  <div className="text-blue-600">15/18</div>
                                </div>
                              )}
                              {dayIndex === 0 && time === '19:00' && (
                                <div className="bg-green-100 border border-green-200 rounded p-1 text-xs">
                                  <div className="font-medium text-green-800">Functional</div>
                                  <div className="text-green-600">12/15</div>
                                </div>
                              )}
                            </div>
                          ))}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ) : (
                  // Day view
                  <div className="space-y-3">
                    {scheduleData.map(class_ => (
                      <div 
                        key={class_.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/20"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-sm font-medium">{class_.time}</div>
                          <div>
                            <div className="font-medium">{class_.title}</div>
                            {class_.client && (
                              <div className="text-sm text-muted-foreground">{class_.client}</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <div className="text-sm">
                            {class_.participants}/{class_.maxParticipants}
                          </div>
                          
                          <Badge 
                            variant={class_.status === 'confirmed' ? 'default' : 'secondary'}
                          >
                            {class_.status === 'confirmed' ? 'Confirmada' : 'Disponível'}
                          </Badge>
                          
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Classes */}
            <Card>
              <CardHeader>
                <CardTitle>Próximas Aulas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduleData.slice(0, 3).map(class_ => (
                    <div 
                      key={class_.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <div className="font-medium">{class_.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Hoje às {class_.time.split(' - ')[0]}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          {class_.participants} inscritos
                        </Badge>
                        <Button size="sm" variant="outline">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
