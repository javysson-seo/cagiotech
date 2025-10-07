import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DashboardMetrics } from '@/components/admin/DashboardMetrics';
import { CompanyStats } from '@/components/admin/CompanyStats';
import { NotificationCenter } from '@/components/admin/NotificationCenter';
import { RecentBoxes } from '@/components/admin/RecentBoxes';
import { SystemAlerts } from '@/components/admin/SystemAlerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileAdminRedirect } from '@/components/MobileAdminRedirect';
import { Footer } from '@/components/Footer';

export const CagioAdminDashboard: React.FC = () => {
  return (
    <MobileAdminRedirect>
      <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-8">
              <div className="bg-gradient-to-r from-[#1a1a2e] to-[#0f3460] rounded-xl p-6 text-white shadow-xl border border-[#16ff00]/20">
                <h1 className="text-3xl font-bold">Dashboard CagioTech</h1>
                <p className="text-gray-300 mt-2">
                  Visão geral completa do sistema e gestão de empresas
                </p>
              </div>

              <DashboardMetrics />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CompanyStats />
                <NotificationCenter />
              </div>

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
          
          <Footer />
        </div>
      </div>
    </MobileAdminRedirect>
  );
};
