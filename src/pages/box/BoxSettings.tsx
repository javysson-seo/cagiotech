
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
  UserCheck, 
  Shield, 
  Bell, 
  Trophy, 
  MapPin, 
  Clock, 
  BarChart3,
  Euro,
  Palette,
  Database,
  Calendar,
  Plug,
  Lock
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
  const [activeTab, setActiveTab] = useState('company-data');

  const settingsTabs = [
    {
      id: 'company-data',
      label: 'Dados da Empresa',
      icon: Building2,
      component: BoxDataSettings,
      description: 'Informações básicas e contacto da empresa'
    },
    {
      id: 'hr',
      label: 'Recursos Humanos',
      icon: UserCheck,
      component: UsersPermissionsSettings,
      description: 'Gestão de colaboradores e permissões'
    },
    {
      id: 'modalities',
      label: 'Modalidades',
      icon: Database,
      component: ModalitiesSettings,
      description: 'Configuração de modalidades e serviços'
    },
    {
      id: 'classes',
      label: 'Aulas',
      icon: Calendar,
      component: ScheduleRulesSettings,
      description: 'Gestão de aulas e agendamentos'
    },
    {
      id: 'rooms',
      label: 'Salas e Equipamentos',
      icon: MapPin,
      component: RoomsEquipmentSettings,
      description: 'Gestão de espaços e material'
    },
    {
      id: 'schedule',
      label: 'Horários',
      icon: Clock,
      component: ScheduleRulesSettings,
      description: 'Grade de horários e regras'
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: Euro,
      component: FinancialSettings,
      description: 'Configurações financeiras e pagamentos'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: BarChart3,
      component: BasicReportsSettings,
      description: 'Métricas e análises de desempenho'
    },
    {
      id: 'integrations',
      label: 'Integrações',
      icon: Plug,
      component: GamificationSettings,
      description: 'Integrações com sistemas externos'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      component: InternalNotificationsSettings,
      description: 'Alertas e comunicações internas'
    },
    {
      id: 'gamification',
      label: 'Gamificação',
      icon: Trophy,
      component: GamificationSettings,
      description: 'Sistema de pontos e recompensas'
    },
    {
      id: 'visual',
      label: 'Personalização',
      icon: Palette,
      component: VisualCustomizationSettings,
      description: 'Customização visual da plataforma'
    },
    {
      id: 'security',
      label: 'Segurança',
      icon: Lock,
      component: SecurityBackupSettings,
      description: 'Proteção de dados e backups'
    }
  ];

  const getCurrentComponent = () => {
    const activeTabData = settingsTabs.find(tab => tab.id === activeTab);
    if (!activeTabData) return null;
    
    const Component = activeTabData.component;
    return <Component />;
  };

  const getCurrentTabInfo = () => {
    return settingsTabs.find(tab => tab.id === activeTab);
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header Section */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Configurações da Empresa</h1>
                <p className="text-muted-foreground">
                  Gerir todas as configurações e preferências da sua empresa
                </p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b border-border mb-6">
                <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 lg:grid-cols-7 h-auto p-1 bg-muted/50 rounded-lg gap-1">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger 
                        key={tab.id} 
                        value={tab.id} 
                        className="flex flex-col items-center justify-center p-3 text-xs min-h-[60px] data-[state=active]:bg-background data-[state=active]:shadow-sm"
                      >
                        <Icon className="h-4 w-4 mb-1" />
                        <span className="text-center leading-tight">{tab.label}</span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              {/* Active Tab Content */}
              <div className="w-full">
                {settingsTabs.map((tab) => (
                  <TabsContent 
                    key={tab.id} 
                    value={tab.id} 
                    className="mt-0 focus-visible:outline-none focus-visible:ring-0"
                  >
                    <Card className="w-full">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <tab.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{tab.label}</CardTitle>
                              <p className="text-sm text-muted-foreground mt-1">{tab.description}</p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Configurações
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {getCurrentComponent()}
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </div>
            </Tabs>

            {/* Help Section */}
            <Card className="bg-muted/30 mt-8">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">Precisa de Ajuda?</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Se tiver dúvidas sobre alguma configuração, consulte o nosso guia ou contacte o suporte.
                    </p>
                    <div className="flex flex-wrap gap-2">
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
