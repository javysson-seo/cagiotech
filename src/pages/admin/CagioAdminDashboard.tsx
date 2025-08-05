
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Users,
  TrendingUp,
  Euro,
  MapPin,
  Calendar,
  Activity,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DashboardMetrics } from '@/components/admin/DashboardMetrics';
import { RecentBoxes } from '@/components/admin/RecentBoxes';
import { SystemAlerts } from '@/components/admin/SystemAlerts';

export const CagioAdminDashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Dashboard Administrativo
              </h1>
              <p className="text-muted-foreground mt-1">
                Bem-vindo de volta, {user?.name}
              </p>
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar Nova BOX
            </Button>
          </div>

          {/* Key Metrics */}
          <DashboardMetrics />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <RecentBoxes />
            </div>
            
            {/* System Alerts */}
            <div className="space-y-6">
              <SystemAlerts />
              
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Atividade Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Novos Registos</span>
                    <Badge className="bg-green-100 text-green-800">+12</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aulas Marcadas</span>
                    <Badge className="bg-blue-100 text-blue-800">156</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pagamentos</span>
                    <Badge className="bg-purple-100 text-purple-800">€2,450</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Suporte Tickets</span>
                    <Badge variant="outline">3</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Receita dos Últimos 12 Meses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-muted/20 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Gráfico de receita será implementado</p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
