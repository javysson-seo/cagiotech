import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, MapPin, Edit, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useClasses } from '@/hooks/useClasses';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ClassListProps {
  searchTerm: string;
  modalityFilter: string;
  onEdit: (classData: any) => void;
}

export const ClassList: React.FC<ClassListProps> = ({
  searchTerm,
  modalityFilter,
  onEdit,
}) => {
  const { classes, deleteClass, loading } = useClasses();
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const filteredClasses = React.useMemo(() => {
    return classes.filter(classItem => {
      const matchesSearch = 
        classItem.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.trainer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesModality = 
        modalityFilter === 'all' || classItem.modality_id === modalityFilter;
      
      return matchesSearch && matchesModality;
    });
  }, [classes, searchTerm, modalityFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'default';
      case 'cancelled': return 'destructive';
      case 'completed': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Agendada';
      case 'cancelled': return 'Cancelada';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const getAvailabilityColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return 'text-destructive';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  const handleDeleteClass = async () => {
    if (deleteDialog) {
      await deleteClass(deleteDialog);
      setDeleteDialog(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Carregando aulas...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {filteredClasses.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">
                Nenhuma aula encontrada com os filtros aplicados.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredClasses.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: classItem.modality?.color || '#3B82F6' }}
                    />
                    <div>
                      <h3 className="text-xl font-semibold">{classItem.title}</h3>
                      {classItem.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {classItem.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{classItem.modality?.name}</Badge>
                    <Badge variant={getStatusColor(classItem.status)}>
                      {getStatusLabel(classItem.status)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {format(new Date(classItem.date), "dd 'de' MMMM", { locale: pt })}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {classItem.start_time} - {classItem.end_time}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className={`h-4 w-4 ${getAvailabilityColor(classItem.current_bookings || 0, classItem.max_capacity)}`} />
                    <span className={getAvailabilityColor(classItem.current_bookings || 0, classItem.max_capacity)}>
                      {classItem.current_bookings || 0}/{classItem.max_capacity} vagas
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.room?.name || 'Não definido'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Trainer: </span>
                      <span className="font-medium">{classItem.trainer?.name || 'Não definido'}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(classItem)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteDialog(classItem.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClass}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
