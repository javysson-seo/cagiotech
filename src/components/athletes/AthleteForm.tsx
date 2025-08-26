import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface AthleteFormProps {
  athlete?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const AthleteForm: React.FC<AthleteFormProps> = ({
  athlete,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: athlete?.name || '',
    email: athlete?.email || '',
    phone: athlete?.phone || '',
    birth_date: athlete?.birth_date || '',
    gender: athlete?.gender || '',
    address: athlete?.address || '',
    emergency_contact_name: athlete?.emergency_contact_name || '',
    emergency_contact_phone: athlete?.emergency_contact_phone || '',
    plan: athlete?.plan || '',
    trainer: athlete?.trainer || '',
    status: athlete?.status || 'active',
    monthly_fee: athlete?.monthly_fee || '',
    medical_conditions: athlete?.medical_conditions || '',
    goals: athlete?.goals || [],
    notes: athlete?.notes || ''
  });

  const [newGoal, setNewGoal] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    // Include the ID if editing
    const dataToSave = athlete?.id 
      ? { ...formData, id: athlete.id }
      : formData;

    onSave(dataToSave);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {athlete ? 'Editar Atleta' : 'Novo Atleta'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="birth_date">Data Nascimento</Label>
                <Input
                  id="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={(e) => handleInputChange('birth_date', e.target.value)}
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

          {/* Contacto de Emergência */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Contacto de Emergência</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Nome</Label>
                <Input
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  placeholder="Nome do contacto"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Telefone</Label>
                <Input
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  placeholder="+351 912 345 678"
                />
              </div>
            </div>
          </div>

          {/* Dados da Subscrição */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Subscrição</h4>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="plan">Plano</Label>
                <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar plano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unlimited">Ilimitado</SelectItem>
                    <SelectItem value="8x">8x Semana</SelectItem>
                    <SelectItem value="4x">4x Semana</SelectItem>
                    <SelectItem value="2x">2x Semana</SelectItem>
                    <SelectItem value="personal">Personal Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="trainer">Personal Trainer</Label>
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

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="monthly_fee">Mensalidade (€)</Label>
                <Input
                  id="monthly_fee"
                  type="number"
                  value={formData.monthly_fee}
                  onChange={(e) => handleInputChange('monthly_fee', e.target.value)}
                  placeholder="75"
                />
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
            </div>
          </div>

          {/* Informações Médicas */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Informações de Saúde</h4>
            
            <div className="space-y-2">
              <Label htmlFor="medical_conditions">Condições Médicas</Label>
              <Textarea
                id="medical_conditions"
                value={formData.medical_conditions}
                onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                placeholder="Lesões, alergias, medicamentos..."
                rows={2}
              />
            </div>
          </div>

          {/* Objetivos */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-muted-foreground">Objetivos</h4>
            
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
            <Label htmlFor="notes">Notas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Notas adicionais sobre o atleta..."
              rows={3}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {athlete ? 'Atualizar' : 'Criar'} Atleta
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
