
import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { DashboardKPIs } from '@/components/box/dashboard/DashboardKPIs';
import { DashboardCharts } from '@/components/box/dashboard/DashboardCharts';
import { DashboardFilters } from '@/components/box/dashboard/DashboardFilters';
import { RecentActivities } from '@/components/box/RecentActivities';
import { QuickActions } from '@/components/box/QuickActions';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Users
} from 'lucide-react';

const BoxDashboardContent: React.FC = () => {
  const [dateRange, setDateRange] = useState<any>(null);
  const [selectedTrainer, setSelectedTrainer] = useState('all');
  const [selectedModality, setSelectedModality] = useState('all');
  const [selectedRoom, setSelectedRoom] = useState('all');

  const filters = {
    dateRange,
    trainer: selectedTrainer,
    modality: selectedModality,
    room: selectedRoom
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
                <h1 className="text-3xl font-bold text-foreground">Dashboard da Empresa</h1>
                <p className="text-muted-foreground mt-1">
                  Visão geral completa da sua empresa
                </p>
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
                  Análises
                </TabsTrigger>
                <TabsTrigger value="operations" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Operações
                </TabsTrigger>
                <TabsTrigger value="members" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Membros
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <DashboardKPIs filters={filters} />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <DashboardCharts />
                  </div>
                  <div className="space-y-6">
                    <QuickActions />
                    <RecentActivities />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <DashboardCharts />
              </TabsContent>

              <TabsContent value="operations" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <QuickActions />
                  <RecentActivities />
                </div>
              </TabsContent>

              <TabsContent value="members" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <RecentActivities />
                  </div>
                  <div>
                    <QuickActions />
                  </div>
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
