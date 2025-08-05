
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TrainerFormProps {
  trainer?: any;
  onSave: () => void;
  onCancel: () => void;
}

export const TrainerForm: React.FC<TrainerFormProps> = ({
  trainer,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: trainer?.name || '',
    email: trainer?.email || '',
    phone: trainer?.phone || '',
    dateOfBirth: trainer?.dateOfBirth || '',
    gender: trainer?.gender || '',
    address: trainer?.address || '',
    status: trainer?.status || 'active',
    specialties: trainer?.specialties || [],
    certifications: trainer?.certifications || [],
    experience: trainer?.experience || '',
    hourlyRate: trainer?.hourlyRate || '',
    availability: trainer?.availability || {
      monday: { available: false, start: '09:00', end: '18:00' },
      tuesday: { available: false, start: '09:00', end: '18:00' },
      wednesday: { available: false, start: '09:00', end: '18:00' },
      thursday: { available: false, start: '09:00', end: '18:00' },
      friday: { available: false, start: '09:00', end: '18:00' },
      saturday: { available: false, start: '09:00', end: '18:00' },
      sunday: { available: false, start: '09:00', end: '18:00' }
    },
    bio: trainer?.bio || '',
    notes: trainer?.notes || ''
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_: any, i: number) => i !== index)
    }));
  };

  const addCertification = () => {
    if (newCertification.trim()) {
      setFormData(prev => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()]
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleAvailabilityChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    toast.success(trainer ? 'Trainer atualizado!' : 'Trainer criado!');
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
          {trainer ? 'Editar Trainer' : 'Novo Trainer'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Pessoais */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Dados Pessoais</h4>
            
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@exemplo.com"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+351 912 345 678"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data Nascimento</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar género" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Morada</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Morada completa"
                rows={2}
              />
            </div>
          </div>

          {/* Dados Profissionais */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Dados Profissionais</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="vacation">Em Férias</SelectItem>
                    <SelectItem value="absent">Ausente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Taxa Horária (€)</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                  placeholder="25"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Anos de Experiência</Label>
              <Input
                id="experience"
                type="number"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                placeholder="5"
              />
            </div>
          </div>

          {/* Especialidades */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Especialidades</h4>
            
            <div className="flex gap-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Adicionar especialidade"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
              />
              <Button type="button" onClick={addSpecialty} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {specialty}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSpecialty(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Certificações */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Certificações</h4>
            
            <div className="flex gap-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                placeholder="Adicionar certificação"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
              />
              <Button type="button" onClick={addCertification} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.certifications.map((cert: string, index: number) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {cert}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeCertification(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Disponibilidade */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Disponibilidade</h4>
            
            <div className="space-y-3">
              {daysOfWeek.map((day) => (
                <div key={day.key} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.availability[day.key]?.available || false}
                      onCheckedChange={(checked) => 
                        handleAvailabilityChange(day.key, 'available', checked)
                      }
                    />
                    <span className="min-w-[80px] text-sm font-medium">{day.label}</span>
                  </div>
                  
                  {formData.availability[day.key]?.available && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={formData.availability[day.key]?.start || '09:00'}
                        onChange={(e) => handleAvailabilityChange(day.key, 'start', e.target.value)}
                        className="w-24"
                      />
                      <span className="text-muted-foreground">até</span>
                      <Input
                        type="time"
                        value={formData.availability[day.key]?.end || '18:00'}
                        onChange={(e) => handleAvailabilityChange(day.key, 'end', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Biografia */}
          <div className="space-y-2">
            <Label htmlFor="bio">Biografia</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Breve descrição sobre o trainer, experiência, filosofia..."
              rows={3}
            />
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Internas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notas internas sobre o trainer..."
              rows={2}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {trainer ? 'Atualizar' : 'Criar'} Trainer
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
