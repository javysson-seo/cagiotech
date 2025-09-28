
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, Eye, EyeOff, RefreshCw, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useTrainers } from '@/hooks/useTrainers';

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
  const { saveTrainer } = useTrainers();
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
    
    // Sistema de Pagamento
    paymentType: trainer?.paymentType || 'hourly',
    hourlyRate: trainer?.hourlyRate || '',
    monthlyRate: trainer?.monthlyRate || '',
    classRate: trainer?.classRate || '',
    percentageRate: trainer?.percentageRate || '',
    
    // Categorias de Exercícios
    exerciseCategories: trainer?.exerciseCategories || [],
    
    // Senha e Acesso
    password: trainer?.password || '',
    isPasswordVisible: false,
    
    // Atletas Vinculados
    linkedAthletes: trainer?.linkedAthletes || [],
    
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
  const [newExerciseCategory, setNewExerciseCategory] = useState('');

  // Categorias de exercícios predefinidas
  const exerciseCategoriesOptions = [
    'CrossFit', 'Musculação', 'Cardio', 'Functional Training',
    'Yoga', 'Pilates', 'Boxe', 'MMA', 'Natação', 'Corrida',
    'Ciclismo', 'Escalada', 'Dança', 'Zumba', 'Spinning',
    'TRX', 'Kettlebell', 'Calistenia', 'Powerlifting', 'Olympic Lifting'
  ];

  // Lista de atletas mockada (em produção viria do backend)
  const availableAthletes = [
    { id: '1', name: 'Ana Silva', email: 'ana@email.com' },
    { id: '2', name: 'João Santos', email: 'joao@email.com' },
    { id: '3', name: 'Maria Costa', email: 'maria@email.com' },
    { id: '4', name: 'Pedro Oliveira', email: 'pedro@email.com' },
    { id: '5', name: 'Sofia Ferreira', email: 'sofia@email.com' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, password }));
    toast.success('Password gerada automaticamente!');
  };

  const togglePasswordVisibility = () => {
    setFormData(prev => ({ ...prev, isPasswordVisible: !prev.isPasswordVisible }));
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

  const addExerciseCategory = () => {
    if (newExerciseCategory && !formData.exerciseCategories.includes(newExerciseCategory)) {
      setFormData(prev => ({
        ...prev,
        exerciseCategories: [...prev.exerciseCategories, newExerciseCategory]
      }));
      setNewExerciseCategory('');
    }
  };

  const removeExerciseCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      exerciseCategories: prev.exerciseCategories.filter((cat: string) => cat !== category)
    }));
  };

  const toggleAthleteLink = (athleteId: string) => {
    setFormData(prev => ({
      ...prev,
      linkedAthletes: prev.linkedAthletes.includes(athleteId)
        ? prev.linkedAthletes.filter((id: string) => id !== athleteId)
        : [...prev.linkedAthletes, athleteId]
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    const trainerData = {
      id: trainer?.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      birth_date: formData.dateOfBirth,
      specialties: formData.specialties,
      status: formData.status,
    };

    const success = await saveTrainer(trainerData);
    
    if (success) {
      onSave();
    }
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

          {/* Informação sobre Login Automático */}
          {!trainer && formData.dateOfBirth && formData.email && (
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">Sistema de Acesso</h4>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Login automático:</strong> Será criado automaticamente um usuário com o email informado. 
                  A senha será baseada na data de nascimento (formato: DDMMAAAA).
                </p>
              </div>
            </div>
          )}

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
          </div>

          {/* Sistema de Pagamento */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Sistema de Pagamento</h4>
            
            <div className="space-y-2">
              <Label htmlFor="paymentType">Tipo de Pagamento</Label>
              <Select value={formData.paymentType} onValueChange={(value) => handleInputChange('paymentType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Por Hora</SelectItem>
                  <SelectItem value="monthly">Mensalidade</SelectItem>
                  <SelectItem value="class">Por Aula</SelectItem>
                  <SelectItem value="percentage">Percentagem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.paymentType === 'hourly' && (
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
            )}

            {formData.paymentType === 'monthly' && (
              <div className="space-y-2">
                <Label htmlFor="monthlyRate">Salário Mensal (€)</Label>
                <Input
                  id="monthlyRate"
                  type="number"
                  value={formData.monthlyRate}
                  onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                  placeholder="1200"
                />
              </div>
            )}

            {formData.paymentType === 'class' && (
              <div className="space-y-2">
                <Label htmlFor="classRate">Valor por Aula (€)</Label>
                <Input
                  id="classRate"
                  type="number"
                  value={formData.classRate}
                  onChange={(e) => handleInputChange('classRate', e.target.value)}
                  placeholder="15"
                />
              </div>
            )}

            {formData.paymentType === 'percentage' && (
              <div className="space-y-2">
                <Label htmlFor="percentageRate">Percentagem (%)</Label>
                <Input
                  id="percentageRate"
                  type="number"
                  value={formData.percentageRate}
                  onChange={(e) => handleInputChange('percentageRate', e.target.value)}
                  placeholder="30"
                  max="100"
                  min="1"
                />
                <p className="text-xs text-muted-foreground">
                  Percentagem sobre a receita das aulas/treinos deste trainer
                </p>
              </div>
            )}
          </div>

          {/* Categorias de Exercícios */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Categorias de Exercícios</h4>
            
            <div className="flex gap-2">
              <Select value={newExerciseCategory} onValueChange={setNewExerciseCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {exerciseCategoriesOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" onClick={addExerciseCategory} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.exerciseCategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.exerciseCategories.map((category: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeExerciseCategory(category)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Atletas Vinculados */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Atletas Vinculados ({formData.linkedAthletes.length})
            </h4>
            
            <div className="border rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {availableAthletes.map((athlete) => (
                  <div key={athlete.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.linkedAthletes.includes(athlete.id)}
                      onCheckedChange={() => toggleAthleteLink(athlete.id)}
                    />
                    <div className="flex-1">
                      <span className="text-sm font-medium">{athlete.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{athlete.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Selecione os atletas que este trainer pode acompanhar
            </p>
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
