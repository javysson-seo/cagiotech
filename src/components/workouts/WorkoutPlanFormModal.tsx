import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Dumbbell, Calendar, Target } from 'lucide-react';
import { toast } from 'sonner';
import { useAthletes } from '@/hooks/useAthletes';
import { useTrainers } from '@/hooks/useTrainers';
import { useCompany } from '@/contexts/CompanyContext';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  notes?: string;
  video_url?: string;
}

interface WorkoutPlanFormData {
  id?: string;
  name: string;
  description: string;
  athlete_id?: string;
  trainer_id: string;
  duration_weeks: number;
  frequency_per_week: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: Exercise[];
  is_active: boolean;
}

interface WorkoutPlanFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutPlan?: any;
  onSave: (data: WorkoutPlanFormData) => void;
}

export const WorkoutPlanFormModal: React.FC<WorkoutPlanFormModalProps> = ({
  open,
  onOpenChange,
  workoutPlan,
  onSave,
}) => {
  const { currentCompany } = useCompany();
  const { athletes } = useAthletes();
  const { trainers } = useTrainers();

  const [formData, setFormData] = useState<WorkoutPlanFormData>({
    name: '',
    description: '',
    athlete_id: undefined,
    trainer_id: '',
    duration_weeks: 4,
    frequency_per_week: 3,
    difficulty: 'intermediate',
    exercises: [],
    is_active: true,
  });

  const [currentExercise, setCurrentExercise] = useState<Exercise>({
    name: '',
    sets: 3,
    reps: '10',
    rest_seconds: 60,
    notes: '',
    video_url: '',
  });

  useEffect(() => {
    if (workoutPlan) {
      setFormData({
        id: workoutPlan.id,
        name: workoutPlan.name || '',
        description: workoutPlan.description || '',
        athlete_id: workoutPlan.athlete_id,
        trainer_id: workoutPlan.trainer_id || '',
        duration_weeks: workoutPlan.duration_weeks || 4,
        frequency_per_week: workoutPlan.frequency_per_week || 3,
        difficulty: workoutPlan.difficulty || 'intermediate',
        exercises: workoutPlan.exercises || [],
        is_active: workoutPlan.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        athlete_id: undefined,
        trainer_id: '',
        duration_weeks: 4,
        frequency_per_week: 3,
        difficulty: 'intermediate',
        exercises: [],
        is_active: true,
      });
    }
  }, [workoutPlan, open]);

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error('Nome do plano é obrigatório');
      return;
    }

    if (!formData.trainer_id) {
      toast.error('Selecione um treinador');
      return;
    }

    if (formData.exercises.length === 0) {
      toast.error('Adicione pelo menos um exercício');
      return;
    }

    onSave(formData);
  };

  const addExercise = () => {
    if (!currentExercise.name.trim()) {
      toast.error('Nome do exercício é obrigatório');
      return;
    }

    setFormData({
      ...formData,
      exercises: [...formData.exercises, { ...currentExercise }],
    });

    setCurrentExercise({
      name: '',
      sets: 3,
      reps: '10',
      rest_seconds: 60,
      notes: '',
      video_url: '',
    });

    toast.success('Exercício adicionado');
  };

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    });
    toast.success('Exercício removido');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {workoutPlan ? 'Editar Plano de Treino' : 'Novo Plano de Treino'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="exercises">
              Exercícios ({formData.exercises.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Treino de Força - Semana 1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="difficulty">Dificuldade</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Iniciante</SelectItem>
                    <SelectItem value="intermediate">Intermediário</SelectItem>
                    <SelectItem value="advanced">Avançado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="trainer">Treinador *</Label>
                <Select
                  value={formData.trainer_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, trainer_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o treinador" />
                  </SelectTrigger>
                  <SelectContent>
                    {trainers.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Nenhum treinador cadastrado
                      </div>
                    ) : (
                      trainers.map((trainer) => (
                        <SelectItem key={trainer.id} value={trainer.id}>
                          {trainer.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="athlete">Aluno (Opcional)</Label>
                <Select
                  value={formData.athlete_id || 'none'}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      athlete_id: value === 'none' ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Plano genérico" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Plano genérico</SelectItem>
                    {athletes.map((athlete) => (
                      <SelectItem key={athlete.id} value={athlete.id}>
                        {athlete.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duração (semanas)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration_weeks}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration_weeks: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frequência (vezes/semana)</Label>
                <Input
                  id="frequency"
                  type="number"
                  min="1"
                  max="7"
                  value={formData.frequency_per_week}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frequency_per_week: parseInt(e.target.value) || 1,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Descreva os objetivos e características deste plano..."
                rows={4}
              />
            </div>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4">
            <Card className="p-4 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Exercício
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Exercício</Label>
                  <Input
                    value={currentExercise.name}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        name: e.target.value,
                      })
                    }
                    placeholder="Ex: Agachamento"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Séries</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentExercise.sets}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        sets: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Repetições</Label>
                  <Input
                    value={currentExercise.reps}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        reps: e.target.value,
                      })
                    }
                    placeholder="Ex: 10, 8-12, AMRAP"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Descanso (segundos)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={currentExercise.rest_seconds}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        rest_seconds: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Notas</Label>
                  <Input
                    value={currentExercise.notes}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        notes: e.target.value,
                      })
                    }
                    placeholder="Observações técnicas..."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>URL do Vídeo (Opcional)</Label>
                  <Input
                    value={currentExercise.video_url}
                    onChange={(e) =>
                      setCurrentExercise({
                        ...currentExercise,
                        video_url: e.target.value,
                      })
                    }
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              <Button
                onClick={addExercise}
                className="w-full"
                style={{ backgroundColor: '#aeca12' }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar à Lista
              </Button>
            </Card>

            <div className="space-y-2">
              <h3 className="font-semibold">
                Exercícios do Plano ({formData.exercises.length})
              </h3>

              {formData.exercises.length === 0 ? (
                <Card className="p-8 text-center">
                  <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">
                    Nenhum exercício adicionado ainda
                  </p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {formData.exercises.map((exercise, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Dumbbell className="h-4 w-4 text-primary" />
                            <h4 className="font-semibold">{exercise.name}</h4>
                          </div>
                          <div className="flex gap-4 text-sm text-muted-foreground">
                            <span>{exercise.sets} séries</span>
                            <span>{exercise.reps} reps</span>
                            <span>{exercise.rest_seconds}s descanso</span>
                          </div>
                          {exercise.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {exercise.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeExercise(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ backgroundColor: '#aeca12' }}
            className="text-white"
          >
            {workoutPlan ? 'Atualizar Plano' : 'Criar Plano'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
