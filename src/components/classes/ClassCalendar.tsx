
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Clock, 
  Edit, 
  Copy, 
  Trash2,
  Plus
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ClassCalendarProps {
  onEditClass: (classData: any) => void;
  onNewClass: () => void;
}

export const ClassCalendar: React.FC<ClassCalendarProps> = ({
  onEditClass,
  onNewClass,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  // Mock data - em produção virá da API/Supabase
  const classes = [
    {
      id: 1,
      title: 'CrossFit',
      trainer: 'Carlos Santos',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      startTime: '2024-01-15T06:00:00',
      endTime: '2024-01-15T07:00:00',
      capacity: 20,
      booked: 12,
      color: 'bg-blue-500',
      modality: 'CrossFit'
    },
    {
      id: 2,
      title: 'Yoga Flow',
      trainer: 'Ana Costa',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      startTime: '2024-01-15T07:30:00',
      endTime: '2024-01-15T08:30:00',
      capacity: 15,
      booked: 8,
      color: 'bg-green-500',
      modality: 'Yoga'
    },
    {
      id: 3,
      title: 'Functional Training',
      trainer: 'Pedro Silva',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      startTime: '2024-01-15T09:00:00',
      endTime: '2024-01-15T10:00:00',
      capacity: 12,
      booked: 12,
      color: 'bg-orange-500',
      modality: 'Functional'
    },
    {
      id: 4,
      title: 'CrossFit',
      trainer: 'Carlos Santos',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      startTime: '2024-01-15T18:00:00',
      endTime: '2024-01-15T19:00:00',
      capacity: 20,
      booked: 18,
      color: 'bg-blue-500',
      modality: 'CrossFit'
    },
    // Adicionar mais aulas para outros dias...
    {
      id: 5,
      title: 'Pilates',
      trainer: 'Ana Costa',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      startTime: '2024-01-16T08:00:00',
      endTime: '2024-01-16T09:00:00',
      capacity: 10,
      booked: 6,
      color: 'bg-purple-500',
      modality: 'Pilates'
    }
  ];

  const timeSlots = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getClassesForDate = (date: Date) => {
    return classes.filter(classItem => 
      isSameDay(parseISO(classItem.startTime), date)
    );
  };

  const getClassAtTime = (date: Date, time: string) => {
    const dateClasses = getClassesForDate(date);
    return dateClasses.find(classItem => {
      const startTime = format(parseISO(classItem.startTime), 'HH:mm');
      return startTime === time;
    });
  };

  const handlePreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const getOccupancyColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  if (viewMode === 'week') {
    const weekDays = getWeekDays();
    
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calendário Semanal</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setViewMode('day')}>
                Visão Diária
              </Button>
              <Button variant="ghost" size="sm" onClick={handlePreviousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">
                {format(weekDays[0], 'dd MMM', { locale: pt })} - {format(weekDays[6], 'dd MMM yyyy', { locale: pt })}
              </span>
              <Button variant="ghost" size="sm" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header com dias da semana */}
              <div className="grid grid-cols-8 gap-1 mb-2">
                <div className="p-2 text-sm font-medium">Horário</div>
                {weekDays.map((day) => (
                  <div key={day.toString()} className="p-2 text-center">
                    <div className="font-medium">
                      {format(day, 'EEE', { locale: pt })}
                    </div>
                    <div className="text-lg">
                      {format(day, 'dd')}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Grid de horários */}
              <div className="space-y-1">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-1">
                    <div className="p-2 text-sm text-muted-foreground border-r">
                      {time}
                    </div>
                    {weekDays.map((day) => {
                      const classAtTime = getClassAtTime(day, time);
                      
                      return (
                        <div key={`${day}-${time}`} className="min-h-[60px] border border-border/50 rounded">
                          {classAtTime && (
                            <div 
                              className={`p-2 rounded m-1 text-white text-xs cursor-pointer ${classAtTime.color} hover:opacity-80`}
                              onClick={() => onEditClass(classAtTime)}
                            >
                              <div className="font-medium truncate">{classAtTime.title}</div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="truncate">{classAtTime.trainer}</span>
                                <span className="ml-1">
                                  {classAtTime.booked}/{classAtTime.capacity}
                                </span>
                              </div>
                            </div>
                          )}
                          {!classAtTime && (
                            <div 
                              className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
                              onClick={onNewClass}
                            >
                              <Plus className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Day view implementation would go here
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visão Diária</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Visão diária em desenvolvimento...</p>
      </CardContent>
    </Card>
  );
};
