
import React, { useState } from 'react';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Building2, 
  CreditCard, 
  Bell, 
  Palette, 
  Upload, 
  Shield,
  Save,
  Eye,
  Camera,
  Mail,
  Phone,
  MapPin,
  Euro,
  Clock,
  Users
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';
import { toast } from 'sonner';

export const BoxSettings: React.FC = () => {
  const { user } = useAuth();
  const { canManageSettings } = usePermissions();
  const [activeTab, setActiveTab] = useState('box-info');

  // Estados para os formulários
  const [boxData, setBoxData] = useState({
    name: user?.boxName || 'CrossFit Benfica',
    description: 'A melhor BOX de CrossFit de Lisboa',
    address: 'Rua do Exemplo, 123, Lisboa',
    phone: '+351 912 345 678',
    email: 'info@crossfitbenfica.com',
    website: 'https://crossfitbenfica.com',
    capacity: 30,
    openHours: '06:00 - 22:00',
    logo: null as File | null
  });

  const [colors, setColors] = useState({
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    text: '#1f2937',
    background: '#ffffff'
  });

  const [notifications, setNotifications] = useState({
    emailNewMember: true,
    emailPaymentDue: true,
    emailClassCancelled: true,
    smsReminders: false,
    pushNotifications: true,
    weeklyReports: true,
    monthlyReports: true
  });

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

  const handleSave = (section: string) => {
    // Aqui seria a integração com o backend
    toast.success(`Configurações de ${section} salvas com sucesso!`);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBoxData({ ...boxData, logo: file });
      toast.success('Logo carregado! Clique em Salvar para aplicar.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <BoxHeader />
      
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Configurações da BOX
          </h1>
          <p className="text-muted-foreground">
            Gerencie todos os aspectos da sua BOX em um só lugar
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="box-info" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>BOX</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>Visual</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notificações</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Pagamentos</span>
            </TabsTrigger>
            <TabsTrigger value="permissions" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Permissões</span>
            </TabsTrigger>
          </TabsList>

          {/* Informações da BOX */}
          <TabsContent value="box-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building2 className="h-5 w-5" />
                  <span>Informações da BOX</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="boxName">Nome da BOX</Label>
                    <Input
                      id="boxName"
                      value={boxData.name}
                      onChange={(e) => setBoxData({ ...boxData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacidade Máxima</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={boxData.capacity}
                      onChange={(e) => setBoxData({ ...boxData, capacity: parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={boxData.description}
                    onChange={(e) => setBoxData({ ...boxData, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>Telefone</span>
                    </Label>
                    <Input
                      id="phone"
                      value={boxData.phone}
                      onChange={(e) => setBoxData({ ...boxData, phone: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={boxData.email}
                      onChange={(e) => setBoxData({ ...boxData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>Endereço</span>
                  </Label>
                  <Input
                    id="address"
                    value={boxData.address}
                    onChange={(e) => setBoxData({ ...boxData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={boxData.website}
                      onChange={(e) => setBoxData({ ...boxData, website: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hours" className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Horário de Funcionamento</span>
                    </Label>
                    <Input
                      id="hours"
                      value={boxData.openHours}
                      onChange={(e) => setBoxData({ ...boxData, openHours: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave('informações da BOX')} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Informações
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personalização Visual */}
          <TabsContent value="visual" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upload do Logo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Logo da BOX</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label htmlFor="logo-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg cursor-pointer hover:bg-muted/50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Camera className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="font-semibold">Clique para carregar</span> ou arraste o logo
                        </p>
                      </div>
                      <input 
                        id="logo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Formato recomendado: PNG, 200x200px
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Personalização de Cores */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Palette className="h-5 w-5" />
                    <span>Cores do Sistema</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="primary">Cor Primária</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="primary"
                          value={colors.primary}
                          onChange={(e) => setColors({ ...colors, primary: e.target.value })}
                          className="w-8 h-8 rounded border"
                        />
                        <span className="text-sm text-muted-foreground">{colors.primary}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="secondary">Cor Secundária</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="secondary"
                          value={colors.secondary}
                          onChange={(e) => setColors({ ...colors, secondary: e.target.value })}
                          className="w-8 h-8 rounded border"
                        />
                        <span className="text-sm text-muted-foreground">{colors.secondary}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="accent">Cor de Destaque</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          id="accent"
                          value={colors.accent}
                          onChange={(e) => setColors({ ...colors, accent: e.target.value })}
                          className="w-8 h-8 rounded border"
                        />
                        <span className="text-sm text-muted-foreground">{colors.accent}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setColors({
                            primary: '#3b82f6',
                            secondary: '#10b981',
                            accent: '#f59e0b',
                            text: '#1f2937',
                            background: '#ffffff'
                          })}
                        >
                          Resetar Cores
                        </Button>
                        <Button 
                          size="sm"
                          onClick={() => handleSave('cores do sistema')}
                        >
                          Aplicar Cores
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Configurações de Notificações */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Configurações de Notificações</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email - Novo Membro</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber email quando um novo membro se inscrever
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailNewMember}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, emailNewMember: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email - Pagamento em Atraso</Label>
                      <p className="text-sm text-muted-foreground">
                        Alertas de pagamentos pendentes
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailPaymentDue}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, emailPaymentDue: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email - Aula Cancelada</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificar sobre cancelamento de aulas
                      </p>
                    </div>
                    <Switch
                      checked={notifications.emailClassCancelled}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, emailClassCancelled: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS - Lembretes</Label>
                      <p className="text-sm text-muted-foreground">
                        Lembretes de aulas por SMS
                      </p>
                    </div>
                    <Switch
                      checked={notifications.smsReminders}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, smsReminders: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Notificações no navegador
                      </p>
                    </div>
                    <Switch
                      checked={notifications.pushNotifications}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, pushNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Relatórios Semanais</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber relatório semanal por email
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, weeklyReports: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Relatórios Mensais</Label>
                      <p className="text-sm text-muted-foreground">
                        Receber relatório mensal detalhado
                      </p>
                    </div>
                    <Switch
                      checked={notifications.monthlyReports}
                      onCheckedChange={(checked) => 
                        setNotifications({ ...notifications, monthlyReports: checked })
                      }
                    />
                  </div>
                </div>

                <Button onClick={() => handleSave('notificações')} className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações de Notificação
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações de Pagamento */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Configurações de Pagamento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Integração com Supabase Necessária</h4>
                  <p className="text-sm text-blue-800">
                    Para configurar métodos de pagamento e conectar com gateways como Multibanco, 
                    MB Way e Stripe, é necessário conectar o projeto ao Supabase.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Métodos de Pagamento Disponíveis:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium">Multibanco</h5>
                      <p className="text-sm text-muted-foreground">Pagamentos por referência</p>
                      <Badge variant="outline">Em breve</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium">MB Way</h5>
                      <p className="text-sm text-muted-foreground">Pagamentos instantâneos</p>
                      <Badge variant="outline">Em breve</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium">Cartão de Crédito</h5>
                      <p className="text-sm text-muted-foreground">Via Stripe</p>
                      <Badge variant="outline">Em breve</Badge>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium">Débito Direto</h5>
                      <p className="text-sm text-muted-foreground">SEPA Direct Debit</p>
                      <Badge variant="outline">Em breve</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tabela de Permissões */}
          <TabsContent value="permissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Sistema de Permissões</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Funcionalidade</th>
                        <th className="text-center p-3 font-medium">
                          <div className="flex flex-col items-center">
                            <Users className="h-4 w-4 mb-1" />
                            <span className="text-xs">BOX Admin</span>
                          </div>
                        </th>
                        <th className="text-center p-3 font-medium">
                          <div className="flex flex-col items-center">
                            <Users className="h-4 w-4 mb-1" />
                            <span className="text-xs">Trainer</span>
                          </div>
                        </th>
                        <th className="text-center p-3 font-medium">
                          <div className="flex flex-col items-center">
                            <Users className="h-4 w-4 mb-1" />
                            <span className="text-xs">Aluno</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Gestão de Atletas</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">👁️</td>
                        <td className="text-center p-3">❌</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Gestão de Trainers</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">❌</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Criar/Editar Aulas</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">❌</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Reservar Aulas</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">✅</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Relatórios Financeiros</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">❌</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Configurações da BOX</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">❌</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Comunicação/Feed</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">📝</td>
                        <td className="text-center p-3">👁️</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Gestão de Pagamentos</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">👁️</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Check-in Aulas</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">❌</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="p-3">Planos de Treino</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">✅</td>
                        <td className="text-center p-3">👁️</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Legenda:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    <div>✅ Acesso Total</div>
                    <div>👁️ Apenas Visualizar</div>
                    <div>📝 Criar/Editar</div>
                    <div>❌ Sem Acesso</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
