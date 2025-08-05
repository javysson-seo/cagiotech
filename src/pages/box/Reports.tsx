
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Download,
  TrendingUp,
  Users,
  Euro,
  Calendar,
  Activity
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('last_month');
  const [reportType, setReportType] = useState('overview');

  // Mock data for charts
  const monthlyRevenue = [
    { month: 'Jan', receita: 8200, despesas: 4500, lucro: 3700 },
    { month: 'Fev', receita: 8400, despesas: 4600, lucro: 3800 },
    { month: 'Mar', receita: 8600, despesas: 4400, lucro: 4200 },
    { month: 'Abr', receita: 8300, despesas: 4700, lucro: 3600 },
    { month: 'Mai', receita: 8750, despesas: 4800, lucro: 3950 },
  ];

  const membershipGrowth = [
    { month: 'Jan', novos: 12, cancelamentos: 5, total: 140 },
    { month: 'Fev', novos: 15, cancelamentos: 3, total: 152 },
    { month: 'Mar', novos: 18, cancelamentos: 7, total: 163 },
    { month: 'Abr', novos: 14, cancelamentos: 4, total: 173 },
    { month: 'Mai', novos: 16, cancelamentos: 2, total: 187 },
  ];

  const classAttendance = [
    { modalidade: 'CrossFit', participacoes: 320 },
    { modalidade: 'Funcional', participacoes: 245 },
    { modalidade: 'Yoga', participacoes: 180 },
    { modalidade: 'HIIT', participacoes: 156 },
    { modalidade: 'Pilates', participacoes: 98 },
  ];

  const planDistribution = [
    { name: 'Ilimitado', value: 45, color: '#3b82f6' },
    { name: '8x Semana', value: 30, color: '#8b5cf6' },
    { name: '4x Semana', value: 20, color: '#06b6d4' },
    { name: '2x Semana', value: 5, color: '#10b981' },
  ];

  const kpiData = {
    totalRevenue: 43750,
    totalMembers: 187,
    avgAttendance: 82,
    memberRetention: 94
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Relatórios & Analytics
                </h1>
                <p className="text-muted-foreground">
                  Análise de performance e métricas da BOX
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last_week">Última Semana</SelectItem>
                    <SelectItem value="last_month">Último Mês</SelectItem>
                    <SelectItem value="last_3_months">Últimos 3 Meses</SelectItem>
                    <SelectItem value="last_year">Último Ano</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Euro className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Receita Total</p>
                      <p className="text-2xl font-bold">€{kpiData.totalRevenue.toLocaleString()}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">+8.2% vs. anterior</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Membros</p>
                      <p className="text-2xl font-bold">{kpiData.totalMembers}</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">+12 este mês</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Taxa Presença</p>
                      <p className="text-2xl font-bold">{kpiData.avgAttendance}%</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">+3% vs. anterior</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Retenção</p>
                      <p className="text-2xl font-bold">{kpiData.memberRetention}%</p>
                      <div className="flex items-center mt-1">
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        <span className="text-xs text-green-600">+1.2% vs. anterior</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Receitas vs Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`€${value}`, '']}
                      />
                      <Legend />
                      <Bar dataKey="receita" fill="#10b981" name="Receita" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="despesas" fill="#ef4444" name="Despesas" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="lucro" fill="#3b82f6" name="Lucro" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Membership Growth */}
              <Card>
                <CardHeader>
                  <CardTitle>Evolução de Membros</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={membershipGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#666" fontSize={12} />
                      <YAxis stroke="#666" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Total Membros"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="novos" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Novos Membros"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Class Attendance */}
              <Card>
                <CardHeader>
                  <CardTitle>Participação por Modalidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={classAttendance} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" stroke="#666" fontSize={12} />
                      <YAxis 
                        dataKey="modalidade" 
                        type="category" 
                        stroke="#666" 
                        fontSize={12}
                        width={80}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => [`${value} participações`, '']}
                      />
                      <Bar 
                        dataKey="participacoes" 
                        fill="#8b5cf6" 
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Plan Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição de Planos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={planDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {planDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Summary Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Trainers - Horas Trabalhadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Carlos Santos', hours: 68, classes: 34 },
                      { name: 'Ana Costa', hours: 52, classes: 26 },
                      { name: 'Pedro Silva', hours: 45, classes: 30 },
                      { name: 'Maria Oliveira', hours: 38, classes: 19 }
                    ].map((trainer, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{trainer.name}</p>
                          <p className="text-sm text-muted-foreground">{trainer.classes} aulas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{trainer.hours}h</p>
                          <p className="text-sm text-muted-foreground">este mês</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horários Mais Populares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { time: '06:00 - 07:00', attendance: 92, capacity: 100 },
                      { time: '18:00 - 19:00', attendance: 88, capacity: 100 },
                      { time: '19:00 - 20:00', attendance: 85, capacity: 100 },
                      { time: '07:30 - 08:30', attendance: 78, capacity: 100 }
                    ].map((slot, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{slot.time}</span>
                          <span className="text-sm text-muted-foreground">
                            {slot.attendance}% ocupação
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${slot.attendance}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
