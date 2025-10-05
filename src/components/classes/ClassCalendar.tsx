
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useClasses } from '@/hooks/useClasses';

interface ClassCalendarProps {
  onEdit: (classData: any) => void;
}

export const ClassCalendar: React.FC<ClassCalendarProps> = ({ onEdit }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const { classes } = useClasses();

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getClassesForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return classes.filter(classItem => classItem.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const getDayClasses = (date: Date) => {
    const dayClasses = getClassesForDate(date);
    return dayClasses.length > 0 ? dayClasses : [];
  };

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {format(currentDate, 'MMMM yyyy', { locale: pt })}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => {
              const dayClasses = getDayClasses(day);
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isCurrentMonth = isSameMonth(day, currentDate);
              
              return (
                <div
                  key={day.toISOString()}
                  className={`
                    min-h-[100px] p-2 border rounded cursor-pointer transition-colors
                    ${isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}
                    ${!isCurrentMonth ? 'opacity-50' : ''}
                  `}
                  onClick={() => setSelectedDate(day)}
                >
                  <div className="text-sm font-medium mb-1">
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayClasses.slice(0, 2).map(classItem => (
                      <div
                        key={classItem.id}
                        className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: classItem.modality?.color + '20', color: classItem.modality?.color || '#3B82F6' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(classItem);
                        }}
                      >
                        <div className="font-medium truncate">{classItem.title}</div>
                        <div className="opacity-75">
                          {classItem.start_time}
                        </div>
                      </div>
                    ))}
                    
                    {dayClasses.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayClasses.length - 2} mais
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Details */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>
              Aulas de {format(selectedDate, 'dd/MM/yyyy', { locale: pt })}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {getClassesForDate(selectedDate).length > 0 ? (
              <div className="space-y-4">
                {getClassesForDate(selectedDate).map(classItem => (
                  <div
                    key={classItem.id}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onEdit(classItem)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: classItem.modality?.color || '#3B82F6' }}
                        />
                        <h4 className="font-medium">{classItem.title}</h4>
                        <Badge variant="outline">{classItem.modality?.name}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {classItem.start_time} - {classItem.end_time}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{classItem.current_bookings || 0}/{classItem.max_capacity}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{classItem.room?.name || 'Não definido'}</span>
                      </div>
                      
                      <div>
                        <span className="font-medium">{classItem.trainer?.name || 'Não definido'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma aula agendada para este dia.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
