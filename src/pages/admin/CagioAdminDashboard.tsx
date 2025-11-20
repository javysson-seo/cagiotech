import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { AdminFinancialDashboard } from '@/components/admin/AdminFinancialDashboard';
import { CompanyApprovalQueue } from '@/components/admin/CompanyApprovalQueue';
import { SuggestionsReview } from '@/components/admin/SuggestionsReview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MobileAdminRedirect } from '@/components/MobileAdminRedirect';
import { Footer } from '@/components/Footer';
import { Shield, TrendingUp } from 'lucide-react';

export const CagioAdminDashboard: React.FC = () => {
  return (
    <AdminAuthGuard>
      <MobileAdminRedirect>
        <div className="flex h-screen bg-background">
          <AdminSidebar />
          
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            
            <main className="flex-1 p-6 overflow-auto">
              <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero Header */}
                <div className="bg-gradient-to-r from-cagio-green to-cagio-green-dark rounded-xl p-6 text-white shadow-xl">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-8 w-8" />
                    <h1 className="text-3xl font-bold">Dashboard CagioTech Admin</h1>
                  </div>
                  <p className="text-white/90 mt-2">
                    Sistema de gestão completo para administração da plataforma
                  </p>
                </div>

                {/* Financial Metrics */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-cagio-green" />
                    Métricas Financeiras
                  </h2>
                  <AdminFinancialDashboard />
                </div>

                {/* Company Approvals */}
                <CompanyApprovalQueue />

                {/* Suggestions Review */}
                <SuggestionsReview />
              </div>
            </main>
            
            <Footer />
          </div>
        </div>
      </MobileAdminRedirect>
    </AdminAuthGuard>
  );
};
