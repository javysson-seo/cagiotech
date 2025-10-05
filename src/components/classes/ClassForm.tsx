import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Save, Clock, Users, AlertCircle, Info, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useModalities } from '@/hooks/useModalities';
import { useRooms } from '@/hooks/useRooms';
import { useTrainers } from '@/hooks/useTrainers';
import { useClasses } from '@/hooks/useClasses';
import { z } from 'zod';
import { format, parse, differenceInMinutes, isAfter, isBefore } from 'date-fns';
import { pt } from 'date-fns/locale';

// Validation schema
const classSchema = z.object({
  title: z.string()
    .trim()
    .min(3, { message: "O título deve ter no mínimo 3 caracteres" })
    .max(100, { message: "O título deve ter no máximo 100 caracteres" }),
  description: z.string()
    .max(500, { message: "A descrição deve ter no máximo 500 caracteres" })
    .optional(),
  modality_id: z.string()
    .min(1, { message: "Selecione uma modalidade" }),
  trainer_id: z.string().optional(),
  room_id: z.string().optional(),
  date: z.string()
    .min(1, { message: "Selecione uma data" }),
  start_time: z.string()
    .min(1, { message: "Selecione o horário de início" }),
  end_time: z.string()
    .min(1, { message: "Selecione o horário de fim" }),
  max_capacity: z.number()
    .min(1, { message: "Capacidade mínima é 1" })
    .max(100, { message: "Capacidade máxima é 100" }),
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']),
  notes: z.string()
    .max(1000, { message: "Observações devem ter no máximo 1000 caracteres" })
    .optional()
});

interface ClassFormProps {
  classData?: any;
  onClose: () => void;
}

interface ValidationError {
  field: string;
  message: string;
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
    status: 'scheduled' as const,
    notes: ''
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Selected room info
  const selectedRoom = useMemo(() => {
    return rooms.find(r => r.id === formData.room_id);
  }, [rooms, formData.room_id]);

  // Selected modality info
  const selectedModality = useMemo(() => {
    return modalities.find(m => m.id === formData.modality_id);
  }, [modalities, formData.modality_id]);

