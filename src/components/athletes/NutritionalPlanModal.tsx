import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NutritionalPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
}

export const NutritionalPlanModal: React.FC<NutritionalPlanModalProps> = ({
  isOpen,
  onClose,
  athleteId,
  athleteName,
}) => {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    breakfast: '',
    morning_snack: '',
    lunch: '',
    afternoon_snack: '',
    dinner: '',
    evening_snack: '',
    observations: '',
    water_intake: '',
    calories_target: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCompany?.id || !user?.id) {
      toast.error('Erro: Empresa ou utilizador não identificado');
      return;
    }

    if (!formData.title.trim()) {
      toast.error('Por favor, preencha o título do plano');
      return;
    }

    setLoading(true);

    try {
      const planDetails = {
        breakfast: formData.breakfast,
        morning_snack: formData.morning_snack,
        lunch: formData.lunch,
        afternoon_snack: formData.afternoon_snack,
        dinner: formData.dinner,
        evening_snack: formData.evening_snack,
        observations: formData.observations,
        water_intake: formData.water_intake,
        calories_target: formData.calories_target,
      };

      const { data, error } = await supabase
        .from('nutritional_plans')
        .insert([{
          company_id: currentCompany.id,
          trainer_id: user.id,
          athlete_id: athleteId,
          title: formData.title,
          description: formData.description,
          plan_details: planDetails,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating nutritional plan:', error);
        toast.error('Erro ao criar plano nutricional');
        return;
      }

      toast.success('Plano nutricional criado com sucesso!');
      onClose();
      // Reset form
      setFormData({
        title: '',
        description: '',
        breakfast: '',
        morning_snack: '',
        lunch: '',
        afternoon_snack: '',
        dinner: '',
        evening_snack: '',
        observations: '',
        water_intake: '',
        calories_target: '',
      });
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Erro ao criar plano nutricional');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Criar Plano Nutricional - {athleteName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Título do Plano *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Ex: Plano Nutricional - Ganho de Massa"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Descrição geral do plano nutricional..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="calories_target">Meta Calórica Diária</Label>
                <Input
                  id="calories_target"
                  value={formData.calories_target}
                  onChange={(e) => handleChange('calories_target', e.target.value)}
                  placeholder="Ex: 2500 kcal"
                />
              </div>

              <div>
                <Label htmlFor="water_intake">Ingestão de Água</Label>
                <Input
                  id="water_intake"
                  value={formData.water_intake}
                  onChange={(e) => handleChange('water_intake', e.target.value)}
                  placeholder="Ex: 3 litros/dia"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Refeições</h3>
            
            <div>
              <Label htmlFor="breakfast">Pequeno-almoço</Label>
              <Textarea
                id="breakfast"
                value={formData.breakfast}
                onChange={(e) => handleChange('breakfast', e.target.value)}
                placeholder="Descreva o pequeno-almoço..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="morning_snack">Lanche da Manhã</Label>
              <Textarea
                id="morning_snack"
                value={formData.morning_snack}
                onChange={(e) => handleChange('morning_snack', e.target.value)}
                placeholder="Descreva o lanche da manhã..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="lunch">Almoço</Label>
              <Textarea
                id="lunch"
                value={formData.lunch}
                onChange={(e) => handleChange('lunch', e.target.value)}
                placeholder="Descreva o almoço..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="afternoon_snack">Lanche da Tarde</Label>
              <Textarea
                id="afternoon_snack"
                value={formData.afternoon_snack}
                onChange={(e) => handleChange('afternoon_snack', e.target.value)}
                placeholder="Descreva o lanche da tarde..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="dinner">Jantar</Label>
              <Textarea
                id="dinner"
                value={formData.dinner}
                onChange={(e) => handleChange('dinner', e.target.value)}
                placeholder="Descreva o jantar..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="evening_snack">Ceia</Label>
              <Textarea
                id="evening_snack"
                value={formData.evening_snack}
                onChange={(e) => handleChange('evening_snack', e.target.value)}
                placeholder="Descreva a ceia..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="observations">Observações</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleChange('observations', e.target.value)}
                placeholder="Observações adicionais, restrições alimentares, suplementos..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-cagio-green hover:bg-cagio-green-dark text-white"
              disabled={loading}
            >
              {loading ? 'A guardar...' : 'Criar Plano'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
