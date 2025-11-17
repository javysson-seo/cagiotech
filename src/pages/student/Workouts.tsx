import React from 'react';
import { ResponsiveStudentSidebar } from '@/components/student/ResponsiveStudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { Footer } from '@/components/Footer';
import { useCurrentAthlete } from '@/hooks/useCurrentAthlete';
import { useWorkoutAssignments } from '@/hooks/useWorkoutAssignments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dumbbell, Calendar, Target, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Workouts: React.FC = () => {
  const { athlete, loading: athleteLoading } = useCurrentAthlete();
  const { assignments, isLoading: assignmentsLoading } = useWorkoutAssignments(athlete?.id || '', athlete?.company_id || '');

  const isLoading = athleteLoading || assignmentsLoading;

  return (
    <div className="flex min-h-screen bg-background">
      <ResponsiveStudentSidebar />
      
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Dumbbell className="w-6 h-6" />
                Meus Treinos
              </h1>
              <p className="text-muted-foreground">
                Treinos atribuídos pelo seu treinador
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : !athlete ? (
              <Alert>
                <AlertDescription>
                  Não foi possível carregar seus dados. Por favor, tente novamente.
                </AlertDescription>
              </Alert>
            ) : assignments && assignments.length > 0 ? (
              <div className="grid gap-4">
                {assignments.map((assignment: any) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Dumbbell className="w-5 h-5 text-primary" />
                          {assignment.workout_plans?.name || 'Treino'}
                        </span>
                        {assignment.status === 'completed' && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        {assignment.workout_plans?.description || 'Sem descrição'}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {assignment.start_date && format(new Date(assignment.start_date), 'dd MMM yyyy', { locale: ptBR })}
                            {assignment.end_date && ` - ${format(new Date(assignment.end_date), 'dd MMM yyyy', { locale: ptBR })}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-muted-foreground" />
                          <span className="capitalize">{assignment.status === 'active' ? 'Ativo' : assignment.status === 'completed' ? 'Concluído' : 'Pendente'}</span>
                        </div>
                      </div>

                      {assignment.notes && (
                        <div className="bg-muted p-3 rounded-md">
                          <p className="text-sm"><strong>Observações:</strong> {assignment.notes}</p>
                        </div>
                      )}

                      <Button 
                        className="w-full"
                        variant="outline"
                      >
                        Ver Detalhes do Treino
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Dumbbell className="w-16 h-16 text-muted-foreground opacity-50" />
                  <div className="text-center">
                    <p className="text-lg font-medium text-foreground">Nenhum treino atribuído</p>
                    <p className="text-sm text-muted-foreground">
                      Seu treinador ainda não atribuiu nenhum treino para você.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
