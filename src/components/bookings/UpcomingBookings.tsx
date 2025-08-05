
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  X,
  CheckCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

export const UpcomingBookings: React.FC = () => {
  // Mock data - em produção virá da API/Supabase
  const upcomingBookings = [
    {
      id: 1,
      classTitle: 'CrossFit Morning',
      trainer: 'Carlos Santos',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      modality: 'CrossFit',
      modalityColor: '#3B82F6',
      startTime: '2024-01-15T06:00:00',
      endTime: '2024-01-15T07:00:00',
      location: 'Sala Principal',
      status: 'confirmed',
      canCancel: true,
      checkedIn: false
    },
    {
      id: 2,
      classTitle: 'Yoga Flow',
      trainer: 'Ana Costa',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      modality: 'Yoga',
      modalityColor: '#10B981',
      startTime: '2024-01-16T07:30:00',
      endTime: '2024-01-16T08:30:00',
      location: 'Sala de Yoga',
      status: 'confirmed',
      canCancel: true,
      checkedIn: false
    },
    {
      id: 3,
      classTitle: 'Functional Training',
      trainer: 'Pedro Silva',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      modality: 'Functional',
      modalityColor: '#F59E0B',
      startTime: '2024-01-17T09:00:00',
      endTime: '2024-01-17T10:00:00',
      location: 'Área Externa',
      status: 'waitlist',
      canCancel: true,
      checkedIn: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800">Confirmada</Badge>;
      case 'waitlist':
        return <Badge className="bg-orange-100 text-orange-800">Lista de Espera</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleCancelBooking = (bookingId: number) => {
    console.log('Cancelling booking:', bookingId);
    // Implementar lógica de cancelamento
  };

  const handleCheckIn = (bookingId: number) => {
    console.log('Check-in for booking:', bookingId);
    // Implementar lógica de check-in
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          Próximas Aulas ({upcomingBookings.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {upcomingBookings.map((booking) => (
          <div key={booking.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: booking.modalityColor }}
                />
                <div>
                  <h4 className="font-medium">{booking.classTitle}</h4>
                  <Badge variant="outline" className="text-xs mt-1">
                    {booking.modality}
                  </Badge>
                </div>
              </div>
              
              {getStatusBadge(booking.status)}
            </div>

            <div className="flex items-center space-x-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={booking.trainerAvatar} alt={booking.trainer} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {booking.trainer.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{booking.trainer}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>{format(parseISO(booking.startTime), 'dd/MM/yyyy', { locale: pt })}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span>
                  {format(parseISO(booking.startTime), 'HH:mm')} - {format(parseISO(booking.endTime), 'HH:mm')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                <span>{booking.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {!booking.checkedIn && booking.status === 'confirmed' && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCheckIn(booking.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Check-in
                  </Button>
                )}
              </div>
              
              {booking.canCancel && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleCancelBooking(booking.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancelar
                </Button>
              )}
            </div>
          </div>
        ))}

        {upcomingBookings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Não tem aulas reservadas</p>
            <p className="text-sm">Reserve uma aula para aparecer aqui</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
