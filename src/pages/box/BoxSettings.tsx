
import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Building2, 
  Users, 
  Shield, 
  Bell, 
  Trophy, 
  MapPin, 
  Clock, 
  BarChart3,
  Euro,
  Palette,
  Database
} from 'lucide-react';

import { BoxDataSettings } from '@/components/box/settings/BoxDataSettings';
import { UsersPermissionsSettings } from '@/components/box/settings/UsersPermissionsSettings';
import { SecurityBackupSettings } from '@/components/box/settings/SecurityBackupSettings';
import { InternalNotificationsSettings } from '@/components/box/settings/InternalNotificationsSettings';
import { GamificationSettings } from '@/components/box/settings/GamificationSettings';
import { RoomsEquipmentSettings } from '@/components/box/settings/RoomsEquipmentSettings';
import { ScheduleRulesSettings } from '@/components/box/settings/ScheduleRulesSettings';
import { BasicReportsSettings } from '@/components/box/settings/BasicReportsSettings';
import { FinancialSettings } from '@/components/box/settings/FinancialSettings';
import { VisualCustomizationSettings } from '@/components/box/settings/VisualCustomizationSettings';
import { ModalitiesSettings } from '@/components/box/settings/ModalitiesSettings';

const BoxSettingsContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('box-data');

  const settingsTabs = [
    {
      id: 'box-data',
      label: 'Dados da BOX',
      icon: Building2,
      component: BoxDataSettings,
      description: 'Informações básicas e contacto'
    },
    {
      id: 'users',
      label: 'Usuários & Permissões',
      icon: Users,
      component: UsersPermissionsSettings,
      description: 'Gestão de utilizadores e funções'
    },
    {
      id: 'modalities',
      label: 'Modalidades',
      icon: Database,
      component: ModalitiesSettings,
      description: 'Configuração de modalidades'
    },
    {
      id: 'rooms',
      label: 'Salas & Equipamentos',
      icon: MapPin,
      component: RoomsEquipmentSettings,
      description: 'Gestão de espaços e equipamentos'
    },
    {
      id: 'schedule',
      label: 'Horários & Regras',
      icon: Clock,
      component: ScheduleRulesSettings,
      description: 'Grade de horários e políticas'
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: Euro,
      component: FinancialSettings,
      description: 'Configurações de pagamento'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: BarChart3,
      component: BasicReportsSettings,
      description: 'Métricas e análises'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      component: InternalNotificationsSettings,
      description: 'Alertas e comunicações'
    },
    {
      id: 'gamification',
      label: 'Gamificação',
      icon: Trophy,
      component: GamificationSettings,
      description: 'Sistema de pontos e badges'
    },
    {
      id: 'visual',
      label: 'Personalização',
      icon: Palette,
      component: VisualCustomizationSettings,
      description: 'Cores, logos e temas'
    },
    {
      id: 'security',
      label: 'Segurança & Backup',
      icon: Shield,
      component: SecurityBackupSettings,
      description: 'Proteção de dados e backups'
    }
  ];

  const renderActiveComponent = () => {
    const activeTabData = settingsTabs.find(tab => tab.id === activeTab);
    if (!activeTabData) return null;
    
    const Component = activeTabData.component;
    return <Component />;
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Configurações da BOX</h1>
                <p className="text-muted-foreground">
                  Gerir todas as configurações e preferências da sua BOX
                </p>
              </div>
            </div>

            {/* Settings Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {settingsTabs.slice(0, 4).map((tab) => {
                const Icon = tab.icon;
                return (
                  <Card 
                    key={tab.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      activeTab === tab.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{tab.label}</h3>
                          <p className="text-xs text-muted-foreground">{tab.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Main Settings Interface */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="border-b">
                <TabsList className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 h-auto p-1 bg-muted/50">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className="flex flex-col items-center p-3 text-xs data-[state=active]:bg-background"
                      >
                        <Icon className="h-4 w-4 mb-1" />
                        <span className="hidden sm:block">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Dynamic Content Area */}
              <div className="min-h-[600px]">
                {settingsTabs.map((tab) => (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <Card>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <tab.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{tab.label}</CardTitle>
                              <p className="text-sm text-muted-foreground">{tab.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Configurações
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {renderActiveComponent()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </div>
            </Tabs>

            {/* Help Section */}
            <Card className="bg-muted/30">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Precisa de Ajuda?</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Se tiver dúvidas sobre alguma configuração, consulte o nosso guia ou contacte o suporte.
                    </p>
                    <div className="flex space-x-2">
                      <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                        📖 Guia de Configurações
                      </Badge>
                      <Badge variant="secondary" className="text-xs cursor-pointer hover:bg-secondary/80">
                        💬 Contactar Suporte
                      </Badge>
                    </div>
                  </div>
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

export const BoxSettings: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxSettingsContent />
    </AreaThemeProvider>
  );
};
