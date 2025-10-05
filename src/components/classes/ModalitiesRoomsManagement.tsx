import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useModalities } from '@/hooks/useModalities';
import { useRooms } from '@/hooks/useRooms';
import { ModalityForm } from './ModalityForm';
import { RoomForm } from './RoomForm';
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

export const ModalitiesRoomsManagement: React.FC = () => {
  const { modalities, saveModality, deleteModality, loading: loadingModalities } = useModalities();
  const { rooms, saveRoom, deleteRoom, loading: loadingRooms } = useRooms();
  
  const [showModalityForm, setShowModalityForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [selectedModality, setSelectedModality] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ type: 'modality' | 'room'; id: string } | null>(null);

  const handleEditModality = (modality: any) => {
    setSelectedModality(modality);
    setShowModalityForm(true);
  };

  const handleEditRoom = (room: any) => {
    setSelectedRoom(room);
    setShowRoomForm(true);
  };

  const handleDeleteModality = async () => {
    if (deleteDialog?.type === 'modality') {
      await deleteModality(deleteDialog.id);
      setDeleteDialog(null);
    }
  };

  const handleDeleteRoom = async () => {
    if (deleteDialog?.type === 'room') {
      await deleteRoom(deleteDialog.id);
      setDeleteDialog(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Modalidades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Modalidades
            </CardTitle>
            <Button 
              onClick={() => {
                setSelectedModality(null);
                setShowModalityForm(true);
              }}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Modalidade
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingModalities ? (
            <p className="text-muted-foreground text-center py-4">Carregando...</p>
          ) : modalities.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma modalidade cadastrada
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modalities.map(modality => (
                <div
                  key={modality.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: modality.color }}
                      />
                      <h4 className="font-medium">{modality.name}</h4>
                    </div>
                    <Badge variant={modality.is_active ? 'default' : 'secondary'}>
                      {modality.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  
                  {modality.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {modality.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{modality.duration_minutes} min</span>
                    <span>{modality.max_capacity} pessoas</span>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditModality(modality)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteDialog({ type: 'modality', id: modality.id! })}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Salas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Salas
            </CardTitle>
            <Button 
              onClick={() => {
                setSelectedRoom(null);
                setShowRoomForm(true);
              }}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Sala
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingRooms ? (
            <p className="text-muted-foreground text-center py-4">Carregando...</p>
          ) : rooms.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              Nenhuma sala cadastrada
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rooms.map(room => (
                <div
                  key={room.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{room.name}</h4>
                    <Badge variant={room.is_active ? 'default' : 'secondary'}>
                      {room.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  
                  {room.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {room.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>Capacidade: {room.capacity}</span>
                    {room.floor && <span>{room.floor}</span>}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditRoom(room)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteDialog({ type: 'room', id: room.id! })}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ModalityForm
        isOpen={showModalityForm}
        onClose={() => {
          setShowModalityForm(false);
          setSelectedModality(null);
        }}
        modality={selectedModality}
        onSave={async (data) => {
          await saveModality(data);
          setShowModalityForm(false);
          setSelectedModality(null);
        }}
      />

      <RoomForm
        isOpen={showRoomForm}
        onClose={() => {
          setShowRoomForm(false);
          setSelectedRoom(null);
        }}
        room={selectedRoom}
        onSave={async (data) => {
          await saveRoom(data);
          setShowRoomForm(false);
          setSelectedRoom(null);
        }}
      />

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta {deleteDialog?.type === 'modality' ? 'modalidade' : 'sala'}? 
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteDialog?.type === 'modality' ? handleDeleteModality : handleDeleteRoom}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
