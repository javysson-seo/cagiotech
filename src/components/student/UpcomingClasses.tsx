import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAthleteClasses } from '@/hooks/useAthleteClasses';
import { format, isToday, isTomorrow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const UpcomingClasses: React.FC = () => {
  const navigate = useNavigate();
  const { bookings, loading } = useAthleteClasses();

  const getDateLabel = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Hoje';
    if (isTomorrow(date)) return 'Amanhã';
    return format(date, "dd 'de' MMMM", { locale: ptBR });
  };

  if (loading) {
    return (
      <Card className="border-t-4 border-t-cagio-green">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Carregando aulas...</p>
        </CardContent>
      </Card>
    );
  }

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
        {bookings.length === 0 ? (
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
          bookings.map((booking) => {
            const cls = booking.classes;
            if (!cls) return null;

            return (
              <Card 
                key={booking.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4"
                style={{ borderLeftColor: cls.modalities?.color || 'var(--cagio-green)' }}
                onClick={() => navigate(`/student/bookings`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground">{cls.title}</h4>
                    <p className="text-sm text-muted-foreground">{cls.trainers?.name || 'Sem instrutor'}</p>
                  </div>
                  <Badge className="bg-cagio-green text-white">
                    {getDateLabel(cls.date)}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1 text-cagio-green" />
                    {cls.start_time?.substring(0, 5)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1 text-cagio-green" />
                    {cls.rooms?.name || 'Não definido'}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-1 text-cagio-green" />
                    <span className="font-medium">{cls.current_bookings}/{cls.max_capacity}</span>
                    <span className="text-muted-foreground ml-1">vagas</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};
