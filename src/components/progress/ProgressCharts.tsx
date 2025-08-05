
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  Activity,
  Target
} from 'lucide-react';

export const ProgressCharts: React.FC = () => {
  const [timeRange, setTimeRange] = useState('3months');

  // Mock data - em produção virá da API/Supabase
  const attendanceData = [
    { month: 'Out', aulas: 8, objetivo: 12 },
    { month: 'Nov', aulas: 15, objetivo: 12 },
    { month: 'Dez', aulas: 12, objetivo: 12 },
    { month: 'Jan', aulas: 18, objetivo: 15 }
  ];

  const modalityData = [
    { name: 'CrossFit', value: 45, color: '#3B82F6' },
    { name: 'Yoga', value: 25, color: '#10B981' },
    { name: 'Functional', value: 20, color: '#F59E0B' },
    { name: 'Pilates', value: 10, color: '#8B5CF6' }
  ];

  const weeklyProgressData = [
    { week: 'S1', aulas: 3, pontos: 150 },
    { week: 'S2', aulas: 4, pontos: 200 },
    { week: 'S3', aulas: 2, pontos: 100 },
    { week: 'S4', aulas: 5, pontos: 250 }
  ];

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Análise Detalhada</h2>
        <div className="flex space-x-2">
          <Button
            variant={timeRange === '1month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('1month')}
          >
            1 Mês
          </Button>
          <Button
            variant={timeRange === '3months' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('3months')}
          >
            3 Meses
          </Button>
          <Button
            variant={timeRange === '6months' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('6months')}
          >
            6 Meses
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Attendance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Frequência Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="aulas" fill="#3B82F6" name="Aulas Feitas" />
                <Bar dataKey="objetivo" fill="#E5E7EB" name="Objetivo" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Modality Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Distribuição por Modalidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={modalityData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {modalityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Progresso Semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={weeklyProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="aulas" fill="#3B82F6" name="Aulas" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="pontos" 
                stroke="#10B981" 
                strokeWidth={3}
                name="Pontos"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="text-center p-6">
            <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold">+23%</p>
            <p className="text-sm text-muted-foreground">Melhoria vs mês anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold">92%</p>
            <p className="text-sm text-muted-foreground">Taxa de comparecimento</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <Activity className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold">4.2</p>
            <p className="text-sm text-muted-foreground">Aulas por semana</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="text-center p-6">
            <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold">3/4</p>
            <p className="text-sm text-muted-foreground">Objetivos atingidos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
