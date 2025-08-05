
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Settings, Database, Mail, Bell, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'CAGIO',
    siteUrl: 'https://cagio.pt',
    adminEmail: 'admin@cagio.pt',
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    backupEnabled: true,
    backupFrequency: 'daily'
  });

  const handleSave = () => {
    toast.success('Configurações salvas com sucesso!');
  };

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Configurações do Sistema</h1>
              <p className="text-muted-foreground mt-1">
                Gerir definições globais da plataforma CAGIO
              </p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">
                  <Settings className="h-4 w-4 mr-2" />
                  Geral
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  Segurança
                </TabsTrigger>
                <TabsTrigger value="backup">
                  <Database className="h-4 w-4 mr-2" />
                  Backup
                </TabsTrigger>
                <TabsTrigger value="localization">
                  <Globe className="h-4 w-4 mr-2" />
                  Localização
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Nome do Site</Label>
                        <Input
                          id="siteName"
                          value={settings.siteName}
                          onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="siteUrl">URL do Site</Label>
                        <Input
                          id="siteUrl"
                          value={settings.siteUrl}
                          onChange={(e) => setSettings({...settings, siteUrl: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="adminEmail">Email do Administrador</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={settings.adminEmail}
                        onChange={(e) => setSettings({...settings, adminEmail: e.target.value})}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="maintenance"
                        checked={settings.maintenanceMode}
                        onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
                      />
                      <Label htmlFor="maintenance">Modo de Manutenção</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="registration"
                        checked={settings.userRegistration}
                        onCheckedChange={(checked) => setSettings({...settings, userRegistration: checked})}
                      />
                      <Label htmlFor="registration">Permitir Registo de Utilizadores</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Notificações</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="email-notifications"
                        checked={settings.emailNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                      />
                      <Label htmlFor="email-notifications">Notificações por Email</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="sms-notifications"
                        checked={settings.smsNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                      />
                      <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Segurança</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Configurações de segurança serão implementadas em versões futuras.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="backup">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Backup</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="backup-enabled"
                        checked={settings.backupEnabled}
                        onCheckedChange={(checked) => setSettings({...settings, backupEnabled: checked})}
                      />
                      <Label htmlFor="backup-enabled">Backup Automático</Label>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="localization">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Localização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Sistema configurado para Portugal (PT). Moeda: Euro (€).
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Salvar Configurações
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
