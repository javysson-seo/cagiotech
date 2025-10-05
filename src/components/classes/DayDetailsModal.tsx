import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, MapPin, User, Plus, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | null;
  classes: any[];
  onEditClass: (classData: any) => void;
  onAddClass: () => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  classes,
  onEditClass,
  onAddClass,
}) => {
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  const toggleClassExpansion = (classId: string) => {
    setExpandedClass(expandedClass === classId ? null : classId);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: any }> = {
      scheduled: { label: 'Agendada', variant: 'default' },
      in_progress: { label: 'Em Andamento', variant: 'default' },
      completed: { label: 'Concluída', variant: 'secondary' },
      cancelled: { label: 'Cancelada', variant: 'destructive' },
    };
    
    const config = variants[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getOccupancyColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {selectedDate ? format(selectedDate, "EEEE, dd 'de' MMMM", { locale: pt }) : ''}
              </DialogTitle>
              <DialogDescription>
                {classes.length} {classes.length === 1 ? 'aula agendada' : 'aulas agendadas'}
              </DialogDescription>
            </div>
            <Button onClick={onAddClass} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Aula
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {classes.length > 0 ? (
            classes.map((classItem) => (
              <Card key={classItem.id} className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Class Header */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleClassExpansion(classItem.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: classItem.modality?.color || 'hsl(var(--primary))' }}
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{classItem.title}</h3>
                          <p className="text-sm text-muted-foreground">{classItem.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(classItem.status || 'scheduled')}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClass(classItem);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.start_time} - {classItem.end_time}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Users className={`h-4 w-4 ${getOccupancyColor(classItem.current_bookings || 0, classItem.max_capacity)}`} />
                        <span className={getOccupancyColor(classItem.current_bookings || 0, classItem.max_capacity)}>
                          {classItem.current_bookings || 0}/{classItem.max_capacity}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.room?.name || 'Não definido'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{classItem.trainer?.name || 'Não definido'}</span>
                      </div>
                    </div>

                    <Badge variant="outline" className="mt-3">
                      {classItem.modality?.name}
                    </Badge>
                  </div>

                  {/* Expanded Details */}
                  {expandedClass === classItem.id && (
                    <>
                      <Separator />
                      <div className="p-4 bg-muted/20 space-y-4">
                        {/* Athletes Section */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium">Atletas Inscritos</h4>
                            <Button variant="outline" size="sm">
                              <Plus className="h-3 w-3 mr-1" />
                              Adicionar Atleta
                            </Button>
                          </div>
                          
                          <div className="space-y-2">
                            {classItem.current_bookings && classItem.current_bookings > 0 ? (
                              <p className="text-sm text-muted-foreground">
                                {classItem.current_bookings} {classItem.current_bookings === 1 ? 'atleta inscrito' : 'atletas inscritos'}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Nenhum atleta inscrito ainda
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Trainer Details */}
                        {classItem.trainer && (
                          <div>
                            <h4 className="font-medium mb-2">Personal Trainer</h4>
                            <div className="flex items-center space-x-3 p-3 bg-background rounded-lg border">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{classItem.trainer.name}</p>
                                <p className="text-sm text-muted-foreground">Personal Trainer</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {classItem.notes && (
                          <div>
                            <h4 className="font-medium mb-2">Observações</h4>
                            <p className="text-sm text-muted-foreground p-3 bg-background rounded-lg border">
                              {classItem.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhuma aula agendada para este dia
              </p>
              <Button onClick={onAddClass}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Aula
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
