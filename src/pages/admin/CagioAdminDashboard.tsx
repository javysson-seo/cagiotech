
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DashboardMetrics } from '@/components/admin/DashboardMetrics';
import { RecentBoxes } from '@/components/admin/RecentBoxes';
import { SystemAlerts } from '@/components/admin/SystemAlerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileAdminRedirect } from '@/components/MobileAdminRedirect';

export const CagioAdminDashboard: React.FC = () => {
  return (
    <>
      <MobileAdminRedirect />
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard Administrativo</h1>
                <p className="text-muted-foreground mt-2">
                  Visão geral do sistema CAGIO
                </p>
              </div>

              <DashboardMetrics />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>BOX Recentes</CardTitle>
                    <CardDescription>
                      Últimas BOX registadas no sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentBoxes />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Alertas do Sistema</CardTitle>
                    <CardDescription>
                      Notificações importantes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SystemAlerts />
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};
