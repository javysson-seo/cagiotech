import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UpcomingClasses: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - substituir por dados reais
  const upcomingClasses = [
    {
      id: '1',
      name: 'CrossFit WOD',
      time: '18:00',
      date: 'Hoje',
      trainer: 'João Silva',
      room: 'Sala Principal',
      spots: 3,
      maxSpots: 15,
      color: 'cagio-green'
    },
    {
      id: '2',
      name: 'Yoga Flow',
      time: '19:30',
      date: 'Amanhã',
      trainer: 'Maria Santos',
      room: 'Sala 2',
      spots: 8,
      maxSpots: 12,
      color: 'blue-500'
    }
  ];

  return (
    <Card className="border-t-4 border-t-cagio-green">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg sm:text-xl text-cagio-green">Próximas Aulas</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/student/bookings')}
          className="text-cagio-green hover:bg-cagio-green-light"
        >
          Ver todas
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingClasses.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">Nenhuma aula reservada</p>
            <Button 
              onClick={() => navigate('/student/bookings')}
              className="bg-cagio-green hover:bg-cagio-green-dark text-white"
            >
              Reservar Aula
            </Button>
          </div>
        ) : (
          upcomingClasses.map((cls) => (
            <Card 
              key={cls.id} 
              className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4"
              style={{ borderLeftColor: `var(--${cls.color})` }}
              onClick={() => navigate(`/student/bookings/${cls.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-foreground">{cls.name}</h4>
                  <p className="text-sm text-muted-foreground">{cls.trainer}</p>
                </div>
                <Badge className="bg-cagio-green text-white">
                  {cls.date}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-1 text-cagio-green" />
                  {cls.time}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1 text-cagio-green" />
                  {cls.room}
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-1 text-cagio-green" />
                  <span className="font-medium">{cls.spots}/{cls.maxSpots}</span>
                  <span className="text-muted-foreground ml-1">vagas</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
