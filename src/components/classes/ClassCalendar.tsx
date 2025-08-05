
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Plus, Clock, Users } from 'lucide-react';

interface ClassCalendarProps {
  onEditClass: (classData: any) => void;
  onNewClass: () => void;
}

export const ClassCalendar: React.FC<ClassCalendarProps> = ({
  onEditClass,
  onNewClass,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');

  // Mock class data
  const classes = [
    {
      id: 1,
      name: 'CrossFit Morning',
      time: '06:00',
      duration: 60,
      trainer: 'Carlos Santos',
      enrolled: 16,
      capacity: 20,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      name: 'Yoga Flow',
      time: '07:30',
      duration: 60,
      trainer: 'Ana Costa',
      enrolled: 12,
      capacity: 15,
      color: 'bg-purple-500'
    },
    {
      id: 3,
      name: 'HIIT',
      time: '18:00',
      duration: 45,
      trainer: 'Pedro Silva',
      enrolled: 23,
      capacity: 25,
      color: 'bg-red-500'
    }
  ];

  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = i + 6; // Start from 6 AM
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const navigateDay = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const formatDateRange = () => {
    if (viewMode === 'day') {
      return currentDate.toLocaleDateString('pt-PT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      const weekDates = getWeekDates();
      const start = weekDates[0].toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
      const end = weekDates[6].toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' });
      return `${start} - ${end}`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Calendário de Aulas</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'day' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('day')}
                className="rounded-r-none"
              >
                Dia
              </Button>
              <Button
                variant={viewMode === 'week' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
                className="rounded-l-none"
              >
                Semana
              </Button>
            </div>
            <Button onClick={onNewClass}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Aula
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => viewMode === 'week' ? navigateWeek('prev') : navigateDay('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-semibold">{formatDateRange()}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => viewMode === 'week' ? navigateWeek('next') : navigateDay('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentDate(new Date())}
          >
            Hoje
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'week' ? (
          <div className="grid grid-cols-8 gap-1">
            {/* Header row */}
            <div className="p-2"></div>
            {getWeekDates().map((date, index) => (
              <div key={index} className="p-2 text-center">
                <div className="text-xs font-medium text-muted-foreground">
                  {weekDays[index]}
                </div>
                <div className="text-sm font-semibold">
                  {date.getDate()}
                </div>
              </div>
            ))}
            
            {/* Time slots */}
            {timeSlots.map((time) => (
              <React.Fragment key={time}>
                <div className="p-2 text-xs text-muted-foreground text-right border-r">
                  {time}
                </div>
                {getWeekDates().map((date, dayIndex) => (
                  <div key={`${time}-${dayIndex}`} className="p-1 border-b border-r min-h-[60px] relative">
                    {/* Mock classes for demo - in real app would filter by date and time */}
                    {dayIndex === 1 && time === '06:00' && (
                      <div
                        className="absolute inset-1 bg-blue-500 text-white text-xs p-1 rounded cursor-pointer hover:bg-blue-600"
                        onClick={() => onEditClass(classes[0])}
                      >
                        <div className="font-medium truncate">CrossFit Morning</div>
                        <div className="flex items-center justify-between mt-1">
                          <span>Carlos</span>
                          <span>16/20</span>
                        </div>
                      </div>
                    )}
                    {dayIndex === 1 && time === '07:00' && (
                      <div
                        className="absolute inset-1 bg-purple-500 text-white text-xs p-1 rounded cursor-pointer hover:bg-purple-600"
                        onClick={() => onEditClass(classes[1])}
                      >
                        <div className="font-medium truncate">Yoga Flow</div>
                        <div className="flex items-center justify-between mt-1">
                          <span>Ana</span>
                          <span>12/15</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Day view */}
            <div className="space-y-2">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => onEditClass(classItem)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-foreground">{classItem.name}</h4>
                      <p className="text-sm text-muted-foreground">{classItem.trainer}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{classItem.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{classItem.enrolled}/{classItem.capacity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {classes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhuma aula agendada para hoje.</p>
                <Button onClick={onNewClass} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Agendar Aula
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
