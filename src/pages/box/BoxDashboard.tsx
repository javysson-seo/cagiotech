import React, { useState } from 'react';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { useCompany } from '@/contexts/CompanyContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardKPIs } from '@/components/box/dashboard/DashboardKPIs';
import { DashboardFilters } from '@/components/box/dashboard/DashboardFilters';
import { RevenueExpenseChart } from '@/components/financial/RevenueExpenseChart';
import { RecentTransactionsList } from '@/components/financial/RecentTransactionsList';
import { ReceivablesList } from '@/components/financial/ReceivablesList';
import { MembersTab } from '@/components/box/dashboard/MembersTab';
import { ClassesTab } from '@/components/box/dashboard/ClassesTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDashboardMetrics } from '@/hooks/useDashboardMetrics';
import { useAthletesMetrics } from '@/hooks/useAthletesMetrics';
import { useClassesMetrics } from '@/hooks/useClassesMetrics';
import { useFinancialMetrics } from '@/hooks/useFinancialMetrics';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { useCompanyKPIs } from '@/hooks/useCompanyKPIs';
import { AllKPIsGrid } from '@/components/box/dashboard/AllKPIsGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const BoxDashboardContent = () => {
  const { currentCompany } = useCompany();
  const [dateRange, setDateRange] = useState<any>(undefined);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  const { data: dashboardMetrics, isLoading: isLoadingDashboard } = useDashboardMetrics(
    currentCompany?.id || '',
    dateRange
  );

  const { data: athletesMetrics, isLoading: isLoadingAthletes } = useAthletesMetrics(
    currentCompany?.id || '',
    dateRange
  );

  const { data: classesMetrics, isLoading: isLoadingClasses } = useClassesMetrics(
    currentCompany?.id || '',
    dateRange
  );

  const { data: financialMetrics, isLoading: isLoadingFinancial } = useFinancialMetrics(
    currentCompany?.id || ''
  );

  const { data: companyKPIs, isLoading: isLoadingKPIs } = useCompanyKPIs(
    currentCompany?.id || '',
    dateRange
  );

  const { transactions } = useFinancialTransactions(currentCompany?.id || '');

  const { data: payments = [] } = useQuery({
    queryKey: ['athlete-payments', currentCompany?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('athlete_payments')
        .select('*, athletes(name)')
        .eq('company_id', currentCompany?.id || '')
        .order('due_date', { ascending: true });
      return data || [];
    },
    enabled: !!currentCompany?.id,
  });

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    console.log('Exportar dados');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <BoxSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  Acompanhamento completo da sua box em tempo real
                </p>
              </div>
            </div>

            <DashboardFilters
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              selectedTrainer={selectedTrainer}
              onTrainerChange={setSelectedTrainer}
              selectedModality={selectedModality}
              onModalityChange={setSelectedModality}
              selectedRoom={selectedRoom}
              onRoomChange={setSelectedRoom}
            />

            {dashboardMetrics && dashboardMetrics.overduePayments > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Você tem {dashboardMetrics.overduePayments} pagamentos em atraso no valor total de €
                  {dashboardMetrics.overdueAmount.toLocaleString('pt-PT', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="kpis">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Todos os KPIs
                </TabsTrigger>
                <TabsTrigger value="financial">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Financeiro
                </TabsTrigger>
                <TabsTrigger value="members">
                  <Users className="h-4 w-4 mr-2" />
                  Membros
                </TabsTrigger>
                <TabsTrigger value="classes">
                  <Calendar className="h-4 w-4 mr-2" />
                  Aulas
                </TabsTrigger>
                <TabsTrigger value="operations">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Operacional
                </TabsTrigger>
              </TabsList>

              <TabsContent value="kpis" className="space-y-6">
                {companyKPIs && (
                  <AllKPIsGrid kpis={companyKPIs} isLoading={isLoadingKPIs} />
                )}
              </TabsContent>

              <TabsContent value="overview" className="space-y-6">
                <DashboardKPIs
                  metrics={{
                    revenue: dashboardMetrics?.revenue || 0,
                    revenueGrowth: dashboardMetrics?.revenueGrowth || 0,
                    activeAthletes: dashboardMetrics?.activeAthletes || 0,
                    occupationRate: dashboardMetrics?.occupationRate || 0,
                    totalClasses: dashboardMetrics?.totalClasses || 0,
                  }}
                  isLoading={isLoadingDashboard}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RevenueExpenseChart transactions={transactions} />
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumo Rápido</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Membros Ativos</span>
                        <span className="text-lg font-bold">{athletesMetrics?.active || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Novos este mês</span>
                        <span className="text-lg font-bold text-green-600">+{athletesMetrics?.new || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Check-ins hoje</span>
                        <span className="text-lg font-bold">{athletesMetrics?.todayCheckIns || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Taxa de ocupação</span>
                        <span className="text-lg font-bold">{dashboardMetrics?.occupationRate.toFixed(1) || 0}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <RecentTransactionsList transactions={transactions} />
              </TabsContent>

              <TabsContent value="financial" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <RevenueExpenseChart transactions={transactions} />
                  <Card>
                    <CardHeader>
                      <CardTitle>Métricas Financeiras</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Receita Mensal</span>
                          <span className="text-lg font-bold">
                            €{financialMetrics?.currentRevenue.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) || '0.00'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Despesas Mensais</span>
                          <span className="text-lg font-bold text-red-600">
                            €{financialMetrics?.currentExpenses.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) || '0.00'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t pt-2">
                          <span className="text-sm font-medium">Lucro Líquido</span>
                          <span className="text-xl font-bold text-green-600">
                            €{financialMetrics?.currentProfit.toLocaleString('pt-PT', { minimumFractionDigits: 2 }) || '0.00'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <ReceivablesList payments={payments} />
                <RecentTransactionsList transactions={transactions} />
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <MembersTab
                  metrics={athletesMetrics || {
                    total: 0,
                    active: 0,
                    inactive: 0,
                    new: 0,
                    churnRate: 0,
                    byPlan: [],
                    todayCheckIns: 0,
                    birthdaysThisMonth: 0,
                  }}
                  isLoading={isLoadingAthletes}
                />
              </TabsContent>

              <TabsContent value="classes" className="space-y-6">
                <ClassesTab
                  metrics={classesMetrics || {
                    byModality: [],
                    byTrainer: [],
                    totalClasses: 0,
                    totalBookings: 0,
                    totalCheckIns: 0,
                  }}
                  isLoading={isLoadingClasses}
                />
              </TabsContent>

              <TabsContent value="operations" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Atividade em Tempo Real</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <div className="text-4xl font-bold mb-2">{athletesMetrics?.todayCheckIns || 0}</div>
                        <p className="text-muted-foreground">check-ins hoje</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Alertas Operacionais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {dashboardMetrics && dashboardMetrics.overduePayments > 0 && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {dashboardMetrics.overduePayments} pagamentos em atraso
                          </AlertDescription>
                        </Alert>
                      )}
                      {athletesMetrics && athletesMetrics.birthdaysThisMonth > 0 && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {athletesMetrics.birthdaysThisMonth} aniversariantes este mês
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export const BoxDashboard = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxDashboardContent />
    </AreaThemeProvider>
  );
};
