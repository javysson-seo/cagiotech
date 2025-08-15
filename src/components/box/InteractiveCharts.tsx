
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users,
  Euro,
  Calendar
} from 'lucide-react';

interface InteractiveChartsProps {
  filters: {
    dateRange: any;
    trainer: string;
    modality: string;
    room: string;
  };
}

export const InteractiveCharts: React.FC<InteractiveChartsProps> = ({ filters }) => {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data - em produção viria da API com base nos filtros
  const revenueData = [
    { mes: 'Jan', receitas: 8200, despesas: 4500, lucro: 3700, membros: 120, aulas: 45 },
    { mes: 'Fev', receitas: 8400, despesas: 4600, lucro: 3800, membros: 125, aulas: 48 },
    { mes: 'Mar', receitas: 8600, despesas: 4400, lucro: 4200, membros: 135, aulas: 52 },
    { mes: 'Abr', receitas: 8300, despesas: 4700, lucro: 3600, membros: 140, aulas: 49 },
    { mes: 'Mai', receitas: 8750, despesas: 4800, lucro: 3950, membros: 147, aulas: 55 },
  ];

  const attendanceData = [
    { dia: 'Seg', manha: 25, tarde: 30, noite: 40 },
    { dia: 'Ter', manha: 20, tarde: 35, noite: 45 },
    { dia: 'Qua', manha: 30, tarde: 25, noite: 38 },
    { dia: 'Qui', manha: 22, tarde: 32, noite: 42 },
    { dia: 'Sex', manha: 28, tarde: 40, noite: 50 },
    { dia: 'Sab', manha: 35, tarde: 30, noite: 25 },
    { dia: 'Dom', manha: 15, tarde: 20, noite: 18 },
  ];

  const modalityPerformance = [
    { modalidade: 'CrossFit', participantes: 95, receita: 2800, satisfacao: 4.8 },
    { modalidade: 'Funcional', participantes: 67, receita: 2100, satisfacao: 4.6 },
    { modalidade: 'Yoga', participantes: 42, receita: 1200, satisfacao: 4.9 },
    { modalidade: 'HIIT', participantes: 38, receita: 1100, satisfacao: 4.7 },
    { modalidade: 'Mobilidade', participantes: 28, receita: 800, satisfacao: 4.5 },
  ];

  const trainerPerformance = [
    { trainer: 'João Silva', aulas: 28, participantes: 180, receita: 1800, avaliacao: 4.9 },
    { trainer: 'Maria Santos', aulas: 25, participantes: 165, receita: 1650, avaliacao: 4.8 },
    { trainer: 'Pedro Costa', aulas: 22, participantes: 140, receita: 1400, avaliacao: 4.7 },
    { trainer: 'Ana Ferreira', aulas: 20, participantes: 125, receita: 1250, avaliacao: 4.6 },
  ];

  const membershipTrends = [
    { name: 'Mensais', value: 65, growth: '+8%', color: '#bed700' },
    { name: 'Trimestrais', value: 25, growth: '+12%', color: '#8b5cf6' },
    { name: 'Anuais', value: 10, growth: '+15%', color: '#06b6d4' },
  ];

  const renderChart = () => {
    const ChartComponent = chartType === 'line' ? LineChart : BarChart;
    
    return (
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="mes" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
            formatter={(value: number) => [`€${value}`, '']}
          />
          <Legend />
          {chartType === 'line' ? (
            <>
              <Line type="monotone" dataKey="receitas" stroke="#bed700" strokeWidth={3} name="Receitas" />
              <Line type="monotone" dataKey="despesas" stroke="#ef4444" strokeWidth={3} name="Despesas" />
              <Line type="monotone" dataKey="lucro" stroke="#3b82f6" strokeWidth={3} name="Lucro" />
            </>
          ) : (
            <>
              <Bar dataKey="receitas" fill="#bed700" name="Receitas" />
              <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
              <Bar dataKey="lucro" fill="#3b82f6" name="Lucro" />
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="space-y-6">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Análise Detalhada</h3>
        <div className="flex gap-2">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Receitas/Despesas</SelectItem>
              <SelectItem value="members">Membros</SelectItem>
              <SelectItem value="classes">Aulas</SelectItem>
              <SelectItem value="attendance">Frequência</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            Linhas
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Barras
          </Button>
        </div>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Evolução Financeira
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Secondary Charts */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Frequência Semanal</TabsTrigger>
          <TabsTrigger value="modalities">Performance Modalidades</TabsTrigger>
          <TabsTrigger value="trainers">Performance Trainers</TabsTrigger>
          <TabsTrigger value="membership">Distribuição Planos</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Frequência por Período
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="dia" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="manha" stackId="1" stroke="#bed700" fill="#bed700" fillOpacity={0.6} name="Manhã" />
                  <Area type="monotone" dataKey="tarde" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} name="Tarde" />
                  <Area type="monotone" dataKey="noite" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} name="Noite" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modalities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Performance das Modalidades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={modalityPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#666" />
                  <YAxis dataKey="modalidade" type="category" stroke="#666" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="participantes" fill="#bed700" name="Participantes" />
                  <Bar dataKey="receita" fill="#3b82f6" name="Receita (€)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainers">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Performance dos Trainers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={trainerPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="trainer" stroke="#666" />
                  <YAxis yAxisId="left" stroke="#666" />
                  <YAxis yAxisId="right" orientation="right" stroke="#666" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="aulas" fill="#bed700" name="Aulas" />
                  <Bar yAxisId="left" dataKey="participantes" fill="#3b82f6" name="Participantes" />
                  <Line yAxisId="right" type="monotone" dataKey="avaliacao" stroke="#ef4444" strokeWidth={3} name="Avaliação" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="membership">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Distribuição de Planos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={membershipTrends}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, value, growth }) => `${name}: ${value}% (${growth})`}
                  >
                    {membershipTrends.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Percentagem']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
