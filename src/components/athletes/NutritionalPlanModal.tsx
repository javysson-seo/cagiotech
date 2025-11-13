import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Copy, Plus, Trash2 } from 'lucide-react';

interface NutritionalPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  athleteId: string;
  athleteName: string;
  existingPlan?: any;
  onSuccess?: () => void;
}

interface MealData {
  name: string;
  time: string;
  foods: string;
  calories: string;
  proteins: string;
  carbs: string;
  fats: string;
  notes: string;
}

interface DayPlan {
  breakfast: MealData;
  morning_snack: MealData;
  lunch: MealData;
  afternoon_snack: MealData;
  dinner: MealData;
  evening_snack: MealData;
  water_intake: string;
  total_calories: string;
  notes: string;
}

const emptyMeal: MealData = {
  name: '',
  time: '',
  foods: '',
  calories: '',
  proteins: '',
  carbs: '',
  fats: '',
  notes: ''
};

const emptyDayPlan: DayPlan = {
  breakfast: { ...emptyMeal, name: 'Pequeno-almoço', time: '08:00' },
  morning_snack: { ...emptyMeal, name: 'Lanche da Manhã', time: '10:30' },
  lunch: { ...emptyMeal, name: 'Almoço', time: '13:00' },
  afternoon_snack: { ...emptyMeal, name: 'Lanche da Tarde', time: '16:00' },
  dinner: { ...emptyMeal, name: 'Jantar', time: '20:00' },
  evening_snack: { ...emptyMeal, name: 'Ceia', time: '22:00' },
  water_intake: '2.5',
  total_calories: '',
  notes: ''
};

