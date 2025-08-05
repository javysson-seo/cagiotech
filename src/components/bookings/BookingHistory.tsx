
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  History, 
  Search,
  Calendar, 
  Clock, 
  MapPin,
  Star,
  RotateCcw
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

export const BookingHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - em produção virá da API/Supabase
  const bookingHistory = [
    {
      id: 1,
      classTitle: 'CrossFit Morning',
      trainer: 'Carlos Santos',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      modality: 'CrossFit',
      modalityColor: '#3B82F6',
      date: '2024-01-14T06:00:00',
      location: 'Sala Principal',
      status: 'completed',
      rating: 5,
      points: 50,
      canRebook: true
    },
    {
      id: 2,
      classTitle: 'Yoga Flow',
      trainer: 'Ana Costa',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      modality: 'Yoga',
      modalityColor: '#10B981',
      date: '2024-01-13T07:30:00',
      location: 'Sala de Yoga',
      status: 'completed',
      rating: 4,
      points: 50,
      canRebook: true
    },
    {
      id: 3,
      classTitle: 'Functional Training',
      trainer: 'Pedro Silva',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      modality: 'Functional',
      modalityColor: '#F59E0B',
      date: '2024-01-12T09:00:00',
      location: 'Área Externa',
      status: 'no_show',
      rating: null,
      points: 0,
      canRebook: true
    },
    {
      id: 4,
      classTitle: 'Pilates Clássico',
      trainer: 'Ana Costa',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      modality: 'Pilates',
      modalityColor: '#8B5CF6',
      date: '2024-01-11T08:00:00',
      location: 'Estúdio Pilates',
      status: 'cancelled',
      rating: null,
      points: 0,
      canRebook: true
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluída</Badge>;
      case 'no_show':
        return <Badge className="bg-red-100 text-red-800">Falta</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredHistory = bookingHistory.filter(booking => {
    const matchesSearch = 
      booking.classTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.modality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleRebook = (bookingId: number) => {
    console.log('Rebooking class:', bookingId);
    // Implementar lógica de nova reserva
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Histórico de Reservas
        </CardTitle>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar no histórico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="all">Todos os Status</option>
            <option value="completed">Concluídas</option>
            <option value="no_show">Faltas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredHistory.map((booking) => (
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
                
                <div className="flex items-center space-x-2">
                  {getStatusBadge(booking.status)}
                  {booking.points > 0 && (
                    <Badge variant="outline" className="text-xs">
                      +{booking.points} pts
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={booking.trainerAvatar} alt={booking.trainer} />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                    {booking.trainer.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{booking.trainer}</span>
                
                {booking.rating && (
                  <div className="flex items-center space-x-1 ml-auto">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">{booking.rating}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{format(parseISO(booking.date), 'dd/MM/yyyy HH:mm', { locale: pt })}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <span>{booking.location}</span>
                </div>
              </div>

              {booking.canRebook && (
                <div className="flex justify-end">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleRebook(booking.id)}
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reservar Novamente
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma reserva encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
