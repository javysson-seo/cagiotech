import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Plus, BarChart3, Calendar, Users, Euro, Activity } from 'lucide-react';

const BoxKPIsContent: React.FC = () => {
  const [isAddingKPI, setIsAddingKPI] = useState(false);

  const kpis = [
    {
      id: 1,
      name: 'Taxa de Retenção',
      current_value: 92,
      target_value: 95,
      type: 'percentage',
      category: 'retention',
      period: 'monthly',
      trend: 'up',
      change: 2.5,
      last_updated: '2024-06-30'
    },
    {
      id: 2,
      name: 'Novos Membros',
      current_value: 15,
      target_value: 20,
      type: 'number',
      category: 'growth',
      period: 'monthly',
      trend: 'down',
      change: -3,
      last_updated: '2024-06-30'
    },
    {
      id: 3,
      name: 'Revenue Mensal',
      current_value: 10200,
      target_value: 12000,
      type: 'currency',
      category: 'revenue',
      period: 'monthly',
      trend: 'up',
      change: 800,
      last_updated: '2024-06-30'
    },
    {
      id: 4,
      name: 'Frequência Média',
      current_value: 3.8,
      target_value: 4.0,
      type: 'decimal',
      category: 'engagement',
      period: 'weekly',
      trend: 'up',
      change: 0.3,
      last_updated: '2024-06-30'
    },
    {
      id: 5,
      name: 'Taxa de Ocupação',
      current_value: 78,
      target_value: 85,
      type: 'percentage',
      category: 'utilization',
      period: 'daily',
      trend: 'up',
      change: 5,
      last_updated: '2024-06-30'
    },
    {
      id: 6,
      name: 'NPS Score',
      current_value: 72,
      target_value: 80,
      type: 'score',
      category: 'satisfaction',
      period: 'quarterly',
      trend: 'up',
      change: 8,
      last_updated: '2024-06-30'
    }
  ];

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const formatValue = (value: number, type: string) => {
    switch(type) {
      case 'percentage': return `${value}%`;
      case 'currency': return `€${value.toLocaleString()}`;
      case 'decimal': return value.toFixed(1);
      case 'score': return value.toString();
      default: return value.toString();
    }
  };

  const getKPIIcon = (category: string) => {
    switch(category) {
      case 'retention': return Users;
      case 'growth': return TrendingUp;
      case 'revenue': return Euro;
      case 'engagement': return Activity;
      case 'utilization': return BarChart3;
      case 'satisfaction': return Target;
      default: return BarChart3;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'retention': return 'bg-blue-100 text-blue-800';
      case 'growth': return 'bg-green-100 text-green-800';
      case 'revenue': return 'bg-purple-100 text-purple-800';
      case 'engagement': return 'bg-orange-100 text-orange-800';
      case 'utilization': return 'bg-yellow-100 text-yellow-800';
      case 'satisfaction': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryName = (category: string) => {
    switch(category) {
      case 'retention': return 'Retenção';
      case 'growth': return 'Crescimento';
      case 'revenue': return 'Receita';
      case 'engagement': return 'Engagement';
      case 'utilization': return 'Utilização';
      case 'satisfaction': return 'Satisfação';
      default: return category;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">KPIs</h1>
                <p className="text-muted-foreground">
                  Indicadores chave de performance
                </p>
              </div>
              <Dialog open={isAddingKPI} onOpenChange={setIsAddingKPI}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo KPI
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Novo KPI</DialogTitle>
                    <DialogDescription>
                      Criar um novo indicador de performance
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="kpi-name" className="text-right">Nome</Label>
                      <Input id="kpi-name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="kpi-category" className="text-right">Categoria</Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retention">Retenção</SelectItem>
                          <SelectItem value="growth">Crescimento</SelectItem>
                          <SelectItem value="revenue">Receita</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="utilization">Utilização</SelectItem>
                          <SelectItem value="satisfaction">Satisfação</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="kpi-target" className="text-right">Meta</Label>
                      <Input id="kpi-target" type="number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="kpi-type" className="text-right">Tipo</Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Tipo de valor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="percentage">Percentagem</SelectItem>
                          <SelectItem value="number">Número</SelectItem>
                          <SelectItem value="currency">Moeda</SelectItem>
                          <SelectItem value="decimal">Decimal</SelectItem>
                          <SelectItem value="score">Score</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsAddingKPI(false)}>Criar KPI</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="dashboard" className="space-y-4">
              <TabsList>
                <TabsTrigger value="dashboard">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="targets">
                  <Target className="h-4 w-4 mr-2" />
                  Metas
                </TabsTrigger>
                <TabsTrigger value="trends">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Tendências
                </TabsTrigger>
              </TabsList>

              <TabsContent value="dashboard">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {kpis.map(kpi => {
                    const Icon = getKPIIcon(kpi.category);
                    const progressPercentage = getProgressPercentage(kpi.current_value, kpi.target_value);
                    
                    return (
                      <Card key={kpi.id}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{kpi.name}</CardTitle>
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <Badge className={getCategoryColor(kpi.category)} variant="outline">
                            {getCategoryName(kpi.category)}
                          </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                              {formatValue(kpi.current_value, kpi.type)}
                            </div>
                            <div className={`flex items-center space-x-1 text-sm ${
                              kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {kpi.trend === 'up' ? 
                                <TrendingUp className="h-4 w-4" /> : 
                                <TrendingDown className="h-4 w-4" />
                              }
                              <span>
                                {kpi.type === 'currency' ? `€${Math.abs(kpi.change)}` : Math.abs(kpi.change)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Meta: {formatValue(kpi.target_value, kpi.type)}</span>
                              <span>{progressPercentage.toFixed(0)}%</span>
                            </div>
                            <Progress 
                              value={progressPercentage} 
                              className="h-2"
                            />
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Atualizado: {kpi.last_updated}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="targets">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestão de Metas</CardTitle>
                    <CardDescription>
                      Definir e acompanhar metas para cada KPI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {kpis.map(kpi => (
                        <div key={kpi.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div>
                              <h4 className="font-medium">{kpi.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Atual: {formatValue(kpi.current_value, kpi.type)} | 
                                Meta: {formatValue(kpi.target_value, kpi.type)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Progress 
                              value={getProgressPercentage(kpi.current_value, kpi.target_value)} 
                              className="w-24 h-2"
                            />
                            <span className="text-sm font-medium w-12">
                              {getProgressPercentage(kpi.current_value, kpi.target_value).toFixed(0)}%
                            </span>
                            <Button variant="outline" size="sm">
                              Editar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>KPIs em Alta</CardTitle>
                      <CardDescription>
                        KPIs com tendência positiva
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {kpis.filter(kpi => kpi.trend === 'up').map(kpi => (
                          <div key={kpi.id} className="flex items-center justify-between">
                            <span className="font-medium">{kpi.name}</span>
                            <div className="flex items-center space-x-2 text-green-600">
                              <TrendingUp className="h-4 w-4" />
                              <span>+{kpi.change}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>KPIs Atenção</CardTitle>
                      <CardDescription>
                        KPIs que precisam de atenção
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {kpis.filter(kpi => kpi.trend === 'down').map(kpi => (
                          <div key={kpi.id} className="flex items-center justify-between">
                            <span className="font-medium">{kpi.name}</span>
                            <div className="flex items-center space-x-2 text-red-600">
                              <TrendingDown className="h-4 w-4" />
                              <span>{kpi.change}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export const BoxKPIs: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxKPIsContent />
    </AreaThemeProvider>
  );
};