export const NutritionalPlanModal: React.FC<NutritionalPlanModalProps> = ({
  isOpen,
  onClose,
  athleteId,
  athleteName,
  existingPlan,
  onSuccess,
}) => {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [currentDayToCopy, setCurrentDayToCopy] = useState<string>('');
  const [trainerId, setTrainerId] = useState<string | null>(null);
  
  const weekDays = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    calories_target: '',
    observations: '',
  });

  const [weekPlans, setWeekPlans] = useState<Record<string, DayPlan>>({
    monday: { ...emptyDayPlan },
    tuesday: { ...emptyDayPlan },
    wednesday: { ...emptyDayPlan },
    thursday: { ...emptyDayPlan },
    friday: { ...emptyDayPlan },
    saturday: { ...emptyDayPlan },
    sunday: { ...emptyDayPlan },
  });

  // Fetch trainer ID for current user
  useEffect(() => {
    const fetchTrainerId = async () => {
      if (!user?.id || !currentCompany?.id) return;

      const { data, error } = await supabase
        .from('trainers')
        .select('id')
        .eq('user_id', user.id)
        .eq('company_id', currentCompany.id)
        .maybeSingle();

      if (data) {
        setTrainerId(data.id);
      } else {
        console.error('Trainer not found for user:', error);
      }
    };

    if (isOpen) {
      fetchTrainerId();
    }
  }, [user?.id, currentCompany?.id, isOpen]);

  // Load existing plan data when editing
  useEffect(() => {
    if (existingPlan && isOpen) {
      setFormData({
        title: existingPlan.title || '',
        description: existingPlan.description || '',
        calories_target: existingPlan.plan_details?.calories_target || '',
        observations: existingPlan.plan_details?.observations || '',
      });

      if (existingPlan.plan_details?.week_plans) {
        setWeekPlans(existingPlan.plan_details.week_plans);
      }
    } else if (!existingPlan && isOpen) {
      // Reset form when opening for new plan
      resetForm();
    }
  }, [existingPlan, isOpen]);

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

    if (!trainerId && !existingPlan) {
      toast.error('Não foi possível identificar o treinador. Por favor, tente novamente.');
      return;
    }

    setLoading(true);

    try {
      const planDetails = {
        week_plans: weekPlans,
        calories_target: formData.calories_target,
        observations: formData.observations,
      };

      if (existingPlan?.id) {
        // Update existing plan
        const { error } = await supabase
          .from('nutritional_plans')
          .update({
            title: formData.title,
            description: formData.description,
            plan_details: planDetails as any,
          })
          .eq('id', existingPlan.id);

        if (error) {
          console.error('Error updating nutritional plan:', error);
          toast.error('Erro ao atualizar plano nutricional: ' + error.message);
          return;
        }

        toast.success('Plano nutricional atualizado com sucesso!');
      } else {
        // Create new plan
        const { error } = await supabase
          .from('nutritional_plans')
          .insert([{
            company_id: currentCompany.id,
            trainer_id: trainerId,
            athlete_id: athleteId,
            title: formData.title,
            description: formData.description,
            plan_details: planDetails as any,
          }]);

        if (error) {
          console.error('Error creating nutritional plan:', error);
          toast.error('Erro ao criar plano nutricional: ' + error.message);
          return;
        }

        toast.success('Plano nutricional criado com sucesso!');
      }
      
      onSuccess?.();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      toast.error('Erro ao processar plano nutricional');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      calories_target: '',
      observations: '',
    });
    setWeekPlans({
      monday: { ...emptyDayPlan },
      tuesday: { ...emptyDayPlan },
      wednesday: { ...emptyDayPlan },
      thursday: { ...emptyDayPlan },
      friday: { ...emptyDayPlan },
      saturday: { ...emptyDayPlan },
      sunday: { ...emptyDayPlan },
    });
    setActiveTab('info');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMealChange = (day: string, meal: keyof DayPlan, field: string, value: string) => {
    setWeekPlans(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: typeof prev[day][meal] === 'object' 
          ? { ...prev[day][meal], [field]: value }
          : value
      }
    }));
  };

  const handleDayFieldChange = (day: string, field: string, value: string) => {
    setWeekPlans(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const openCopyModal = (toDay: string) => {
    setCurrentDayToCopy(toDay);
    setCopyModalOpen(true);
  };

  const copyDayPlan = (fromDay: string) => {
    if (!currentDayToCopy) return;
    
    setWeekPlans(prev => ({
      ...prev,
      [currentDayToCopy]: JSON.parse(JSON.stringify(prev[fromDay]))
    }));
    
    const fromLabel = weekDays.find(d => d.key === fromDay)?.label;
    const toLabel = weekDays.find(d => d.key === currentDayToCopy)?.label;
    toast.success(`Plano de ${fromLabel} copiado para ${toLabel}`);
    setCopyModalOpen(false);
    setCurrentDayToCopy('');
  };

  const clearDayPlan = (day: string) => {
    setWeekPlans(prev => ({
      ...prev,
      [day]: { ...emptyDayPlan }
    }));
    toast.success('Dia limpo com sucesso');
  };

  const renderMealFields = (day: string, mealKey: keyof DayPlan, meal: MealData) => (
    <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Horário</Label>
          <Input
            type="time"
            value={meal.time}
            onChange={(e) => handleMealChange(day, mealKey, 'time', e.target.value)}
            placeholder="08:00"
          />
        </div>
        <div>
          <Label>Calorias (kcal)</Label>
          <Input
            type="number"
            value={meal.calories}
            onChange={(e) => handleMealChange(day, mealKey, 'calories', e.target.value)}
            placeholder="500"
          />
        </div>
      </div>

      <div>
        <Label>Alimentos</Label>
        <Textarea
          value={meal.foods}
          onChange={(e) => handleMealChange(day, mealKey, 'foods', e.target.value)}
          placeholder="Ex: 2 ovos, 50g de aveia, 1 banana..."
          rows={2}
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label>Proteínas (g)</Label>
          <Input
            type="number"
            value={meal.proteins}
            onChange={(e) => handleMealChange(day, mealKey, 'proteins', e.target.value)}
            placeholder="30"
          />
        </div>
        <div>
          <Label>Carboidratos (g)</Label>
          <Input
            type="number"
            value={meal.carbs}
            onChange={(e) => handleMealChange(day, mealKey, 'carbs', e.target.value)}
            placeholder="50"
          />
        </div>
        <div>
          <Label>Gorduras (g)</Label>
          <Input
            type="number"
            value={meal.fats}
            onChange={(e) => handleMealChange(day, mealKey, 'fats', e.target.value)}
            placeholder="15"
          />
        </div>
      </div>

      <div>
        <Label>Observações</Label>
        <Textarea
          value={meal.notes}
          onChange={(e) => handleMealChange(day, mealKey, 'notes', e.target.value)}
          placeholder="Observações sobre esta refeição..."
          rows={2}
        />
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Criar Plano Nutricional - {athleteName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="info">Info</TabsTrigger>
              {weekDays.map(day => (
                <TabsTrigger key={day.key} value={day.key}>
                  {day.label.substring(0, 3)}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Informações Gerais */}
            <TabsContent value="info" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Gerais do Plano</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <Label htmlFor="observations">Observações Gerais</Label>
                    <Textarea
                      id="observations"
                      value={formData.observations}
                      onChange={(e) => handleChange('observations', e.target.value)}
                      placeholder="Restrições alimentares, suplementos, orientações gerais..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tabs para cada dia da semana */}
            {weekDays.map(day => (
              <TabsContent key={day.key} value={day.key} className="space-y-4">
                <Card>
                  <CardHeader>
                      <div className="flex items-center justify-between">
                      <CardTitle>{day.label}</CardTitle>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => openCopyModal(day.key)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar de...
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => clearDayPlan(day.key)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Limpar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Ingestão de Água (litros)</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={weekPlans[day.key].water_intake}
                          onChange={(e) => handleDayFieldChange(day.key, 'water_intake', e.target.value)}
                          placeholder="2.5"
                        />
                      </div>
                      <div>
                        <Label>Total de Calorias</Label>
                        <Input
                          type="number"
                          value={weekPlans[day.key].total_calories}
                          onChange={(e) => handleDayFieldChange(day.key, 'total_calories', e.target.value)}
                          placeholder="2500"
                        />
                      </div>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="breakfast">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">08:00</Badge>
                            Pequeno-almoço
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {renderMealFields(day.key, 'breakfast', weekPlans[day.key].breakfast as MealData)}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="morning_snack">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">10:30</Badge>
                            Lanche da Manhã
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {renderMealFields(day.key, 'morning_snack', weekPlans[day.key].morning_snack as MealData)}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="lunch">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">13:00</Badge>
                            Almoço
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {renderMealFields(day.key, 'lunch', weekPlans[day.key].lunch as MealData)}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="afternoon_snack">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">16:00</Badge>
                            Lanche da Tarde
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {renderMealFields(day.key, 'afternoon_snack', weekPlans[day.key].afternoon_snack as MealData)}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="dinner">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">20:00</Badge>
                            Jantar
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {renderMealFields(day.key, 'dinner', weekPlans[day.key].dinner as MealData)}
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="evening_snack">
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">22:00</Badge>
                            Ceia
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {renderMealFields(day.key, 'evening_snack', weekPlans[day.key].evening_snack as MealData)}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    <div className="mt-4">
                      <Label>Observações do Dia</Label>
                      <Textarea
                        value={weekPlans[day.key].notes}
                        onChange={(e) => handleDayFieldChange(day.key, 'notes', e.target.value)}
                        placeholder="Observações específicas para este dia..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>

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
              {loading ? 'A guardar...' : 'Criar Plano Nutricional'}
            </Button>
          </div>
        </form>

        {/* Modal para Copiar Dia */}
        <Dialog open={copyModalOpen} onOpenChange={setCopyModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                Copiar Plano para {weekDays.find(d => d.key === currentDayToCopy)?.label}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Selecione de qual dia deseja copiar o plano nutricional:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {weekDays
                  .filter(d => d.key !== currentDayToCopy)
                  .map(day => (
                    <Button
                      key={day.key}
                      variant="outline"
                      className="justify-start h-auto py-3"
                      onClick={() => copyDayPlan(day.key)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">{day.label}</span>
                        {weekPlans[day.key].total_calories && (
                          <span className="text-xs text-muted-foreground">
                            {weekPlans[day.key].total_calories} kcal
                          </span>
                        )}
                      </div>
                    </Button>
                  ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};
