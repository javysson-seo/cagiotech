
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Plus, CalendarIcon, Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AthleteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete?: any;
  onSave: (data: any) => void;
}

export const AthleteFormModal: React.FC<AthleteFormModalProps> = ({
  isOpen,
  onClose,
  athlete,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: athlete?.name || '',
    email: athlete?.email || '',
    phone: athlete?.phone || '',
    birthDate: athlete?.birthDate ? new Date(athlete.birthDate) : undefined,
    gender: athlete?.gender || '',
    address: athlete?.address || '',
    plan: athlete?.plan || '',
    trainer: athlete?.trainer || '',
    group: athlete?.group || '',
    status: athlete?.status || 'active',
    medicalConditions: athlete?.medicalConditions || '',
    goals: athlete?.goals || [],
    notes: athlete?.notes || '',
    profilePhoto: athlete?.profilePhoto || null,
    nutritionPreview: athlete?.nutritionPreview || '',
    hasEmergencyContact: athlete?.emergencyContact ? true : false,
    emergencyContact: athlete?.emergencyContact || '',
    emergencyPhone: athlete?.emergencyPhone || ''
  });

  const [newGoal, setNewGoal] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(athlete?.profilePhoto || null);

  // Mock data - será substituído por dados reais das configurações
  const availablePlans = [
    { id: '1', name: 'Plano Básico', price: 50, features: ['Acesso ao ginásio', '2x por semana'] },
    { id: '2', name: 'Plano Premium', price: 80, features: ['Acesso ilimitado', 'Personal trainer'] },
    { id: '3', name: 'Plano VIP', price: 120, features: ['Acesso total', 'Nutricionista', 'Personal'] }
  ];

  const availableTrainers = [
    { id: '1', name: 'Carlos Santos' },
    { id: '2', name: 'Ana Costa' },
    { id: '3', name: 'Pedro Silva' },
    { id: '4', name: 'Maria Oliveira' }
  ];

  const availableGroups = [
    { id: '1', name: 'Crossfit Iniciantes' },
    { id: '2', name: 'Musculação Avançada' },
    { id: '3', name: 'Cardio Group' },
    { id: '4', name: 'Funcional' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('A foto deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPhotoPreview(result);
        handleInputChange('profilePhoto', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_: any, i: number) => i !== index)
    }));
  };

  const getSelectedPlan = () => {
    return availablePlans.find(plan => plan.id === formData.plan);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    // Criar notificação de aniversário se tiver data de nascimento
    const submissionData = {
      ...formData,
      monthlyFee: getSelectedPlan()?.price || 0,
      planDetails: getSelectedPlan(),
      birthDate: formData.birthDate?.toISOString(),
    };

    onSave(submissionData);
    toast.success(athlete ? 'Atleta atualizado!' : 'Atleta criado!');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {athlete ? 'Editar Atleta' : 'Novo Atleta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Foto de Perfil */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={photoPreview || undefined} alt="Foto do atleta" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {formData.name.split(' ').map(n => n[0]).join('') || <Camera className="h-8 w-8" />}
                </AvatarFallback>
              </Avatar>
              <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Clique no ícone para adicionar uma foto de perfil (máx. 5MB)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dados Pessoais</h3>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Nome completo do atleta"
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
                  <Label>Data de Nascimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.birthDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.birthDate ? format(formData.birthDate, "dd/MM/yyyy") : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.birthDate}
                        onSelect={(date) => handleInputChange('birthDate', date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
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

            {/* Planos e Configurações */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Planos e Configurações</h3>
              
              <div className="space-y-2">
                <Label htmlFor="plan">Plano *</Label>
                <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar plano" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.name} - €{plan.price}/mês
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {getSelectedPlan() && (
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <p className="font-medium">€{getSelectedPlan()?.price}/mês</p>
                    <ul className="text-sm text-muted-foreground mt-1">
                      {getSelectedPlan()?.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trainer">Personal Trainer</Label>
                <Select value={formData.trainer} onValueChange={(value) => handleInputChange('trainer', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar trainer" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTrainers.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Grupo</Label>
                <Select value={formData.group} onValueChange={(value) => handleInputChange('group', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableGroups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                    <SelectItem value="frozen">Congelado</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview Nutricional */}
              <div className="space-y-2">
                <Label htmlFor="nutritionPreview">Preview Plano Nutricional</Label>
                <Textarea
                  id="nutritionPreview"
                  value={formData.nutritionPreview}
                  onChange={(e) => handleInputChange('nutritionPreview', e.target.value)}
                  placeholder="Resumo do plano nutricional do atleta..."
                  rows={3}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Este campo permite visualizar rapidamente o plano nutricional do atleta
                </p>
              </div>
            </div>
          </div>

          {/* Contacto de Emergência */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="hasEmergencyContact"
                checked={formData.hasEmergencyContact}
                onCheckedChange={(checked) => {
                  handleInputChange('hasEmergencyContact', checked);
                  if (!checked) {
                    handleInputChange('emergencyContact', '');
                    handleInputChange('emergencyPhone', '');
                  }
                }}
              />
              <Label htmlFor="hasEmergencyContact" className="font-medium">
                Deseja adicionar contacto de emergência?
              </Label>
            </div>
            
            {formData.hasEmergencyContact && (
              <div className="grid grid-cols-2 gap-3 ml-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Nome do Contacto</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    placeholder="Nome do contacto de emergência"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Telefone de Emergência</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+351 912 345 678"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Informações Médicas */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Informações de Saúde</h3>
            
            <div className="space-y-2">
              <Label htmlFor="medicalConditions">Condições Médicas</Label>
              <Textarea
                id="medicalConditions"
                value={formData.medicalConditions}
                onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                placeholder="Lesões, alergias, medicamentos, restrições..."
                rows={3}
              />
            </div>
          </div>

          {/* Objetivos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Objetivos</h3>
            
            <div className="flex gap-2">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Adicionar objetivo"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
              />
              <Button type="button" onClick={addGoal} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {formData.goals.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.goals.map((goal: string, index: number) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {goal}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeGoal(index)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionais</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notas gerais sobre o atleta..."
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {athlete ? 'Atualizar' : 'Criar'} Atleta
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
