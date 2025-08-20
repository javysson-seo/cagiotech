
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { type Athlete } from '@/hooks/useAthletes';

interface AthleteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete?: Athlete | null;
  onSave: (athleteData: any) => void;
}

export const AthleteFormModal: React.FC<AthleteFormModalProps> = ({
  isOpen,
  onClose,
  athlete,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: '',
    address: '',
    plan: '',
    trainer: '',
    group: '',
    status: 'active',
    monthly_fee: 0,
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: '',
    goals: [] as string[],
    notes: '',
    nutrition_preview: '',
  });

  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    if (athlete) {
      setFormData({
        name: athlete.name || '',
        email: athlete.email || '',
        phone: athlete.phone || '',
        birth_date: athlete.birth_date || '',
        gender: athlete.gender || '',
        address: athlete.address || '',
        plan: athlete.plan || '',
        trainer: athlete.trainer || '',
        group: athlete.group || '',
        status: athlete.status || 'active',
        monthly_fee: athlete.monthly_fee || 0,
        emergency_contact_name: athlete.emergency_contact_name || '',
        emergency_contact_phone: athlete.emergency_contact_phone || '',
        medical_notes: athlete.medical_notes || '',
        goals: athlete.goals || [],
        notes: athlete.notes || '',
        nutrition_preview: athlete.nutrition_preview || '',
      });
    } else {
      // Reset form for new athlete
      setFormData({
        name: '',
        email: '',
        phone: '',
        birth_date: '',
        gender: '',
        address: '',
        plan: '',
        trainer: '',
        group: '',
        status: 'active',
        monthly_fee: 0,
        emergency_contact_name: '',
        emergency_contact_phone: '',
        medical_notes: '',
        goals: [],
        notes: '',
        nutrition_preview: '',
      });
    }
  }, [athlete, isOpen]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal.trim()]
      }));
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {athlete ? 'Editar Atleta' : 'Novo Atleta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => handleInputChange('birth_date', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="gender">Gênero</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Masculino</SelectItem>
                  <SelectItem value="female">Feminino</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
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

          <div>
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          {/* Plano e Treinamento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="plan">Plano</Label>
              <Input
                id="plan"
                value={formData.plan}
                onChange={(e) => handleInputChange('plan', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="trainer">Personal Trainer</Label>
              <Input
                id="trainer"
                value={formData.trainer}
                onChange={(e) => handleInputChange('trainer', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="group">Grupo</Label>
              <Input
                id="group"
                value={formData.group}
                onChange={(e) => handleInputChange('group', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="monthly_fee">Mensalidade (€)</Label>
            <Input
              id="monthly_fee"
              type="number"
              step="0.01"
              min="0"
              value={formData.monthly_fee}
              onChange={(e) => handleInputChange('monthly_fee', parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Contato de Emergência */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergency_contact_name">Contato de Emergência</Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="emergency_contact_phone">Telefone de Emergência</Label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
              />
            </div>
          </div>

          {/* Objetivos */}
          <div>
            <Label>Objetivos</Label>
            <div className="flex gap-2 mt-1">
              <Input
                placeholder="Adicionar objetivo..."
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddGoal())}
              />
              <Button type="button" onClick={handleAddGoal} className="bg-emerald-600 hover:bg-emerald-700">
                Adicionar
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.goals.map((goal, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {goal}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveGoal(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Observações Médicas */}
          <div>
            <Label htmlFor="medical_notes">Condições Médicas / Observações</Label>
            <Textarea
              id="medical_notes"
              value={formData.medical_notes}
              onChange={(e) => handleInputChange('medical_notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Notas Gerais */}
          <div>
            <Label htmlFor="notes">Notas Gerais</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              {athlete ? 'Atualizar' : 'Criar'} Atleta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
