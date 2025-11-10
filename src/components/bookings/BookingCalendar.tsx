
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users,
  MapPin,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

export const BookingCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Mock data - em produção virá da API/Supabase
  const classesForDate = [
    {
      id: 1,
      title: 'CrossFit Morning',
      trainer: 'Carlos Santos',
      time: '06:00 - 07:00',
      capacity: 20,
      booked: 12,
      location: 'Sala Principal',
      modality: 'CrossFit',
      modalityColor: '#3B82F6',
      price: 15,
      rating: 4.8,
      canBook: true
    },
    {
      id: 2,
      title: 'Yoga Flow',
      trainer: 'Ana Costa',
      time: '07:30 - 08:30',
      capacity: 15,
      booked: 8,
      location: 'Sala de Yoga',
      modality: 'Yoga',
      modalityColor: '#10B981',
      price: 12,
      rating: 4.9,
      canBook: true
    },
    {
      id: 3,
      title: 'Functional Training',
      trainer: 'Pedro Silva',
      time: '09:00 - 10:00',
      capacity: 12,
      booked: 12,
      location: 'Área Externa',
      modality: 'Functional',
      modalityColor: '#F59E0B',
      price: 18,
      rating: 4.7,
      canBook: false
    }
  ];

  const handleBookClass = (classId: number) => {
    console.log('Booking class:', classId);
    // Implementar lógica de reserva
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center text-base">
            <CalendarIcon className="h-4 w-4 mr-2" />
            Selecionar Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            captionLayout="dropdown"
          />
        </CardContent>
      </Card>

      {/* Classes for Selected Date */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              Aulas para {selectedDate ? format(selectedDate, 'dd/MM/yyyy', { locale: pt }) : 'Data Selecionada'}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {classesForDate.length > 0 ? (
              <div className="space-y-4">
                {classesForDate.map((classItem) => (
                  <div key={classItem.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: classItem.modalityColor }}
                        />
                        <div>
                          <h4 className="font-medium">{classItem.title}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {classItem.modality}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-medium">€{classItem.price}</p>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">{classItem.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm font-medium mb-2">Com {classItem.trainer}</p>

                    <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-green-600" />
                        <span>{classItem.time}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>{classItem.capacity - classItem.booked}/{classItem.capacity}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-purple-600" />
                        <span className="text-xs">{classItem.location}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      disabled={!classItem.canBook}
                      onClick={() => handleBookClass(classItem.id)}
                    >
                      {!classItem.canBook ? 'Aula Lotada' : 'Reservar Aula'}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Não há aulas disponíveis para esta data</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
