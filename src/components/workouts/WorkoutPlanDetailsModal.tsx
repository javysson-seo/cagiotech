import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dumbbell,
  Calendar,
  Target,
  User,
  Clock,
  PlayCircle,
  Edit,
  Trash2,
} from 'lucide-react';
import { WorkoutPlan } from '@/hooks/useWorkoutPlans';

interface WorkoutPlanDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workoutPlan: WorkoutPlan | null;
  onEdit?: (plan: WorkoutPlan) => void;
  onDelete?: (planId: string) => void;
}

export const WorkoutPlanDetailsModal: React.FC<WorkoutPlanDetailsModalProps> = ({
  open,
  onOpenChange,
  workoutPlan,
  onEdit,
  onDelete,
}) => {
  if (!workoutPlan) return null;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Iniciante';
      case 'intermediate':
        return 'Intermediário';
      case 'advanced':
        return 'Avançado';
      default:
        return difficulty;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">
                {workoutPlan.name}
              </DialogTitle>
              <div className="flex items-center gap-2">
                {workoutPlan.difficulty && (
                  <Badge className={getDifficultyColor(workoutPlan.difficulty)}>
                    {getDifficultyLabel(workoutPlan.difficulty)}
                  </Badge>
                )}
                <Badge variant={workoutPlan.is_active ? 'default' : 'secondary'}>
                  {workoutPlan.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(workoutPlan)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    if (confirm('Tem certeza que deseja excluir este plano?')) {
                      onDelete(workoutPlan.id);
                      onOpenChange(false);
                    }
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {workoutPlan.description && (
            <div>
              <h3 className="font-semibold mb-2">Descrição</h3>
              <p className="text-muted-foreground">{workoutPlan.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Duração</span>
              </div>
              <p className="text-2xl font-bold">
                {workoutPlan.duration_weeks || 0}
              </p>
              <p className="text-xs text-muted-foreground">semanas</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Target className="h-4 w-4" />
                <span className="text-sm">Frequência</span>
              </div>
              <p className="text-2xl font-bold">
                {workoutPlan.frequency_per_week || 0}
              </p>
              <p className="text-xs text-muted-foreground">vezes/semana</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Dumbbell className="h-4 w-4" />
                <span className="text-sm">Exercícios</span>
              </div>
              <p className="text-2xl font-bold">
                {workoutPlan.exercises?.length || 0}
              </p>
              <p className="text-xs text-muted-foreground">no plano</p>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <User className="h-4 w-4" />
                <span className="text-sm">Tipo</span>
              </div>
              <p className="text-sm font-semibold mt-1">
                {workoutPlan.athlete_id ? 'Personalizado' : 'Genérico'}
              </p>
            </Card>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Dumbbell className="h-5 w-5" />
              Exercícios ({workoutPlan.exercises?.length || 0})
            </h3>

            {!workoutPlan.exercises || workoutPlan.exercises.length === 0 ? (
              <Card className="p-8 text-center">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">
                  Nenhum exercício cadastrado neste plano
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {workoutPlan.exercises.map((exercise: any, index: number) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-primary">
                            {index + 1}.
                          </span>
                          <h4 className="font-semibold text-lg">
                            {exercise.name}
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>
                              {exercise.sets} série{exercise.sets > 1 ? 's' : ''}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Dumbbell className="h-3 w-3" />
                            <span>{exercise.reps} repetições</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{exercise.rest_seconds}s descanso</span>
                          </div>
                        </div>

                        {exercise.notes && (
                          <p className="text-sm text-muted-foreground italic">
                            💡 {exercise.notes}
                          </p>
                        )}

                        {exercise.video_url && (
                          <a
                            href={exercise.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                          >
                            <PlayCircle className="h-4 w-4" />
                            Ver vídeo demonstrativo
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {(workoutPlan as any).trainer && (
            <>
              <Separator />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  Criado por:{' '}
                  <span className="font-semibold text-foreground">
                    {(workoutPlan as any).trainer.name}
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
