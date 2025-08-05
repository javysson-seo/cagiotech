
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { DashboardCharts } from '@/components/box/DashboardCharts';
import { QuickActions } from '@/components/box/QuickActions';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { PaymentIntegrations } from '@/components/integrations/PaymentIntegrations';
import { DocumentManagement } from '@/components/documents/DocumentManagement';
import { 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  UserPlus,
  CalendarPlus,
  FileText,
  BarChart3,
  Bell,
  CreditCard,
  Settings
} from 'lucide-react';

export const BoxDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                <p className="text-muted-foreground">
                  Visão geral da sua academia
                </p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="payments">Pagamentos</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100">Total de Atletas</p>
                          <p className="text-3xl font-bold">247</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100">Aulas Hoje</p>
                          <p className="text-3xl font-bold">12</p>
                        </div>
                        <Calendar className="h-8 w-8 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100">Receita Mensal</p>
                          <p className="text-3xl font-bold">R$ 45.2K</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100">Crescimento</p>
                          <p className="text-3xl font-bold">+12%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DashboardCharts />
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button className="h-20 flex flex-col space-y-2">
                        <UserPlus className="h-6 w-6" />
                        <span className="text-sm">Novo Atleta</span>
                      </Button>
                      <Button className="h-20 flex flex-col space-y-2" variant="outline">
                        <CalendarPlus className="h-6 w-6" />
                        <span className="text-sm">Nova Aula</span>
                      </Button>
                      <Button className="h-20 flex flex-col space-y-2" variant="outline">
                        <FileText className="h-6 w-6" />
                        <span className="text-sm">Relatórios</span>
                      </Button>
                      <Button className="h-20 flex flex-col space-y-2" variant="outline">
                        <Settings className="h-6 w-6" />
                        <span className="text-sm">Configurações</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades Recentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 bg-green-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Maria Silva se inscreveu na aula de CrossFit</p>
                          <p className="text-xs text-muted-foreground">há 10 minutos</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Pagamento de João Santos foi processado</p>
                          <p className="text-xs text-muted-foreground">há 1 hora</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="h-2 w-2 bg-purple-600 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Nova avaliação de Ana Costa recebida</p>
                          <p className="text-xs text-muted-foreground">há 2 horas</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <NotificationCenter />
              </TabsContent>

              <TabsContent value="payments">
                <PaymentIntegrations />
              </TabsContent>

              <TabsContent value="documents">
                <DocumentManagement />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                {/* Analytics Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <BarChart3 className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-muted-foreground">Taxa de Retenção</p>
                          <p className="text-2xl font-bold">89.5%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-green-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-muted-foreground">Novos Membros</p>
                          <p className="text-2xl font-bold">32</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Calendar className="h-8 w-8 text-purple-600" />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</p>
                          <p className="text-2xl font-bold">76%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Advanced Charts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Relatórios Avançados</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
                      <p className="text-muted-foreground">Gráficos avançados serão exibidos aqui</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                {/* Settings panels */}
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Informações da Academia</h4>
                        <p className="text-sm text-muted-foreground">
                          Configure nome, endereço e contatos
                        </p>
                      </div>
                      <Button variant="outline">Editar Informações</Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Horários de Funcionamento</h4>
                        <p className="text-sm text-muted-foreground">
                          Defina horários de abertura e fechamento
                        </p>
                      </div>
                      <Button variant="outline">Configurar Horários</Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">Planos e Preços</h4>
                        <p className="text-sm text-muted-foreground">
                          Gerencie planos de assinatura e preços
                        </p>
                      </div>
                      <Button variant="outline">Gerenciar Planos</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
