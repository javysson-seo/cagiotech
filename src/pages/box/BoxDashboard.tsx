
import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { DashboardFilters } from '@/components/box/DashboardFilters';
import { AdvancedKPIs } from '@/components/box/AdvancedKPIs';
import { InteractiveCharts } from '@/components/box/InteractiveCharts';
import { QuickActions } from '@/components/box/QuickActions';
import { RecentActivities } from '@/components/box/RecentActivities';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Settings,
  Download,
  RefreshCw
} from 'lucide-react';

const BoxDashboardContent: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [selectedModality, setSelectedModality] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filters = {
    dateRange,
    trainer: selectedTrainer,
    modality: selectedModality,
    room: selectedRoom
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simular refresh
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleExport = () => {
    // Implementar exportação de dados
    console.log('Exportando dados...', filters);
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <BoxHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard Completo</h1>
                <p className="text-muted-foreground mt-1">
                  Análise completa e interativa da sua BOX
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? 'Atualizando...' : 'Atualizar'}
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </div>

            {/* Filters */}
            <DashboardFilters
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              selectedTrainer={selectedTrainer}
              onTrainerChange={setSelectedTrainer}
              selectedModality={selectedModality}
              onModalityChange={setSelectedModality}
              selectedRoom={selectedRoom}
              onRoomChange={setSelectedRoom}
              onRefresh={handleRefresh}
              onExport={handleExport}
            />

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Análise Detalhada
                </TabsTrigger>
                <TabsTrigger value="operations" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Operações
                </TabsTrigger>
                <TabsTrigger value="actions" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Ações Rápidas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <AdvancedKPIs filters={filters} />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <InteractiveCharts filters={filters} />
              </TabsContent>

              <TabsContent value="operations" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <InteractiveCharts filters={filters} />
                  </div>
                  <div className="lg:col-span-4">
                    <RecentActivities />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <QuickActions />
                  <RecentActivities />
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

export const BoxDashboard: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxDashboardContent />
    </AreaThemeProvider>
  );
};
