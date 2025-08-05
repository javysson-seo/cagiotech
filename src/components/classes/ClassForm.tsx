
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Calendar, Clock, Users, MapPin, Euro } from 'lucide-react';

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
    title: classData?.title || '',
    description: classData?.description || '',
    modality: classData?.modality || 'CrossFit',
    trainerId: classData?.trainerId || '',
    date: classData?.startTime ? classData.startTime.split('T')[0] : '',
    startTime: classData?.startTime ? classData.startTime.split('T')[1].substring(0, 5) : '',
    duration: classData?.duration || 60,
    capacity: classData?.capacity || 20,
    price: classData?.price || 15,
    location: classData?.location || 'Sala Principal',
    difficulty: classData?.difficulty || 'Intermediário',
    equipment: classData?.equipment || [],
    recurring: classData?.recurring || 'none',
    recurringEnd: '',
    notes: classData?.notes || ''
  });

  // Mock data dos trainers
  const trainers = [
    { id: 1, name: 'Carlos Santos', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos' },
    { id: 2, name: 'Ana Costa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana' },
    { id: 3, name: 'Pedro Silva', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro' }
  ];

  const modalities = [
    'CrossFit', 'Yoga', 'Pilates', 'Functional Training', 
    'Olympic Lifting', 'Powerlifting', 'Mobility', 'Running'
  ];

  const equipmentOptions = [
    'Kettlebells', 'Barras', 'Boxes', 'Tapetes', 'Blocos', 'Straps',
    'TRX', 'Medicine Balls', 'Cones', 'Reformers', 'Cadillac', 'Barris'
  ];

  const locations = [
    'Sala Principal', 'Sala de Yoga', 'Estúdio Pilates', 'Área Externa', 
    'Sala de Musculação', 'Sala de Grupo'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEquipmentToggle = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter((e: string) => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Saving class:', formData);
    onSave();
  };

  const selectedTrainer = trainers.find(t => t.id === parseInt(formData.trainerId));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{classData ? 'Editar Aula' : 'Nova Aula'}</span>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Aula *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: CrossFit Morning"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Breve descrição da aula..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="modality">Modalidade *</Label>
              <select
                id="modality"
                value={formData.modality}
                onChange={(e) => handleInputChange('modality', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                required
              >
                {modalities.map((modality) => (
                  <option key={modality} value={modality}>
                    {modality}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="trainer">Trainer *</Label>
              <select
                id="trainer"
                value={formData.trainerId}
                onChange={(e) => handleInputChange('trainerId', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                required
              >
                <option value="">Selecione um trainer</option>
                {trainers.map((trainer) => (
                  <option key={trainer.id} value={trainer.id}>
                    {trainer.name}
                  </option>
                ))}
              </select>
              
              {selectedTrainer && (
                <div className="flex items-center space-x-2 mt-2 p-2 bg-muted/50 rounded">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={selectedTrainer.avatar} />
                    <AvatarFallback>
                      {selectedTrainer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{selectedTrainer.name}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Horário e Local */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Data e Horário
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="startTime">Hora de Início *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                min="15"
                max="180"
                step="15"
              />
            </div>
            
            <div>
              <Label htmlFor="recurring">Repetição</Label>
              <select
                id="recurring"
                value={formData.recurring}
                onChange={(e) => handleInputChange('recurring', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="none">Aula única</option>
                <option value="daily">Diária</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            
            {formData.recurring !== 'none' && (
              <div>
                <Label htmlFor="recurringEnd">Repetir até</Label>
                <Input
                  id="recurringEnd"
                  type="date"
                  value={formData.recurringEnd}
                  onChange={(e) => handleInputChange('recurringEnd', e.target.value)}
                />
              </div>
            )}
          </div>
          
          {/* Capacidade e Local */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Local e Capacidade
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="capacity">Capacidade *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                    className="pl-10"
                    min="1"
                    max="50"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="price">Preço (€) *</Label>
                <div className="relative">
                  <Euro className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                    className="pl-10"
                    min="0"
                    step="0.5"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="location">Local *</Label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                required
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <Label htmlFor="difficulty">Nível de Dificuldade</Label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="Iniciante">Iniciante</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
              </select>
            </div>
          </div>
          
          {/* Equipamentos */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-medium">Equipamentos Necessários</h3>
            <div className="grid grid-cols-2 gap-2">
              {equipmentOptions.map((equipment) => (
                <div key={equipment} className="flex items-center space-x-2">
                  <Checkbox
                    id={equipment}
                    checked={formData.equipment.includes(equipment)}
                    onCheckedChange={() => handleEquipmentToggle(equipment)}
                  />
                  <Label htmlFor={equipment} className="text-sm">
                    {equipment}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Notas */}
          <div className="pt-4 border-t">
            <Label htmlFor="notes">Notas Adicionais</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Informações extras sobre a aula..."
              rows={3}
            />
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              {classData ? 'Atualizar' : 'Criar'} Aula
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
