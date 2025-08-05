
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ClassFormProps {
  classData?: any;
  onSave: () => void;
  onCancel: () => void;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  classData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: classData?.name || '',
    modality: classData?.modality || '',
    trainer: classData?.trainer || '',
    date: classData?.date || '',
    startTime: classData?.startTime || '',
    endTime: classData?.endTime || '',
    maxCapacity: classData?.maxCapacity || '',
    room: classData?.room || '',
    description: classData?.description || '',
    price: classData?.price || '',
    recurring: classData?.recurring || false,
    recurringDays: classData?.recurringDays || [],
    equipment: classData?.equipment || '',
    level: classData?.level || '',
    notes: classData?.notes || ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecurringDayChange = (day: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: checked
        ? [...prev.recurringDays, day]
        : prev.recurringDays.filter((d: string) => d !== day)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.modality || !formData.trainer || !formData.date || !formData.startTime) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    toast.success(classData ? 'Aula atualizada!' : 'Aula criada!');
    onSave();
  };

  const daysOfWeek = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {classData ? 'Editar Aula' : 'Nova Aula'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Informações Básicas</h4>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Aula *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="CrossFit Iniciantes"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade *</Label>
                <Select value={formData.modality} onValueChange={(value) => handleInputChange('modality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="crossfit">CrossFit</SelectItem>
                    <SelectItem value="functional">Funcional</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="pilates">Pilates</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                    <SelectItem value="weightlifting">Musculação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="level">Nível</Label>
                <Select value={formData.level} onValueChange={(value) => handleInputChange('level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar nível" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermédio</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                    <SelectItem value="all">Todos os Níveis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="trainer">Personal Trainer *</Label>
              <Select value={formData.trainer} onValueChange={(value) => handleInputChange('trainer', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar trainer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carlos">Carlos Santos</SelectItem>
                  <SelectItem value="ana">Ana Costa</SelectItem>
                  <SelectItem value="pedro">Pedro Silva</SelectItem>
                  <SelectItem value="maria">Maria Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data e Horário */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Data e Horário</h4>
            
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="startTime">Hora Início *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">Hora Fim</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>
            </div>

            {/* Aula Recorrente */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formData.recurring}
                  onCheckedChange={(checked) => handleInputChange('recurring', checked)}
                />
                <Label>Aula recorrente</Label>
              </div>
              
              {formData.recurring && (
                <div className="space-y-2">
                  <Label>Dias da semana:</Label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day.key} className="flex items-center space-x-2">
                        <Checkbox
                          checked={formData.recurringDays.includes(day.key)}
                          onCheckedChange={(checked) => handleRecurringDayChange(day.key, !!checked)}
                        />
                        <span className="text-sm">{day.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Detalhes da Aula */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Detalhes</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="maxCapacity">Capacidade Máxima</Label>
                <Input
                  id="maxCapacity"
                  type="number"
                  value={formData.maxCapacity}
                  onChange={(e) => handleInputChange('maxCapacity', e.target.value)}
                  placeholder="20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="room">Sala/Espaço</Label>
                <Select value={formData.room} onValueChange={(value) => handleInputChange('room', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar sala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sala1">Sala 1</SelectItem>
                    <SelectItem value="sala2">Sala 2</SelectItem>
                    <SelectItem value="sala3">Sala 3</SelectItem>
                    <SelectItem value="exterior">Exterior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (€)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="15.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Equipamento Necessário</Label>
              <Input
                id="equipment"
                value={formData.equipment}
                onChange={(e) => handleInputChange('equipment', e.target.value)}
                placeholder="Tapete de yoga, halteres..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descrição da aula, objetivos, o que esperar..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Internas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Notas para uso interno..."
                rows={2}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {classData ? 'Atualizar' : 'Criar'} Aula
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
