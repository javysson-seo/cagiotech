import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStaffRole } from '@/hooks/useStaffRole';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Loading } from '@/components/ui/loading';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

const StaffDashboardContent: React.FC = () => {
  const { user } = useAuth();
  const { role, loading } = useStaffRole();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Carregando suas permissões..." />
      </div>
    );
  }

  if (!role) {
    return <Navigate to="/auth/login" replace />;
  }

  const permissionModules = [
    { key: 'athletes', label: 'Atletas', icon: '🏃', permissions: ['athletes_view', 'athletes_create', 'athletes_edit', 'athletes_delete'] },
    { key: 'trainers', label: 'Treinadores', icon: '💪', permissions: ['trainers_view', 'trainers_create', 'trainers_edit', 'trainers_delete'] },
    { key: 'classes', label: 'Aulas', icon: '📅', permissions: ['classes_view', 'classes_create', 'classes_edit', 'classes_delete'] },
    { key: 'financial', label: 'Financeiro', icon: '💰', permissions: ['financial_view', 'financial_create', 'financial_edit', 'financial_delete'] },
    { key: 'reports', label: 'Relatórios', icon: '📊', permissions: ['reports_view', 'reports_create'] },
    { key: 'equipment', label: 'Equipamentos', icon: '🏋️', permissions: ['equipment_view', 'equipment_create', 'equipment_edit', 'equipment_delete'] },
    { key: 'crm', label: 'CRM', icon: '🤝', permissions: ['crm_view', 'crm_create', 'crm_edit', 'crm_delete'] },
    { key: 'communication', label: 'Comunicação', icon: '💬', permissions: ['communication_view', 'communication_send'] },
  ];

  const getModulePermissionCount = (modulePermissions: string[]) => {
    return modulePermissions.filter(p => role.permissions.includes(p)).length;
  };

  const getModuleStatus = (modulePermissions: string[]) => {
    const count = getModulePermissionCount(modulePermissions);
    if (count === 0) return 'none';
    if (count === modulePermissions.length) return 'full';
    return 'partial';
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-cagio-green">Bem-vindo, {user?.name}!</h1>
              <p className="text-muted-foreground">
                Você está logado como funcionário com o cargo: <strong>{role.name}</strong>
              </p>
            </div>

            {/* Role Info Card */}
            <Card className="border-l-4 border-l-cagio-green">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cagio-green" />
                  Suas Permissões
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {role.description || 'Cargo personalizado com permissões específicas'}
                    </p>
                    <Badge className="bg-cagio-green text-white">
                      {role.permissions.length} {role.permissions.length === 1 ? 'permissão' : 'permissões'} ativas
                    </Badge>
                  </div>

                  {role.permissions.includes('all') && (
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-900 dark:text-green-100">
                        Você tem acesso completo a todas as funcionalidades
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Permissions by Module */}
            <Card>
              <CardHeader>
                <CardTitle>Acesso por Módulo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {permissionModules.map((module) => {
                    const status = getModuleStatus(module.permissions);
                    const count = getModulePermissionCount(module.permissions);

                    return (
                      <div
                        key={module.key}
                        className={`p-4 rounded-lg border-2 ${
                          status === 'full' 
                            ? 'border-green-500 bg-green-50 dark:bg-green-950' 
                            : status === 'partial'
                            ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
                            : 'border-gray-300 bg-gray-50 dark:bg-gray-900 opacity-60'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{module.icon}</span>
                            <div>
                              <h3 className="font-semibold">{module.label}</h3>
                              <p className="text-xs text-muted-foreground">
                                {count}/{module.permissions.length} permissões
                              </p>
                            </div>
                          </div>
                          {status === 'full' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : status === 'partial' ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          ) : (
                            <div className="h-5 w-5 rounded-full bg-gray-300" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card className="border-cagio-green">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-cagio-green">💡 Como usar o sistema</h3>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Use o menu lateral para navegar entre as seções que você tem acesso</li>
                    <li>Funcionalidades bloqueadas não aparecerão no menu</li>
                    <li>Se precisar de mais permissões, fale com o administrador</li>
                    <li>Suas ações são registradas para auditoria e segurança</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export const StaffDashboard: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <StaffDashboardContent />
    </AreaThemeProvider>
  );
};
