
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

  const settingsCategories = [
    {
      category: 'Geral',
      tabs: [
        {
          id: 'company-data',
          label: 'Empresa',
          icon: Building2,
          component: BoxDataSettings,
          description: 'Informações básicas e contacto'
        },
        {
          id: 'hr',
          label: 'RH',
          icon: UserCheck,
          component: UsersPermissionsSettings,
          description: 'Colaboradores e permissões'
        },
        {
          id: 'security',
          label: 'Segurança',
          icon: Shield,
          component: SecurityBackupSettings,
          description: 'Proteção e backups'
        }
      ]
    },
    {
      category: 'Operacional',
      tabs: [
        {
          id: 'modalities',
          label: 'Modalidades',
          icon: Database,
          component: ModalitiesSettings,
          description: 'Serviços oferecidos'
        },
        {
          id: 'classes',
          label: 'Aulas',
          icon: Calendar,
          component: ScheduleRulesSettings,
          description: 'Gestão de agendamentos'
        },
        {
          id: 'rooms',
          label: 'Espaços',
          icon: MapPin,
          component: RoomsEquipmentSettings,
          description: 'Salas e equipamentos'
        },
        {
          id: 'schedule',
          label: 'Horários',
          icon: Clock,
          component: ScheduleRulesSettings,
          description: 'Grade de horários'
        }
      ]
    },
    {
      category: 'Comercial',
      tabs: [
        {
          id: 'plans',
          label: 'Planos',
          icon: Euro,
          component: PlansManagementSettings,
          description: 'Assinaturas e preços'
        },
        {
          id: 'financial',
          label: 'Financeiro',
          icon: Euro,
          component: FinancialSettings,
          description: 'Pagamentos e transações'
        },
        {
          id: 'coupons',
          label: 'Cupons',
          icon: Percent,
          component: DiscountCouponsSettings,
          description: 'Descontos promocionais'
        },
        {
          id: 'registration-link',
          label: 'Auto-Registro',
          icon: Link2,
          component: RegistrationLinkSettings,
          description: 'Link público de cadastro'
        }
      ]
    },
    {
      category: 'Sistema',
      tabs: [
        {
          id: 'reports',
          label: 'Relatórios',
          icon: BarChart3,
          component: BasicReportsSettings,
          description: 'Análises e métricas'
        },
        {
          id: 'integrations',
          label: 'Integrações',
          icon: Plug,
          component: IntegrationsSettings,
          description: 'Sistemas externos'
        },
        {
          id: 'notifications',
          label: 'Notificações',
          icon: Bell,
          component: InternalNotificationsSettings,
          description: 'Alertas internos'
        },
        {
          id: 'gamification',
          label: 'Gamificação',
          icon: Trophy,
          component: GamificationSettings,
          description: 'Pontos e recompensas'
        },
        {
          id: 'visual',
          label: 'Visual',
          icon: Palette,
          component: VisualCustomizationSettings,
          description: 'Aparência da plataforma'
        }
      ]
    }
  ];

  const allTabs = settingsCategories.flatMap(cat => cat.tabs);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8 space-y-6 pb-6">
            {/* Header Section */}
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                  <Settings className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground tracking-tight">
                    Configurações
                  </h1>
                  <p className="text-muted-foreground mt-0.5">
                    Central de controle da sua empresa
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {settingsCategories.map((category, idx) => (
                  <Card key={category.category} className="hover-scale cursor-pointer transition-all hover:shadow-md">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-2">
                        <p className="text-2xl font-bold text-primary">{category.tabs.length}</p>
                        <p className="text-xs text-muted-foreground font-medium">{category.category}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
              {/* Categorized Navigation */}
              <div className="space-y-4">
                {settingsCategories.map((category) => (
                  <div key={category.category} className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
                      {category.category}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                      {category.tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                              group relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover-scale
                              ${isActive 
                                ? 'border-primary bg-primary/5 shadow-sm' 
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                              }
                            `}
                          >
                            <div className={`
                              w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                              ${isActive 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted group-hover:bg-primary/10'
                              }
                            `}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <span className={`
                              text-xs font-medium text-center transition-colors
                              ${isActive ? 'text-primary' : 'text-muted-foreground'}
                            `}>
                              {tab.label}
                            </span>
                            {isActive && (
                              <div className="absolute inset-x-0 -bottom-px h-0.5 bg-primary rounded-full" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Tab Content */}
              <div className="w-full">
                {allTabs.map((tab) => (
                  <TabsContent 
                    key={tab.id} 
                    value={tab.id} 
                    className="mt-0 focus-visible:outline-none focus-visible:ring-0 animate-fade-in"
                  >
                    {/* Tab Header */}
                    <div className="mb-6 pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow">
                          <tab.icon className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-foreground">
                            {tab.label}
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {tab.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tab Content */}
                    <tab.component />
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
