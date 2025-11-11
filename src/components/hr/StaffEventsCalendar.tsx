import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStaffEvents } from '@/hooks/useStaffEvents';
import { Plus, Calendar, MapPin, Trash2 } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { StaffEventModal } from './StaffEventModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

export const StaffEventsCalendar: React.FC = () => {
  const { events, loading, deleteEvent } = useStaffEvents();
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (loading) return <Loading />;

  const getEventTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      meeting: 'Reunião',
      training: 'Treinamento',
      celebration: 'Celebração',
      reminder: 'Lembrete'
    };
    return labels[type] || type;
  };

  const getEventTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      meeting: 'bg-blue-500',
      training: 'bg-green-500',
      celebration: 'bg-purple-500',
      reminder: 'bg-orange-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await deleteEvent(deleteId);
    setDeleteId(null);
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Eventos e Calendário</CardTitle>
          <Button onClick={() => setShowModal(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum evento agendado
              </p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getEventTypeBadge(event.event_type)}`} />
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline">{getEventTypeLabel(event.event_type)}</Badge>
                    </div>
                    
                    {event.description && (
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(event.start_date), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                      </div>
                      
                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </div>
                      )}
                    </div>

                    {event.staff_ids && event.staff_ids.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {event.staff_ids.length} colaborador(es) convidado(s)
                      </p>
                    )}
                  </div>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setDeleteId(event.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <StaffEventModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Evento</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este evento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
