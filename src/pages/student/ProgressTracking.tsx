import React from 'react';
import { ResponsiveStudentSidebar } from '@/components/student/ResponsiveStudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { Footer } from '@/components/Footer';
import { useCurrentAthlete } from '@/hooks/useCurrentAthlete';
import { usePhysicalAssessments } from '@/hooks/usePhysicalAssessments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Calendar, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const ProgressTracking: React.FC = () => {
  const { athlete, loading: athleteLoading } = useCurrentAthlete();
  const { data: assessments, isLoading: assessmentsLoading } = usePhysicalAssessments(athlete?.id || '', athlete?.company_id || '');

  const isLoading = athleteLoading || assessmentsLoading;

  return (
    <div className="flex min-h-screen bg-background">
      <ResponsiveStudentSidebar />
      
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="w-6 h-6" />
                Meu Progresso
              </h1>
              <p className="text-muted-foreground">
                Acompanhe sua evolução ao longo do tempo
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
                      <Skeleton className="h-32 w-full" />
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
            ) : assessments && assessments.length > 0 ? (
              <div className="grid gap-4">
                {assessments.map((assessment: any) => (
                  <Card key={assessment.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-primary" />
                          Avaliação Física
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(assessment.assessment_date), 'dd MMM yyyy', { locale: ptBR })}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {assessment.weight && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Peso</p>
                            <p className="text-lg font-semibold">{assessment.weight} kg</p>
                          </div>
                        )}
                        {assessment.height && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Altura</p>
                            <p className="text-lg font-semibold">{assessment.height} cm</p>
                          </div>
                        )}
                        {assessment.body_fat && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">% Gordura</p>
                            <p className="text-lg font-semibold">{assessment.body_fat}%</p>
                          </div>
                        )}
                        {assessment.muscle_mass && (
                          <div className="bg-muted p-3 rounded-lg">
                            <p className="text-xs text-muted-foreground">Massa Muscular</p>
                            <p className="text-lg font-semibold">{assessment.muscle_mass} kg</p>
                          </div>
                        )}
                      </div>

                      {assessment.notes && (
                        <div className="mt-4 bg-primary/5 p-3 rounded-md">
                          <p className="text-sm"><strong>Observações:</strong> {assessment.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
                  <Activity className="w-16 h-16 text-muted-foreground opacity-50" />
                  <div className="text-center">
                    <p className="text-lg font-medium text-foreground">Nenhuma avaliação registrada</p>
                    <p className="text-sm text-muted-foreground">
                      Seu treinador ainda não registrou nenhuma avaliação física.
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
