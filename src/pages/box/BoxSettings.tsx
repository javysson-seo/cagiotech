
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Settings, MapPin, Clock, Euro, Bell, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

export const BoxSettings: React.FC = () => {
  const [settings, setSettings] = useState({
    name: 'CrossFit Porto',
    description: 'A melhor BOX de CrossFit do Porto',
    address: 'Rua das Flores, 123',
    city: 'Porto',
    postalCode: '4000-001',
    phone: '+351 912 345 678',
    email: 'info@crossfitporto.com',
    website: 'www.crossfitporto.com',
    capacity: 30,
    openingHour: '06:00',
    closingHour: '22:00',
    monthlyFee: 65,
    dropInPrice: 15,
    personalTrainingPrice: 40,
    enableNotifications: true,
    enableOnlineBooking: true,
    requireApproval: false
  });

  const handleSave = () => {
    toast.success('Configurações guardadas com sucesso!');
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Configurações da BOX</h1>
              <p className="text-muted-foreground">Gerir informações e preferências da sua BOX</p>
            </div>

            <Tabs defaultValue="general" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general">
                  <Settings className="h-4 w-4 mr-2" />
                  Geral
                </TabsTrigger>
                <TabsTrigger value="location">
                  <MapPin className="h-4 w-4 mr-2" />
                  Localização
                </TabsTrigger>
                <TabsTrigger value="schedule">
                  <Clock className="h-4 w-4 mr-2" />
                  Horários
                </TabsTrigger>
                <TabsTrigger value="pricing">
                  <Euro className="h-4 w-4 mr-2" />
                  Preços
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="h-4 w-4 mr-2" />
                  Segurança
                </TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome da BOX</Label>
                        <Input
                          id="name"
                          value={settings.name}
                          onChange={(e) => setSettings({...settings, name: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="capacity">Capacidade Máxima</Label>
                        <Input
                          id="capacity"
                          type="number"
                          value={settings.capacity}
                          onChange={(e) => setSettings({...settings, capacity: parseInt(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={settings.description}
                        onChange={(e) => setSettings({...settings, description: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={settings.phone}
                          onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={settings.email}
                          onChange={(e) => setSettings({...settings, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={settings.website}
                        onChange={(e) => setSettings({...settings, website: e.target.value})}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card>
                  <CardHeader>
                    <CardTitle>Localização</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Morada</Label>
                      <Input
                        id="address"
                        value={settings.address}
                        onChange={(e) => setSettings({...settings, address: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade</Label>
                        <Input
                          id="city"
                          value={settings.city}
                          onChange={(e) => setSettings({...settings, city: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Código Postal</Label>
                        <Input
                          id="postalCode"
                          value={settings.postalCode}
                          onChange={(e) => setSettings({...settings, postalCode: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule">
                <Card>
                  <CardHeader>
                    <CardTitle>Horários de Funcionamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="openingHour">Abertura</Label>
                        <Input
                          id="openingHour"
                          type="time"
                          value={settings.openingHour}
                          onChange={(e) => setSettings({...settings, openingHour: e.target.value})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="closingHour">Encerramento</Label>
                        <Input
                          id="closingHour"
                          type="time"
                          value={settings.closingHour}
                          onChange={(e) => setSettings({...settings, closingHour: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pricing">
                <Card>
                  <CardHeader>
                    <CardTitle>Preçário</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthlyFee">Mensalidade (€)</Label>
                        <Input
                          id="monthlyFee"
                          type="number"
                          value={settings.monthlyFee}
                          onChange={(e) => setSettings({...settings, monthlyFee: parseFloat(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dropInPrice">Aula Avulsa (€)</Label>
                        <Input
                          id="dropInPrice"
                          type="number"
                          value={settings.dropInPrice}
                          onChange={(e) => setSettings({...settings, dropInPrice: parseFloat(e.target.value)})}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="personalTrainingPrice">Personal Training (€)</Label>
                        <Input
                          id="personalTrainingPrice"
                          type="number"
                          value={settings.personalTrainingPrice}
                          onChange={(e) => setSettings({...settings, personalTrainingPrice: parseFloat(e.target.value)})}
                        />
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      * Preços incluem IVA à taxa legal em vigor (23%)
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Notificação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications"
                        checked={settings.enableNotifications}
                        onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                      />
                      <Label htmlFor="notifications">Ativar Notificações</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="booking"
                        checked={settings.enableOnlineBooking}
                        onCheckedChange={(checked) => setSettings({...settings, enableOnlineBooking: checked})}
                      />
                      <Label htmlFor="booking">Reservas Online</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="approval"
                        checked={settings.requireApproval}
                        onCheckedChange={(checked) => setSettings({...settings, requireApproval: checked})}
                      />
                      <Label htmlFor="approval">Requerer Aprovação para Novos Membros</Label>
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
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full">
                        <Shield className="h-4 w-4 mr-2" />
                        Alterar Password
                      </Button>
                      
                      <Button variant="outline" className="w-full">
                        <Users className="h-4 w-4 mr-2" />
                        Gerir Permissões de Staff
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-3">
              <Button variant="outline">Cancelar</Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                Guardar Alterações
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
