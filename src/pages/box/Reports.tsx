
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Users,
  Euro,
  Building2,
  Filter,
  RefreshCw
} from 'lucide-react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { RevenueChart } from '@/components/admin/reports/RevenueChart';
import { UserGrowthChart } from '@/components/admin/reports/UserGrowthChart';
import { BoxPerformanceChart } from '@/components/admin/reports/BoxPerformanceChart';
import { MetricsOverview } from '@/components/admin/reports/MetricsOverview';
import { TopBoxes } from '@/components/admin/reports/TopBoxes';
import { ReportFilters } from '@/components/admin/reports/ReportFilters';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';

const ReportsContent: React.FC = () => {
  const [dateRange, setDateRange] = useState('30');
  const [isLoading, setIsLoading] = useState(false);

  const handleExportReport = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simular download
      console.log('Relatório exportado');
    }, 2000);
  };

  const handleRefreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col">
        <BoxHeader />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
                <p className="text-muted-foreground mt-1">
                  Análises detalhadas e métricas da plataforma
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleRefreshData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Atualizar
                </Button>
                
                <Button onClick={handleExportReport} disabled={isLoading}>
                  <Download className="h-4 w-4 mr-2" />
                  {isLoading ? 'Exportando...' : 'Exportar PDF'}
                </Button>
              </div>
            </div>

            {/* Filters */}
            <ReportFilters 
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />

            {/* Metrics Overview */}
            <MetricsOverview dateRange={dateRange} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Euro className="h-5 w-5 mr-2" />
                    Evolução da Receita
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RevenueChart dateRange={dateRange} />
                </CardContent>
              </Card>

              {/* User Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Crescimento de Utilizadores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UserGrowthChart dateRange={dateRange} />
                </CardContent>
              </Card>

              {/* BOX Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Performance das BOX
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BoxPerformanceChart dateRange={dateRange} />
                </CardContent>
              </Card>
            </div>

            {/* Top Performing BOX */}
            <TopBoxes dateRange={dateRange} />
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
