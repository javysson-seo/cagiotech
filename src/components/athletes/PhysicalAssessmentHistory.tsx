import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Activity, TrendingUp, TrendingDown, Calendar, Ruler, Weight } from 'lucide-react';
import { usePhysicalAssessments } from '@/hooks/usePhysicalAssessments';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PhysicalAssessmentHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: any;
  companyId: string;
}

export const PhysicalAssessmentHistory = ({
  isOpen,
  onClose,
  athlete,
  companyId,
}: PhysicalAssessmentHistoryProps) => {
  const { data: assessments = [], isLoading } = usePhysicalAssessments(athlete?.id, companyId);
  const [selectedComparison, setSelectedComparison] = useState<number>(0);

  if (isLoading) {
    return null;
  }

  // Preparar dados para gráficos
  const chartData = assessments
    .slice()
    .reverse()
    .map((assessment: any) => ({
      date: format(new Date(assessment.assessment_date), 'dd/MM/yy', { locale: ptBR }),
      fullDate: assessment.assessment_date,
      peso: assessment.weight || 0,
      gordura: assessment.body_fat_percentage || 0,
      musculo: assessment.muscle_mass || 0,
      peito: (assessment.measurements as any)?.chest || 0,
      cintura: (assessment.measurements as any)?.waist || 0,
      anca: (assessment.measurements as any)?.hip || 0,
      bracoDir: (assessment.measurements as any)?.arm_right || 0,
      bracoEsq: (assessment.measurements as any)?.arm_left || 0,
      pernaDir: (assessment.measurements as any)?.thigh_right || 0,
      pernaEsq: (assessment.measurements as any)?.thigh_left || 0,
    }));

  // Calcular IMC
  const calculateIMC = (weight: number, height: number) => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Calcular mudanças
  const calculateChange = (current: number, previous: number) => {
    if (!previous || !current) return { value: 0, percentage: 0 };
    const diff = current - previous;
    const percentage = ((diff / previous) * 100).toFixed(1);
    return { value: diff.toFixed(1), percentage };
  };

  const latestAssessment = assessments[0];
  const previousAssessment = assessments[1];

  const weightChange = previousAssessment
    ? calculateChange(latestAssessment?.weight || 0, previousAssessment?.weight || 0)
    : { value: 0, percentage: 0 };

  const bfChange = previousAssessment
    ? calculateChange(
        latestAssessment?.body_fat_percentage || 0,
        previousAssessment?.body_fat_percentage || 0
      )
    : { value: 0, percentage: 0 };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Activity className="h-6 w-6 text-primary" />
            Histórico de Avaliações - {athlete?.name}
          </DialogTitle>
        </DialogHeader>

        {assessments.length === 0 ? (
          <Card className="p-8">
            <div className="text-center text-muted-foreground">
              <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma avaliação física registrada ainda.</p>
            </div>
          </Card>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="charts">Gráficos</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>

            {/* VISÃO GERAL */}
            <TabsContent value="overview" className="space-y-4">
              {latestAssessment && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Peso */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Weight className="h-4 w-4" />
                        Peso
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {latestAssessment.weight || '-'} kg
                      </div>
                      {previousAssessment && (
                        <div className="flex items-center gap-1 text-sm mt-2">
                          {Number(weightChange.value) > 0 ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                          <span className={Number(weightChange.value) > 0 ? 'text-red-500' : 'text-green-500'}>
                            {weightChange.value} kg ({weightChange.percentage}%)
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* IMC */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        IMC
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {calculateIMC(latestAssessment.weight, latestAssessment.height)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">
                        Altura: {latestAssessment.height || '-'} cm
                      </div>
                    </CardContent>
                  </Card>

                  {/* Gordura Corporal */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        % Gordura
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {latestAssessment.body_fat_percentage || '-'}%
                      </div>
                      {previousAssessment && (
                        <div className="flex items-center gap-1 text-sm mt-2">
                          {Number(bfChange.value) > 0 ? (
                            <TrendingUp className="h-4 w-4 text-red-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-500" />
                          )}
                          <span className={Number(bfChange.value) > 0 ? 'text-red-500' : 'text-green-500'}>
                            {bfChange.value}% ({bfChange.percentage}%)
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Última Avaliação Detalhada */}
              {latestAssessment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="h-5 w-5" />
                      Medidas Atuais (cm)
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Última avaliação:{' '}
                      {format(new Date(latestAssessment.assessment_date), "dd 'de' MMMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Peito</div>
                        <div className="text-lg font-semibold">
                          {(latestAssessment.measurements as any)?.chest || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Cintura</div>
                        <div className="text-lg font-semibold">
                          {(latestAssessment.measurements as any)?.waist || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Anca</div>
                        <div className="text-lg font-semibold">
                          {(latestAssessment.measurements as any)?.hip || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Massa Muscular</div>
                        <div className="text-lg font-semibold">
                          {latestAssessment.muscle_mass || '-'} kg
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Braço Direito</div>
                        <div className="text-lg font-semibold">
                          {(latestAssessment.measurements as any)?.arm_right || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Braço Esquerdo</div>
                        <div className="text-lg font-semibold">
                          {(latestAssessment.measurements as any)?.arm_left || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Perna Direita</div>
                        <div className="text-lg font-semibold">
                          {(latestAssessment.measurements as any)?.thigh_right || '-'}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Perna Esquerda</div>
                        <div className="text-lg font-semibold">
                          {(latestAssessment.measurements as any)?.thigh_left || '-'}
                        </div>
                      </div>
                    </div>

                    {latestAssessment.notes && (
                      <div className="mt-4 p-3 bg-muted rounded-lg">
                        <div className="text-sm font-medium mb-1">Observações:</div>
                        <div className="text-sm text-muted-foreground">{latestAssessment.notes}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* GRÁFICOS */}
            <TabsContent value="charts" className="space-y-6">
              {chartData.length > 1 ? (
                <>
                  {/* Gráfico de Peso e Gordura */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução de Peso e Gordura Corporal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="peso"
                            stroke="#8884d8"
                            name="Peso (kg)"
                            strokeWidth={2}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="gordura"
                            stroke="#82ca9d"
                            name="% Gordura"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Gráfico de Medidas Corporais */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução das Medidas Corporais (cm)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="peito" fill="#8884d8" name="Peito" />
                          <Bar dataKey="cintura" fill="#82ca9d" name="Cintura" />
                          <Bar dataKey="anca" fill="#ffc658" name="Anca" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Gráfico de Braços e Pernas */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução de Braços e Pernas (cm)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="bracoDir"
                            stroke="#8884d8"
                            name="Braço Direito"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="bracoEsq"
                            stroke="#82ca9d"
                            name="Braço Esquerdo"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="pernaDir"
                            stroke="#ffc658"
                            name="Perna Direita"
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="pernaEsq"
                            stroke="#ff8042"
                            name="Perna Esquerda"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="p-8">
                  <div className="text-center text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>São necessárias pelo menos 2 avaliações para gerar gráficos comparativos.</p>
                  </div>
                </Card>
              )}
            </TabsContent>

            {/* HISTÓRICO */}
            <TabsContent value="history" className="space-y-4">
              <div className="space-y-3">
                {assessments.map((assessment: any, index: number) => (
                  <Card key={assessment.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <CardTitle className="text-base">
                              {format(new Date(assessment.assessment_date), "dd 'de' MMMM 'de' yyyy", {
                                locale: ptBR,
                              })}
                            </CardTitle>
                            {index === 0 && (
                              <Badge className="mt-1" variant="default">
                                Mais Recente
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Peso</div>
                          <div className="text-sm font-semibold">{assessment.weight || '-'} kg</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Altura</div>
                          <div className="text-sm font-semibold">{assessment.height || '-'} cm</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">% Gordura</div>
                          <div className="text-sm font-semibold">
                            {assessment.body_fat_percentage || '-'}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">IMC</div>
                          <div className="text-sm font-semibold">
                            {calculateIMC(assessment.weight, assessment.height)}
                          </div>
                        </div>
                      </div>

                      {assessment.measurements && (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mt-3 pt-3 border-t">
                          <div>
                            <div className="text-xs text-muted-foreground">Peito</div>
                            <div className="text-sm">{(assessment.measurements as any).chest || '-'} cm</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Cintura</div>
                            <div className="text-sm">{(assessment.measurements as any).waist || '-'} cm</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Anca</div>
                            <div className="text-sm">{(assessment.measurements as any).hip || '-'} cm</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Braços</div>
                            <div className="text-sm">
                              {(assessment.measurements as any).arm_right || '-'} /{' '}
                              {(assessment.measurements as any).arm_left || '-'} cm
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Pernas</div>
                            <div className="text-sm">
                              {(assessment.measurements as any).thigh_right || '-'} /{' '}
                              {(assessment.measurements as any).thigh_left || '-'} cm
                            </div>
                          </div>
                        </div>
                      )}

                      {assessment.notes && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-xs">{assessment.notes}</div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};