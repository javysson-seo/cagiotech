
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Euro, Calendar, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { DashboardCharts } from '@/components/box/DashboardCharts';
import { QuickActions } from '@/components/box/QuickActions';

export const BoxDashboard: React.FC = () => {
  const { t } = useTranslation();

  // Mock data - em produção virá da API/Supabase
  const kpiData = {
    totalAtletas: { value: 147, growth: 12.5 },
    receitaMensal: { value: 8750, growth: 8.3 },
    aulasHoje: { value: 12, total: 15, ocupacao: 80 },
    pagamentosPendentes: { value: 5, alert: true }
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Bem-vindo de volta! 👋
              </h1>
              <p className="text-muted-foreground">
                Aqui está um resumo da sua BOX hoje
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Total Atletas */}
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Atletas
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {kpiData.totalAtletas.value}
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">+{kpiData.totalAtletas.growth}%</span>
                    <span className="text-muted-foreground ml-1">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              {/* Receita Mensal */}
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Receita Mensal
                  </CardTitle>
                  <Euro className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    €{kpiData.receitaMensal.value.toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm">
                    <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    <span className="text-green-600">+{kpiData.receitaMensal.growth}%</span>
                    <span className="text-muted-foreground ml-1">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              {/* Aulas Hoje */}
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Aulas Hoje
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {kpiData.aulasHoje.value}/{kpiData.aulasHoje.total}
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mb-1">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${kpiData.aulasHoje.ocupacao}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {kpiData.aulasHoje.ocupacao}% ocupação
                  </span>
                </CardContent>
              </Card>

              {/* Pagamentos Pendentes */}
              <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pagamentos Pendentes
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {kpiData.pagamentosPendentes.value}
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2" />
                    <span className="text-orange-500">Requer atenção</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <DashboardCharts />
            </div>

            {/* Quick Actions */}
            <QuickActions />
          </div>
        </main>
      </div>
    </div>
  );
};
