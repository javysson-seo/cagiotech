
import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
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
  TrendingUp, 
  Users, 
  Euro, 
  Calendar, 
  Download, 
  FileText, 
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';

const ReportsContent: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const [reportType, setReportType] = useState('overview');

  // Mock data para os relatórios
  const membershipData = [
    { mes: 'Jan', novos: 12, cancelamentos: 3, total: 142 },
    { mes: 'Fev', novos: 15, cancelamentos: 5, total: 152 },
    { mes: 'Mar', novos: 18, cancelamentos: 2, total: 168 },
    { mes: 'Abr', novos: 14, cancelamentos: 4, total: 178 },
    { mes: 'Mai', novos: 20, cancelamentos: 6, total: 192 },
  ];

  const revenueData = [
    { mes: 'Jan', receitas: 8200, despesas: 4500, lucro: 3700 },
    { mes: 'Fev', receitas: 8400, despesas: 4600, lucro: 3800 },
    { mes: 'Mar', receitas: 8600, despesas: 4400, lucro: 4200 },
    { mes: 'Abr', receitas: 8300, despesas: 4700, lucro: 3600 },
    { mes: 'Mai', receitas: 8750, despesas: 4800, lucro: 3950 },
  ];

  const classAttendanceData = [
    { modalidade: 'CrossFit', participantes: 95, capacidade: 120 },
    { modalidade: 'Funcional', participantes: 67, capacidade: 80 },
    { modalidade: 'Yoga', participantes: 42, capacidade: 50 },
    { modalidade: 'HIIT', participantes: 38, capacidade: 45 },
    { modalidade: 'Mobilidade', participidades: 28, capacidade: 35 },
  ];

  const memberDistribution = [
    { name: 'Mensais', value: 65, color: '#bed700' },
    { name: 'Trimestrais', value: 25, color: '#8b5cf6' },
    { name: 'Anuais', value: 10, color: '#06b6d4' },
  ];

  const stats = [
    {
      title: 'Receita Mensal',
      value: '€8,750',
      change: '+12%',
      trend: 'up',
      icon: Euro,
      description: 'vs mês anterior'
    },
    {
      title: 'Novos Membros',
      value: '20',
      change: '+40%',
      trend: 'up',
      icon: Users,
      description: 'este mês'
    },
    {
      title: 'Taxa Retenção',
      value: '94%',
      change: '+2%',
      trend: 'up',
      icon: TrendingUp,
      description: 'últimos 3 meses'
    },
    {
      title: 'Aulas Realizadas',
      value: '156',
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      description: 'este mês'
    }
  ];

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
                <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
                <p className="text-muted-foreground">
                  Análise e estatísticas da sua BOX
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Relatório PDF
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Tipo de relatório" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Visão Geral</SelectItem>
                      <SelectItem value="financial">Financeiro</SelectItem>
                      <SelectItem value="members">Membros</SelectItem>
                      <SelectItem value="classes">Aulas</SelectItem>
                      <SelectItem value="trainers">Trainers</SelectItem>
                    </SelectContent>
                  </Select>
                  <DatePickerWithRange
                    date={dateRange}
                    setDate={setDateRange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <Card key={stat.title} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 text-sm text-cagio-green">
                        <TrendingUp className="h-3 w-3" />
                        <span className="font-medium">{stat.change}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {stat.description}
                      </span>
                    </div>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-cagio-green"></div>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <Tabs defaultValue="membership" className="space-y-6">
              <TabsList>
                <TabsTrigger value="membership">Membros</TabsTrigger>
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
                <TabsTrigger value="classes">Aulas</TabsTrigger>
                <TabsTrigger value="distribution">Distribuição</TabsTrigger>
              </TabsList>

              <TabsContent value="membership">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Evolução de Membros
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <LineChart data={membershipData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="mes" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="novos" 
                          stroke="#bed700" 
                          strokeWidth={3}
                          name="Novos Membros"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cancelamentos" 
                          stroke="#ef4444" 
                          strokeWidth={3}
                          name="Cancelamentos"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          name="Total"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financial">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Euro className="h-5 w-5" />
                      Receitas vs Despesas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="mes" stroke="#666" />
                        <YAxis stroke="#666" />
                        <Tooltip formatter={(value: number) => [`€${value}`, '']} />
                        <Legend />
                        <Bar dataKey="receitas" fill="#bed700" name="Receitas" />
                        <Bar dataKey="despesas" fill="#ef4444" name="Despesas" />
                        <Bar dataKey="lucro" fill="#3b82f6" name="Lucro" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="classes">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Ocupação das Aulas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={classAttendanceData} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis type="number" stroke="#666" />
                        <YAxis dataKey="modalidade" type="category" stroke="#666" width={80} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="participantes" fill="#bed700" name="Participantes" />
                        <Bar dataKey="capacidade" fill="#e5e7eb" name="Capacidade" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="distribution">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChartIcon className="h-5 w-5" />
                      Distribuição de Planos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <PieChart>
                        <Pie
                          data={memberDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {memberDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [`${value}%`, 'Percentagem']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export const Reports: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <ReportsContent />
    </AreaThemeProvider>
  );
};
