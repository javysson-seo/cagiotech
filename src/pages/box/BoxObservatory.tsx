import React from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, TrendingDown, Users, Calendar, Euro, Activity, Download } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const BoxObservatoryContent: React.FC = () => {
  const attendanceData = [
    { month: 'Jan', sessions: 420, athletes: 85 },
    { month: 'Fev', sessions: 380, athletes: 82 },
    { month: 'Mar', sessions: 460, athletes: 88 },
    { month: 'Abr', sessions: 520, athletes: 95 },
    { month: 'Mai', sessions: 480, athletes: 92 },
    { month: 'Jun', sessions: 560, athletes: 98 }
  ];

  const revenueData = [
    { month: 'Jan', revenue: 8500, expenses: 3200 },
    { month: 'Fev', revenue: 8200, expenses: 3100 },
    { month: 'Mar', revenue: 9100, expenses: 3400 },
    { month: 'Abr', revenue: 9800, expenses: 3600 },
    { month: 'Mai', revenue: 9200, expenses: 3300 },
    { month: 'Jun', revenue: 10200, expenses: 3800 }
  ];

  const modalityData = [
    { name: 'CrossFit', value: 40, color: '#8884d8' },
    { name: 'Musculação', value: 30, color: '#82ca9d' },
    { name: 'Yoga', value: 15, color: '#ffc658' },
    { name: 'Pilates', value: 15, color: '#ff7300' }
  ];

  const kpis = [
    {
      title: 'Taxa de Retenção',
      value: '92%',
      change: '+2.5%',
      trend: 'up',
      period: 'vs. mês anterior'
    },
    {
      title: 'Frequência Média',
      value: '3.8',
      change: '+0.3',
      trend: 'up',
      period: 'sessões/semana'
    },
    {
      title: 'Revenue per Member',
      value: '€85',
      change: '-€2',
      trend: 'down',
      period: 'vs. mês anterior'
    },
    {
      title: 'Taxa de Ocupação',
      value: '78%',
      change: '+5%',
      trend: 'up',
      period: 'capacidade média'
    }
  ];

  const reports = [
    {
      id: 1,
      title: 'Relatório de Frequência Mensal',
      type: 'attendance',
      period: 'Junho 2024',
      generated_at: '2024-07-01',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Análise Financeira Q2',
      type: 'financial',
      period: 'Q2 2024',
      generated_at: '2024-06-30',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Performance dos Atletas',
      type: 'performance',
      period: 'Maio 2024',
      generated_at: '2024-06-01',
      status: 'completed'
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Observatório</h1>
                <p className="text-muted-foreground">
                  Análises detalhadas e insights do negócio
                </p>
              </div>
              <div className="flex space-x-2">
                <Select defaultValue="6m">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Mês</SelectItem>
                    <SelectItem value="3m">3 Meses</SelectItem>
                    <SelectItem value="6m">6 Meses</SelectItem>
                    <SelectItem value="1y">1 Ano</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="attendance">
                  <Users className="h-4 w-4 mr-2" />
                  Frequência
                </TabsTrigger>
                <TabsTrigger value="financial">
                  <Euro className="h-4 w-4 mr-2" />
                  Financeiro
                </TabsTrigger>
                <TabsTrigger value="reports">
                  <Activity className="h-4 w-4 mr-2" />
                  Relatórios
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <div className="space-y-6">
                  {/* KPIs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {kpis.map((kpi, index) => (
                      <Card key={index}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            {kpi.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">{kpi.value}</div>
                            <div className={`flex items-center space-x-1 text-sm ${
                              kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {kpi.trend === 'up' ? 
                                <TrendingUp className="h-4 w-4" /> : 
                                <TrendingDown className="h-4 w-4" />
                              }
                              <span>{kpi.change}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {kpi.period}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Modalidades Populares</CardTitle>
                        <CardDescription>Distribuição por modalidade</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={modalityData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                dataKey="value"
                                label={({name, value}) => `${name}: ${value}%`}
                              >
                                {modalityData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Tendência de Crescimento</CardTitle>
                        <CardDescription>Atletas ativos ao longo do tempo</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={attendanceData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Line 
                                type="monotone" 
                                dataKey="athletes" 
                                stroke="#8884d8" 
                                strokeWidth={2}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="attendance">
                <Card>
                  <CardHeader>
                    <CardTitle>Análise de Frequência</CardTitle>
                    <CardDescription>Sessões e frequência dos atletas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={attendanceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="sessions" fill="#8884d8" name="Sessões" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financial">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Financeira</CardTitle>
                    <CardDescription>Receitas vs. Despesas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="revenue" fill="#82ca9d" name="Receitas" />
                          <Bar dataKey="expenses" fill="#ff7300" name="Despesas" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <Card>
                  <CardHeader>
                    <CardTitle>Relatórios Gerados</CardTitle>
                    <CardDescription>Histórico de relatórios e análises</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reports.map(report => (
                        <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{report.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                              <span>Período: {report.period}</span>
                              <span>Gerado em: {report.generated_at}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {report.status === 'completed' ? 'Concluído' : 'Pendente'}
                            </Badge>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Baixar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
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

export const BoxObservatory: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxObservatoryContent />
    </AreaThemeProvider>
  );
};