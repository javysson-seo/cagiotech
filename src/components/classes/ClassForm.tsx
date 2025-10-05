
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Save, Clock, Users, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useModalities } from '@/hooks/useModalities';
import { useRooms } from '@/hooks/useRooms';
import { useTrainers } from '@/hooks/useTrainers';
import { useClasses } from '@/hooks/useClasses';

interface ClassFormProps {
  classData?: any;
  onClose: () => void;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  classData,
  onClose,
}) => {
  const { modalities, loading: loadingModalities } = useModalities();
  const { rooms, loading: loadingRooms } = useRooms();
  const { trainers, loading: loadingTrainers } = useTrainers();
  const { saveClass } = useClasses();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    modality_id: '',
    trainer_id: '',
    room_id: '',
    date: '',
    start_time: '',
    end_time: '',
    max_capacity: 20,
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    if (classData) {
      setFormData({
        title: classData.title || '',
        description: classData.description || '',
        modality_id: classData.modality_id || '',
        trainer_id: classData.trainer_id || '',
        room_id: classData.room_id || '',
        date: classData.date || '',
        start_time: classData.start_time || '',
        end_time: classData.end_time || '',
        max_capacity: classData.max_capacity || 20,
        status: classData.status || 'scheduled',
        notes: classData.notes || ''
      });
    }
  }, [classData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.modality_id || !formData.date || !formData.start_time || !formData.end_time) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const success = await saveClass({
      ...formData,
      id: classData?.id
    });
    
    if (success) {
      onClose();
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {classData ? 'Editar Aula' : 'Nova Aula'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título da Aula *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="Ex: CrossFit Morning"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade *</Label>
                <Select value={formData.modality_id} onValueChange={(value) => updateField('modality_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingModalities ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : modalities.filter(m => m.is_active).map(modality => (
                      <SelectItem key={modality.id} value={modality.id!}>
                        {modality.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Descrição da aula..."
                rows={3}
              />
            </div>
          </div>

          {/* Trainer e Local */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Trainer e Local
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainer">Trainer</Label>
                <Select value={formData.trainer_id} onValueChange={(value) => updateField('trainer_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingTrainers ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : trainers.filter(t => t.status === 'active').map(trainer => (
                      <SelectItem key={trainer.id} value={trainer.id!}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room">Sala</Label>
                <Select value={formData.room_id} onValueChange={(value) => updateField('room_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar sala" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingRooms ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : rooms.filter(r => r.is_active).map(room => (
                      <SelectItem key={room.id} value={room.id!}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Horário */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Horário
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start_time">Hora Início *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => updateField('start_time', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_time">Hora Fim *</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => updateField('end_time', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Capacidade */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Capacidade
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="max_capacity">Capacidade Máxima</Label>
              <Input
                id="max_capacity"
                type="number"
                value={formData.max_capacity}
                onChange={(e) => updateField('max_capacity', parseInt(e.target.value))}
                min="1"
              />
            </div>
          </div>

          {/* Status e Notas */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Status e Observações</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                    <SelectItem value="completed">Concluída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  placeholder="Observações sobre a aula..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-cagiogreen-500 hover:bg-cagiogreen-600">
              <Save className="h-4 w-4 mr-2" />
              {classData ? 'Atualizar' : 'Criar'} Aula
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
