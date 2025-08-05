
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { Settings, Bell, Shield, Database, Mail, Palette, Globe } from 'lucide-react';
import { toast } from 'sonner';

export const SystemSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    security: {
      twoFactor: true,
      sessionTimeout: '30',
      passwordExpiry: '90'
    },
    general: {
      siteName: 'CagioTech',
      defaultLanguage: 'pt',
      timezone: 'Europe/Lisbon',
      currency: 'EUR'
    }
  });

  const handleSaveSettings = () => {
    toast.success('Definições guardadas com sucesso!');
  };

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Definições do Sistema</h1>
                <p className="text-muted-foreground">Configure as definições globais da plataforma</p>
              </div>
              <Button onClick={handleSaveSettings}>
                Guardar Alterações
              </Button>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
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
                <TabsTrigger value="database">
                  <Database className="h-4 w-4 mr-2" />
                  Base de Dados
                </TabsTrigger>
                <TabsTrigger value="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="appearance">
                  <Palette className="h-4 w-4 mr-2" />
                  Aparência
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Configurações Gerais</CardTitle>
                      <CardDescription>
                        Definições básicas da plataforma
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="siteName">Nome da Plataforma</Label>
                          <Input
                            id="siteName"
                            value={settings.general.siteName}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, siteName: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="defaultLanguage">Idioma Padrão</Label>
                          <Input
                            id="defaultLanguage"
                            value={settings.general.defaultLanguage}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, defaultLanguage: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="timezone">Fuso Horário</Label>
                          <Input
                            id="timezone"
                            value={settings.general.timezone}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, timezone: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currency">Moeda</Label>
                          <Input
                            id="currency"
                            value={settings.general.currency}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              general: { ...prev.general, currency: e.target.value }
                            }))}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notificações</CardTitle>
                    <CardDescription>
                      Configure as notificações do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificações por Email</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber notificações importantes por email
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificações SMS</Label>
                        <p className="text-sm text-muted-foreground">
                          Receber alertas críticos por SMS
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: checked }
                        }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificações Push</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificações em tempo real no navegador
                        </p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: checked }
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Segurança</CardTitle>
                    <CardDescription>
                      Configurações de segurança da plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Autenticação de Dois Fatores</Label>
                        <p className="text-sm text-muted-foreground">
                          Obrigatório para administradores
                        </p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactor}
                        onCheckedChange={(checked) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactor: checked }
                        }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="sessionTimeout">Timeout de Sessão (min)</Label>
                        <Input
                          id="sessionTimeout"
                          type="number"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, sessionTimeout: e.target.value }
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passwordExpiry">Expiração da Password (dias)</Label>
                        <Input
                          id="passwordExpiry"
                          type="number"
                          value={settings.security.passwordExpiry}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            security: { ...prev.security, passwordExpiry: e.target.value }
                          }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="database">
                <Card>
                  <CardHeader>
                    <CardTitle>Base de Dados</CardTitle>
                    <CardDescription>
                      Configurações e manutenção da base de dados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Backup Automático</h4>
                        <p className="text-sm text-muted-foreground">Último backup: há 2 horas</p>
                      </div>
                      <Button variant="outline">Fazer Backup</Button>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">Otimização</h4>
                        <p className="text-sm text-muted-foreground">Última otimização: ontem</p>
                      </div>
                      <Button variant="outline">Otimizar</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="email">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Email</CardTitle>
                    <CardDescription>
                      Configurar servidor SMTP e templates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpServer">Servidor SMTP</Label>
                        <Input id="smtpServer" placeholder="smtp.gmail.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">Porta</Label>
                        <Input id="smtpPort" placeholder="587" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpUser">Utilizador</Label>
                        <Input id="smtpUser" placeholder="noreply@cagio.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPass">Password</Label>
                        <Input id="smtpPass" type="password" />
                      </div>
                    </div>
                    <Button className="w-full">Testar Configuração</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Aparência</CardTitle>
                    <CardDescription>
                      Personalize a aparência da plataforma
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <Label>Tema</Label>
                        <div className="flex gap-2 mt-2">
                          <Button variant="outline" size="sm">Claro</Button>
                          <Button variant="outline" size="sm">Escuro</Button>
                          <Button variant="outline" size="sm">Sistema</Button>
                        </div>
                      </div>
                      <div>
                        <Label>Cor Primária</Label>
                        <div className="flex gap-2 mt-2">
                          <div className="w-8 h-8 bg-blue-600 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-green-600 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-purple-600 rounded cursor-pointer"></div>
                          <div className="w-8 h-8 bg-red-600 rounded cursor-pointer"></div>
                        </div>
                      </div>
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
