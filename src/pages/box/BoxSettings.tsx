
import React, { useState } from 'react';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Palette, 
  Users, 
  CreditCard, 
  Dumbbell,
  MapPin,
  Clock,
  Bell,
  Trophy,
  BarChart3,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { BoxDataSettings } from '@/components/box/settings/BoxDataSettings';
import { VisualCustomizationSettings } from '@/components/box/settings/VisualCustomizationSettings';
import { UsersPermissionsSettings } from '@/components/box/settings/UsersPermissionsSettings';
import { FinancialSettings } from '@/components/box/settings/FinancialSettings';
import { ModalitiesSettings } from '@/components/box/settings/ModalitiesSettings';
import { RoomsEquipmentSettings } from '@/components/box/settings/RoomsEquipmentSettings';
import { ScheduleRulesSettings } from '@/components/box/settings/ScheduleRulesSettings';
import { InternalNotificationsSettings } from '@/components/box/settings/InternalNotificationsSettings';
import { GamificationSettings } from '@/components/box/settings/GamificationSettings';
import { BasicReportsSettings } from '@/components/box/settings/BasicReportsSettings';
import { SecurityBackupSettings } from '@/components/box/settings/SecurityBackupSettings';

export const BoxSettings: React.FC = () => {
  const { user } = useAuth();
  const { canManageSettings } = usePermissions();
  const [activeTab, setActiveTab] = useState('box-data');

  if (!canManageSettings()) {
    return (
      <div className="min-h-screen bg-background">
        <BoxHeader />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
            <p className="text-muted-foreground">
              Você não tem permissão para acessar as configurações.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const settingsTabs = [
    { id: 'box-data', label: 'BOX', icon: Building2, component: BoxDataSettings },
    { id: 'visual', label: 'Visual', icon: Palette, component: VisualCustomizationSettings },
    { id: 'users', label: 'Usuários', icon: Users, component: UsersPermissionsSettings },
    { id: 'financial', label: 'Financeiro', icon: CreditCard, component: FinancialSettings },
    { id: 'modalities', label: 'Modalidades', icon: Dumbbell, component: ModalitiesSettings },
    { id: 'rooms', label: 'Salas', icon: MapPin, component: RoomsEquipmentSettings },
    { id: 'schedule', label: 'Horários', icon: Clock, component: ScheduleRulesSettings },
    { id: 'notifications', label: 'Notificações', icon: Bell, component: InternalNotificationsSettings },
    { id: 'gamification', label: 'Gamificação', icon: Trophy, component: GamificationSettings },
    { id: 'reports', label: 'Relatórios', icon: BarChart3, component: BasicReportsSettings },
    { id: 'security', label: 'Segurança', icon: Shield, component: SecurityBackupSettings }
  ];

  return (
    <div className="min-h-screen bg-background">
      <BoxHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Configurações da BOX
          </h1>
          <p className="text-muted-foreground">
            Centro de controle completo da sua BOX - configure todos os aspectos operacionais e administrativos
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar de Configurações */}
          <div className="col-span-12 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Seções</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  {settingsTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-none border-none hover:bg-muted/50 transition-colors ${
                          activeTab === tab.id 
                            ? 'bg-primary/10 text-primary border-r-2 border-primary' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Conteúdo Principal */}
          <div className="col-span-12 lg:col-span-9">
            <div className="space-y-6">
              {settingsTabs.map((tab) => {
                const Component = tab.component;
                return (
                  <div
                    key={tab.id}
                    className={activeTab === tab.id ? 'block' : 'hidden'}
                  >
                    <Component />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
