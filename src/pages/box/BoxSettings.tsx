
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
  Lock,
  Link2,
  Percent
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
import { IntegrationsSettings } from '@/components/box/settings/IntegrationsSettings';
import { RegistrationLinkSettings } from '@/components/box/settings/RegistrationLinkSettings';
import { DiscountCouponsSettings } from '@/components/box/settings/DiscountCouponsSettings';
import { PlansManagementSettings } from '@/components/box/settings/PlansManagementSettings';

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
      id: 'plans',
      label: 'Planos',
      icon: Euro,
      component: PlansManagementSettings,
      description: 'Gestão de planos de assinatura'
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
      id: 'coupons',
      label: 'Cupons de Desconto',
      icon: Percent,
      component: DiscountCouponsSettings,
      description: 'Gestão de cupons promocionais'
    },
    {
      id: 'registration-link',
      label: 'Link de Registro',
      icon: Link2,
      component: RegistrationLinkSettings,
      description: 'Link para auto-registro de alunos'
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
      component: IntegrationsSettings,
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

  return (
    <div className="flex min-h-screen w-full bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 pb-6">
            {/* Header Section */}
            <div className="animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center ring-1 ring-primary/10">
                    <Settings className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                      Configurações
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gerir todas as configurações da sua empresa
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Compact Tab Navigation */}
              <div className="sticky top-0 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-4 mb-6 border-b">
                <div className="overflow-x-auto hide-scrollbar">
                  <TabsList className="inline-flex w-auto h-auto p-1 bg-muted/50 rounded-xl gap-1">
                    {settingsTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger 
                          key={tab.id} 
                          value={tab.id} 
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-primary transition-all hover-scale whitespace-nowrap"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="hidden sm:inline">{tab.label}</span>
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                </div>
              </div>

              {/* Active Tab Content */}
              <div className="w-full animate-fade-in">
                {settingsTabs.map((tab) => (
                  <TabsContent 
                    key={tab.id} 
                    value={tab.id} 
                    className="mt-0 focus-visible:outline-none focus-visible:ring-0 space-y-6"
                  >
                    {/* Tab Header Card */}
                    <Card className="border-l-4 border-l-primary shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                            <tab.icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl font-semibold mb-1">
                              {tab.label}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {tab.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs font-normal">
                            Ativo
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Tab Content */}
                    <div className="animate-scale-in">
                      <tab.component />
                    </div>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
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
