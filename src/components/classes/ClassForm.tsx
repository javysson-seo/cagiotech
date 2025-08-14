
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Save, Calendar, Clock, Users, MapPin, Euro } from 'lucide-react';
import { toast } from 'sonner';

interface ClassFormProps {
  classData?: any;
  onClose: () => void;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  classData,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    modality: '',
    trainer: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: 60,
    capacity: 20,
    price: 15,
    credits: 1,
    location: '',
    difficulty: 'Intermediário',
    recurring: false,
    recurrenceType: 'weekly',
    status: 'active'
  });

  useEffect(() => {
    if (classData) {
      setFormData({
        title: classData.title || '',
        description: classData.description || '',
        modality: classData.modality || '',
        trainer: classData.trainer || '',
        date: classData.startTime ? classData.startTime.split('T')[0] : '',
        startTime: classData.startTime ? classData.startTime.split('T')[1].substring(0, 5) : '',
        endTime: classData.endTime ? classData.endTime.split('T')[1].substring(0, 5) : '',
        duration: classData.duration || 60,
        capacity: classData.capacity || 20,
        price: classData.price || 15,
        credits: classData.credits || 1,
        location: classData.location || '',
        difficulty: classData.difficulty || 'Intermediário',
        recurring: classData.recurring !== 'none',
        recurrenceType: classData.recurring || 'weekly',
        status: classData.status || 'active'
      });
    }
  }, [classData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (!formData.title || !formData.modality || !formData.trainer) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    console.log('Dados da aula:', formData);
    
    if (classData) {
      toast.success('Aula atualizada com sucesso!');
    } else {
      toast.success('Aula criada com sucesso!');
    }
    
    onClose();
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidade *</Label>
                <Select value={formData.modality} onValueChange={(value) => updateField('modality', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar modalidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CrossFit">CrossFit</SelectItem>
                    <SelectItem value="Yoga">Yoga</SelectItem>
                    <SelectItem value="Pilates">Pilates</SelectItem>
                    <SelectItem value="Functional">Functional</SelectItem>
                    <SelectItem value="HIIT">HIIT</SelectItem>
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
                <Label htmlFor="trainer">Trainer *</Label>
                <Select value={formData.trainer} onValueChange={(value) => updateField('trainer', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Carlos Santos">Carlos Santos</SelectItem>
                    <SelectItem value="Ana Costa">Ana Costa</SelectItem>
                    <SelectItem value="Pedro Silva">Pedro Silva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Local</Label>
                <Select value={formData.location} onValueChange={(value) => updateField('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sala Principal">Sala Principal</SelectItem>
                    <SelectItem value="Sala de Yoga">Sala de Yoga</SelectItem>
                    <SelectItem value="Área Externa">Área Externa</SelectItem>
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
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Hora Início</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => updateField('startTime', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endTime">Hora Fim</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => updateField('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Capacidade e Preços */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg flex items-center">
              <Euro className="h-4 w-4 mr-2" />
              Capacidade e Preços
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacidade</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => updateField('capacity', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Preço (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => updateField('price', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="credits">Créditos</Label>
                <Input
                  id="credits"
                  type="number"
                  value={formData.credits}
                  onChange={(e) => updateField('credits', parseInt(e.target.value))}
                  min="1"
                />
              </div>
            </div>
          </div>

          {/* Configurações Adicionais */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Configurações Adicionais</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Select value={formData.difficulty} onValueChange={(value) => updateField('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Iniciante">Iniciante</SelectItem>
                    <SelectItem value="Intermediário">Intermediário</SelectItem>
                    <SelectItem value="Avançado">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Recorrência */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="recurring"
                  checked={formData.recurring}
                  onCheckedChange={(checked) => updateField('recurring', checked)}
                />
                <Label htmlFor="recurring">Aula recorrente</Label>
              </div>
              
              {formData.recurring && (
                <div className="space-y-2">
                  <Label htmlFor="recurrenceType">Tipo de Recorrência</Label>
                  <Select value={formData.recurrenceType} onValueChange={(value) => updateField('recurrenceType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diária</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                      <SelectItem value="monthly">Mensal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
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
