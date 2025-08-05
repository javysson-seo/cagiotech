
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { 
  CreditCard,
  Smartphone,
  Building,
  Check,
  X,
  Settings,
  Plus,
  Eye,
  EyeOff,
  AlertCircle,
  Info
} from 'lucide-react';

interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: 'connected' | 'disconnected' | 'pending';
  features: string[];
  fees: {
    credit: string;
    debit: string;
    pix?: string;
  };
}

export const PaymentIntegrations: React.FC = () => {
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});

  const paymentProviders: PaymentProvider[] = [
    {
      id: 'stripe',
      name: 'Stripe',
      logo: '💳',
      description: 'Processador de pagamentos global com suporte completo',
      status: 'connected',
      features: ['Cartões de Crédito', 'Cartões de Débito', 'Assinaturas', 'Webhooks'],
      fees: {
        credit: '3.4% + R$ 0,40',
        debit: '2.9% + R$ 0,40'
      }
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      logo: '💙',
      description: 'Solução completa de pagamentos para o Brasil',
      status: 'connected',
      features: ['PIX', 'Cartões', 'Boleto', 'Assinaturas Recorrentes'],
      fees: {
        credit: '4.99%',
        debit: '3.99%',
        pix: '0.99%'
      }
    },
    {
      id: 'pagseguro',
      name: 'PagSeguro',
      logo: '🔒',
      description: 'Pagamentos seguros e confiáveis',
      status: 'disconnected',
      features: ['Cartões', 'PIX', 'Boleto', 'Link de Pagamento'],
      fees: {
        credit: '4.39%',
        debit: '3.49%',
        pix: '0.99%'
      }
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logo: '🌐',
      description: 'Pagamentos internacionais e nacionais',
      status: 'pending',
      features: ['PayPal', 'Cartões Internacionais', 'Express Checkout'],
      fees: {
        credit: '4.49% + R$ 0,60',
        debit: '4.49% + R$ 0,60'
      }
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-700"><Check className="h-3 w-3 mr-1" />Conectado</Badge>;
      case 'pending':
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Pendente</Badge>;
      default:
        return <Badge variant="secondary"><X className="h-3 w-3 mr-1" />Desconectado</Badge>;
    }
  };

  const toggleApiKeyVisibility = (providerId: string) => {
    setShowApiKeys(prev => ({
      ...prev,
      [providerId]: !prev[providerId]
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Integrações de Pagamento</h1>
          <p className="text-muted-foreground">
            Configure métodos de pagamento para sua academia
          </p>
        </div>
        
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Integração
        </Button>
      </div>

      <Tabs defaultValue="providers" className="space-y-6">
        <TabsList>
          <TabsTrigger value="providers">Provedores</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-6">
          {/* Payment Providers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentProviders.map((provider) => (
              <Card key={provider.id} className="relative">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{provider.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{provider.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {provider.description}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(provider.status)}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Recursos</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Fees */}
                  <div>
                    <h4 className="font-medium text-sm mb-2">Taxas</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Cartão de Crédito:</span>
                        <span className="font-medium">{provider.fees.credit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Cartão de Débito:</span>
                        <span className="font-medium">{provider.fees.debit}</span>
                      </div>
                      {provider.fees.pix && (
                        <div className="flex justify-between">
                          <span>PIX:</span>
                          <span className="font-medium">{provider.fees.pix}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* API Configuration */}
                  {provider.status === 'connected' && (
                    <div className="space-y-3 p-3 bg-muted rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Chave da API</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(provider.id)}
                        >
                          {showApiKeys[provider.id] ? 
                            <EyeOff className="h-4 w-4" /> : 
                            <Eye className="h-4 w-4" />
                          }
                        </Button>
                      </div>
                      <Input
                        type={showApiKeys[provider.id] ? 'text' : 'password'}
                        value="sk_test_••••••••••••••••••••••••"
                        readOnly
                        className="text-xs"
                      />
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="h-4 w-4 mr-2" />
                          Configurar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          Desconectar
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {provider.status === 'disconnected' && (
                    <Button className="w-full">
                      Conectar {provider.name}
                    </Button>
                  )}

                  {provider.status === 'pending' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-amber-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>Aguardando aprovação</span>
                      </div>
                      <Button variant="outline" className="w-full">
                        Verificar Status
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Cobrança Automática</h4>
                  <p className="text-sm text-muted-foreground">
                    Processar pagamentos recorrentes automaticamente
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notificações de Pagamento</h4>
                  <p className="text-sm text-muted-foreground">
                    Enviar emails sobre status de pagamentos
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Tentativas de Cobrança</h4>
                  <p className="text-sm text-muted-foreground">
                    Número máximo de tentativas para pagamentos falhos
                  </p>
                </div>
                <Input className="w-20" defaultValue="3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Prazo de Vencimento</h4>
                  <p className="text-sm text-muted-foreground">
                    Dias após vencimento para cancelar assinatura
                  </p>
                </div>
                <Input className="w-20" defaultValue="7" />
              </div>
            </CardContent>
          </Card>

          {/* Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">URL do Webhook</h4>
                    <p className="text-sm text-blue-700">
                      Configure esta URL nos seus provedores de pagamento
                    </p>
                    <code className="block mt-2 p-2 bg-blue-100 rounded text-sm">
                      https://seudominio.com/api/webhooks/payments
                    </code>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Eventos Configurados</h4>
                <div className="space-y-2">
                  {[
                    'payment.success',
                    'payment.failed',
                    'subscription.created',
                    'subscription.canceled',
                    'invoice.created'
                  ].map((event) => (
                    <div key={event} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm font-mono">{event}</span>
                      <Badge variant="outline">Ativo</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Payment Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                    <p className="text-2xl font-bold">R$ 45.230</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Smartphone className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Taxa de Sucesso</p>
                    <p className="text-2xl font-bold">96.8%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Assinantes Ativos</p>
                    <p className="text-2xl font-bold">1.247</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <AlertCircle className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Pagamentos Falhos</p>
                    <p className="text-2xl font-bold">23</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <p className="text-muted-foreground">Gráfico de pagamentos será exibido aqui</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Método de Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>PIX</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cartão de Crédito</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cartão de Débito</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '8%' }}></div>
                    </div>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Boleto</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-muted rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: '2%' }}></div>
                    </div>
                    <span className="text-sm font-medium">2%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