  // Calculate duration
  const duration = useMemo(() => {
    if (!formData.start_time || !formData.end_time) return null;
    
    try {
      const start = parse(formData.start_time, 'HH:mm', new Date());
      const end = parse(formData.end_time, 'HH:mm', new Date());
      const minutes = differenceInMinutes(end, start);
      
      if (minutes <= 0) return null;
      
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      
      return hours > 0 
        ? `${hours}h${mins > 0 ? ` ${mins}min` : ''}`
        : `${mins}min`;
    } catch {
      return null;
    }
  }, [formData.start_time, formData.end_time]);

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
    } else {
      const today = new Date().toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: today }));
    }
  }, [classData]);

  // Auto-populate capacity from room
  useEffect(() => {
    if (selectedRoom && !classData) {
      setFormData(prev => ({
        ...prev,
        max_capacity: selectedRoom.capacity
      }));
    }
  }, [selectedRoom, classData]);

  // Auto-populate duration from modality
  useEffect(() => {
    if (selectedModality?.duration_minutes && formData.start_time && !classData) {
      try {
        const start = parse(formData.start_time, 'HH:mm', new Date());
        const end = new Date(start.getTime() + selectedModality.duration_minutes * 60000);
        const endTime = format(end, 'HH:mm');
        setFormData(prev => ({ ...prev, end_time: endTime }));
      } catch (error) {
        console.error('Error calculating end time:', error);
      }
    }
  }, [selectedModality, formData.start_time, classData]);

  const validateForm = (): boolean => {
    const validationErrors: ValidationError[] = [];

    try {
      classSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          validationErrors.push({
            field: err.path[0] as string,
            message: err.message
          });
        });
      }
    }

    if (formData.start_time && formData.end_time) {
      try {
        const start = parse(formData.start_time, 'HH:mm', new Date());
        const end = parse(formData.end_time, 'HH:mm', new Date());
        
        if (!isAfter(end, start)) {
          validationErrors.push({
            field: 'end_time',
            message: 'O horário de fim deve ser após o horário de início'
          });
        }
      } catch (error) {
        validationErrors.push({
          field: 'time',
          message: 'Horários inválidos'
        });
      }
    }

    if (!classData && formData.date) {
      const selectedDate = new Date(formData.date + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (isBefore(selectedDate, today)) {
        validationErrors.push({
          field: 'date',
          message: 'A data não pode ser no passado'
        });
      }
    }

    if (selectedRoom && formData.max_capacity > selectedRoom.capacity) {
      validationErrors.push({
        field: 'max_capacity',
        message: `Capacidade não pode exceder ${selectedRoom.capacity} (capacidade da sala)`
      });
    }

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await saveClass({
        ...formData,
        id: classData?.id
      });
      
      if (success) {
        toast.success(classData ? 'Aula atualizada com sucesso!' : 'Aula criada com sucesso!');
        onClose();
      }
    } catch (error) {
      console.error('Error saving class:', error);
      toast.error('Erro ao salvar aula');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => prev.filter(err => err.field !== field));
  };

  const getFieldError = (field: string) => {
    return errors.find(err => err.field === field)?.message;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              {classData ? 'Editar Aula' : 'Nova Aula'}
            </CardTitle>
            {classData && (
              <p className="text-sm text-muted-foreground mt-1">
                ID: {classData.id?.slice(0, 8)}...
              </p>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {errors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

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
                  disabled={isSubmitting}
                  className={getFieldError('title') ? 'border-destructive' : ''}
                />
                {getFieldError('title') && (
                  <p className="text-sm text-destructive">{getFieldError('title')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade *</Label>
                <Select 
                  value={formData.modality_id} 
                  onValueChange={(value) => updateField('modality_id', value)}
                  disabled={isSubmitting || loadingModalities}
                >
                  <SelectTrigger className={getFieldError('modality_id') ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Selecionar modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingModalities ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : modalities.filter(m => m.is_active).length === 0 ? (
                      <SelectItem value="empty" disabled>Nenhuma modalidade ativa</SelectItem>
                    ) : (
                      modalities.filter(m => m.is_active).map(modality => (
                        <SelectItem key={modality.id} value={modality.id!}>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: modality.color || 'hsl(var(--primary))' }}
                            />
                            {modality.name}
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {getFieldError('modality_id') && (
                  <p className="text-sm text-destructive">{getFieldError('modality_id')}</p>
                )}
                {selectedModality && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Duração padrão: {selectedModality.duration_minutes || 60} minutos
                  </p>
                )}
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
                disabled={isSubmitting}
                maxLength={500}
                className={getFieldError('description') ? 'border-destructive' : ''}
              />
              <p className="text-xs text-muted-foreground text-right">
                {formData.description?.length || 0}/500 caracteres
              </p>
            </div>
          </div>

          {/* Trainer e Local */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Personal Trainer e Local
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="trainer">Personal Trainer</Label>
                <Select 
                  value={formData.trainer_id} 
                  onValueChange={(value) => updateField('trainer_id', value)}
                  disabled={isSubmitting || loadingTrainers}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {loadingTrainers ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : trainers.filter(t => t.status === 'active').length === 0 ? (
                      <SelectItem value="empty" disabled>Nenhum trainer disponível</SelectItem>
                    ) : (
                      trainers.filter(t => t.status === 'active').map(trainer => (
                        <SelectItem key={trainer.id} value={trainer.id!}>
                          {trainer.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room">Sala</Label>
                <Select 
                  value={formData.room_id} 
                  onValueChange={(value) => updateField('room_id', value)}
                  disabled={isSubmitting || loadingRooms}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar sala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhuma</SelectItem>
                    {loadingRooms ? (
                      <SelectItem value="loading" disabled>Carregando...</SelectItem>
                    ) : rooms.filter(r => r.is_active).length === 0 ? (
                      <SelectItem value="empty" disabled>Nenhuma sala disponível</SelectItem>
                    ) : (
                      rooms.filter(r => r.is_active).map(room => (
                        <SelectItem key={room.id} value={room.id!}>
                          <div className="flex items-center justify-between w-full">
                            <span>{room.name}</span>
                            <Badge variant="outline" className="ml-2">
                              <Users className="h-3 w-3 mr-1" />
                              {room.capacity}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {selectedRoom && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Capacidade da sala: {selectedRoom.capacity} pessoas
                      {selectedRoom.floor && ` • Piso: ${selectedRoom.floor}`}
                    </AlertDescription>
                  </Alert>
                )}
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
                  disabled={isSubmitting}
                  min={new Date().toISOString().split('T')[0]}
                  className={getFieldError('date') ? 'border-destructive' : ''}
                />
                {getFieldError('date') && (
                  <p className="text-sm text-destructive">{getFieldError('date')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="start_time">Hora Início *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => updateField('start_time', e.target.value)}
                  required
                  disabled={isSubmitting}
                  className={getFieldError('start_time') ? 'border-destructive' : ''}
                />
                {getFieldError('start_time') && (
                  <p className="text-sm text-destructive">{getFieldError('start_time')}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="end_time">Hora Fim *</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => updateField('end_time', e.target.value)}
                  required
                  disabled={isSubmitting}
                  className={getFieldError('end_time') ? 'border-destructive' : ''}
                />
                {getFieldError('end_time') && (
                  <p className="text-sm text-destructive">{getFieldError('end_time')}</p>
                )}
              </div>
            </div>

            {duration && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Duração da aula: <strong>{duration}</strong>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Capacidade */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Capacidade
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="max_capacity">Capacidade Máxima *</Label>
              <Input
                id="max_capacity"
                type="number"
                value={formData.max_capacity}
                onChange={(e) => updateField('max_capacity', parseInt(e.target.value) || 1)}
                min="1"
                max={selectedRoom ? selectedRoom.capacity : 100}
                required
                disabled={isSubmitting}
                className={getFieldError('max_capacity') ? 'border-destructive' : ''}
              />
              {getFieldError('max_capacity') && (
                <p className="text-sm text-destructive">{getFieldError('max_capacity')}</p>
              )}
              {selectedRoom && (
                <p className="text-xs text-muted-foreground">
                  Máximo permitido pela sala: {selectedRoom.capacity}
                </p>
              )}
              {classData?.current_bookings > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Inscritos atuais: {classData.current_bookings}
                    {formData.max_capacity < classData.current_bookings && (
                      <span className="text-destructive font-medium">
                        {' '}• Atenção: Há mais inscritos que a nova capacidade!
                      </span>
                    )}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          {/* Status e Notas */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Status e Observações</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => updateField('status', value as any)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Agendada</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="in_progress">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Em Andamento</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="completed">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Concluída</Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="cancelled">
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive">Cancelada</Badge>
                      </div>
                    </SelectItem>
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
                  disabled={isSubmitting}
                  maxLength={1000}
                  className={getFieldError('notes') ? 'border-destructive' : ''}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.notes?.length || 0}/1000 caracteres
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Summary Card */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="text-sm space-y-1">
                <p><strong>Resumo:</strong></p>
                <p>• Modalidade: {selectedModality?.name || 'Não selecionada'}</p>
                {formData.date && <p>• Data: {format(new Date(formData.date + 'T00:00:00'), 'dd/MM/yyyy', { locale: pt })}</p>}
                {duration && <p>• Duração: {duration}</p>}
                <p>• Capacidade: {formData.max_capacity} pessoas</p>
              </div>
            </AlertDescription>
          </Alert>

          {/* Botões */}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || loadingModalities || loadingRooms || loadingTrainers}
            >
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {classData ? 'Atualizar' : 'Criar'} Aula
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
