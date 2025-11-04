import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Trophy, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useWorkoutAssignments } from '@/hooks/useWorkoutAssignments';
import { useCompany } from '@/contexts/CompanyContext';

interface AthleteWorkoutHistoryProps {
  athleteId: string;
}

export const AthleteWorkoutHistory: React.FC<AthleteWorkoutHistoryProps> = ({ athleteId }) => {
  const { currentCompany } = useCompany();
  const { assignments, isLoading } = useWorkoutAssignments(currentCompany?.id || '', athleteId);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: { variant: 'default' as const, icon: Clock, label: 'Em Progresso' },
      completed: { variant: 'default' as const, icon: CheckCircle, label: 'Concluído' },
      cancelled: { variant: 'destructive' as const, icon: XCircle, label: 'Cancelado' },
    };

    const config = styles[status as keyof typeof styles] || styles.active;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="text-center p-4">Carregando histórico...</div>;
  }

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum plano de treino atribuído</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Trophy className="h-5 w-5" />
        Histórico de Treinos
      </h3>

      {assignments.map((assignment: any) => (
        <Card key={assignment.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{assignment.workout_plan?.name}</CardTitle>
                {assignment.workout_plan?.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {assignment.workout_plan.description}
                  </p>
                )}
              </div>
              {getStatusBadge(assignment.status)}
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Data de Início</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(assignment.start_date), "dd/MM/yyyy", { locale: ptBR })}
                </p>
              </div>

              {assignment.end_date && (
                <div>
                  <p className="text-muted-foreground">Data de Término</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {format(new Date(assignment.end_date), "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              )}
            </div>

            {assignment.workout_plan?.difficulty && (
              <div>
                <p className="text-sm text-muted-foreground">Dificuldade</p>
                <Badge variant="outline">{assignment.workout_plan.difficulty}</Badge>
              </div>
            )}

            {assignment.assigned_by_trainer && (
              <div>
                <p className="text-sm text-muted-foreground">Atribuído por</p>
                <p className="text-sm font-medium">{assignment.assigned_by_trainer.name}</p>
              </div>
            )}

            {assignment.notes && (
              <div>
                <p className="text-sm text-muted-foreground">Observações</p>
                <p className="text-sm">{assignment.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
