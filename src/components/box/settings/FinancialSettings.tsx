
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Euro, 
  Plus, 
  Edit, 
  Trash2, 
  Save,
  Smartphone,
  Building,
  Banknote,
  Calculator,
  Receipt,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

export const FinancialSettings: React.FC = () => {
  const [plans, setPlans] = useState([
    {
      id: '1',
      name: 'Ilimitado Mensal',
      description: 'Acesso ilimitado a todas as modalidades',
      price: 65,
      duration: 1,
      durationType: 'months',
      features: ['Aulas ilimitadas', 'Todas as modalidades', '1 aula experimental'],
      active: true
    },
    {
      id: '2',
      name: 'Pacote 8 Aulas',
      description: 'Ideal para quem treina 2x por semana',
      price: 45,
      duration: 1,
      durationType: 'months',
      features: ['8 aulas por mês', 'Todas as modalidades', 'Válido por 6 semanas'],
      active: true
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState({
    multibanco: { enabled: true, configured: false },
    mbway: { enabled: true, configured: false },
    sepa: { enabled: false, configured: false },
    cash: { enabled: true, configured: true },
    bankTransfer: { enabled: true, configured: true },
    creditCard: { enabled: false, configured: false }
  });

  const [billingSettings, setBillingSettings] = useState({
    dueDay: 1,
    advanceNotice: 5,
    retryAttempts: 3,
    lateFee: 10,
    suspensionDays: 15,
    autoReactivation: true
  });

  const [taxSettings, setTaxSettings] = useState({
    taxRegime: 'normal',
    vatRate: 23,
    withholdingTax: false,
    autoInvoicing: true,
    invoicePrefix: 'BOX',
    currentNumber: 1
  });

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    price: 0,
    duration: 1,
    durationType: 'months'
  });

  const [showNewPlan, setShowNewPlan] = useState(false);

  const addNewPlan = () => {
    if (!newPlan.name || !newPlan.price) {
      toast.error('Preencha nome e preço do plano');
      return;
    }

    const plan = {
      id: String(plans.length + 1),
      ...newPlan,
      features: [],
      active: true
    };

    setPlans([...plans, plan]);
    setNewPlan({ name: '', description: '', price: 0, duration: 1, durationType: 'months' });
    setShowNewPlan(false);
    toast.success('Novo plano adicionado!');
  };

  const togglePaymentMethod = (method: string) => {
    setPaymentMethods({
      ...paymentMethods,
      [method]: {
        ...paymentMethods[method as keyof typeof paymentMethods],
        enabled: !paymentMethods[method as keyof typeof paymentMethods].enabled
      }
    });
    toast.success('Método de pagamento atualizado');
  };

  const handleSave = () => {
    toast.success('Configurações financeiras salvas!');
    console.log('Salvando configurações financeiras:', {
      plans,
      paymentMethods,
      billingSettings,
      taxSettings
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Configurações Financeiras</h2>
      </div>

      {/* Planos e Preços */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Euro className="h-5 w-5" />
              <span>Planos e Preços</span>
            </div>
            <Button onClick={() => setShowNewPlan(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Plano
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showNewPlan && (
            <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
              <h4 className="font-medium">Criar Novo Plano</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nome do Plano</Label>
                  <Input
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    placeholder="Ex: Ilimitado Anual"
                  />
                </div>
                <div>
                  <Label>Preço (EUR)</Label>
                  <Input
                    type="number"
                    value={newPlan.price}
                    onChange={(e) => setNewPlan({ ...newPlan, price: parseFloat(e.target.value) })}
                    placeholder="65"
                  />
                </div>
                <div>
                  <Label>Duração</Label>
                  <Input
                    type="number"
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan({ ...newPlan, duration: parseInt(e.target.value) })}
                    placeholder="1"
                  />
                </div>
                <div>
                  <Label>Tipo de Duração</Label>
                  <Select value={newPlan.durationType} onValueChange={(value) => setNewPlan({ ...newPlan, durationType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="months">Meses</SelectItem>
                      <SelectItem value="weeks">Semanas</SelectItem>
                      <SelectItem value="days">Dias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Descrição</Label>
                  <Textarea
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    placeholder="Descreva o que está incluído neste plano"
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button onClick={addNewPlan}>Adicionar Plano</Button>
                <Button variant="outline" onClick={() => setShowNewPlan(false)}>Cancelar</Button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{plan.name}</h4>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                  <Badge variant={plan.active ? "default" : "secondary"}>
                    {plan.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-primary">
                    €{plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.duration} {plan.durationType === 'months' ? 'mês' : 'semana'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {plan.features.length > 0 && (
                  <div className="space-y-1">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {feature}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métodos de Pagamento Portugal */}
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pagamento (Portugal)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span className="font-medium">Multibanco</span>
                  <Badge variant="default">Principal</Badge>
                </div>
                <Switch
                  checked={paymentMethods.multibanco.enabled}
                  onCheckedChange={() => togglePaymentMethod('multibanco')}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Pagamentos por referência MB</p>
              <Badge variant={paymentMethods.multibanco.configured ? "default" : "outline"}>
                {paymentMethods.multibanco.configured ? 'Configurado' : 'Não configurado'}
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span className="font-medium">MB Way</span>
                </div>
                <Switch
                  checked={paymentMethods.mbway.enabled}
                  onCheckedChange={() => togglePaymentMethod('mbway')}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Pagamentos instantâneos</p>
              <Badge variant={paymentMethods.mbway.configured ? "default" : "outline"}>
                {paymentMethods.mbway.configured ? 'Configurado' : 'Não configurado'}
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span className="font-medium">Débito Direto SEPA</span>
                </div>
                <Switch
                  checked={paymentMethods.sepa.enabled}
                  onCheckedChange={() => togglePaymentMethod('sepa')}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Cobrança automática mensal</p>
              <Badge variant={paymentMethods.sepa.configured ? "default" : "outline"}>
                {paymentMethods.sepa.configured ? 'Configurado' : 'Não configurado'}
              </Badge>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Banknote className="h-5 w-5" />
                  <span className="font-medium">Dinheiro</span>
                </div>
                <Switch
                  checked={paymentMethods.cash.enabled}
                  onCheckedChange={() => togglePaymentMethod('cash')}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Pagamentos presenciais</p>
              <Badge variant="default">Sempre disponível</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações de Cobrança */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calculator className="h-5 w-5" />
            <span>Configurações de Cobrança</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Dia de Vencimento Mensal</Label>
              <Select value={String(billingSettings.dueDay)} onValueChange={(value) => setBillingSettings({ ...billingSettings, dueDay: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={String(day)}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Antecedência para Cobrança (dias)</Label>
              <Input
                type="number"
                value={billingSettings.advanceNotice}
                onChange={(e) => setBillingSettings({ ...billingSettings, advanceNotice: parseInt(e.target.value) })}
                min="1"
                max="15"
              />
            </div>

            <div>
              <Label>Tentativas de Recobrança</Label>
              <Input
                type="number"
                value={billingSettings.retryAttempts}
                onChange={(e) => setBillingSettings({ ...billingSettings, retryAttempts: parseInt(e.target.value) })}
                min="1"
                max="5"
              />
            </div>

            <div>
              <Label>Taxa de Atraso (EUR)</Label>
              <Input
                type="number"
                value={billingSettings.lateFee}
                onChange={(e) => setBillingSettings({ ...billingSettings, lateFee: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label>Suspensão Automática (dias em atraso)</Label>
              <Input
                type="number"
                value={billingSettings.suspensionDays}
                onChange={(e) => setBillingSettings({ ...billingSettings, suspensionDays: parseInt(e.target.value) })}
                min="1"
                max="30"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Reativação Automática</Label>
                <p className="text-sm text-muted-foreground">
                  Reativar conta após pagamento
                </p>
              </div>
              <Switch
                checked={billingSettings.autoReactivation}
                onCheckedChange={(checked) => setBillingSettings({ ...billingSettings, autoReactivation: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configurações Fiscais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>Configurações Fiscais (Portugal)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Regime Tributário</Label>
              <Select value={taxSettings.taxRegime} onValueChange={(value) => setTaxSettings({ ...taxSettings, taxRegime: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="simplified">Simplificado</SelectItem>
                  <SelectItem value="micro">Micro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Taxa de IVA (%)</Label>
              <Input
                type="number"
                value={taxSettings.vatRate}
                onChange={(e) => setTaxSettings({ ...taxSettings, vatRate: parseFloat(e.target.value) })}
                min="0"
                max="100"
                step="0.1"
              />
            </div>

            <div>
              <Label>Prefixo da Fatura</Label>
              <Input
                value={taxSettings.invoicePrefix}
                onChange={(e) => setTaxSettings({ ...taxSettings, invoicePrefix: e.target.value })}
                placeholder="BOX"
              />
            </div>

            <div>
              <Label>Próximo Número de Fatura</Label>
              <Input
                type="number"
                value={taxSettings.currentNumber}
                onChange={(e) => setTaxSettings({ ...taxSettings, currentNumber: parseInt(e.target.value) })}
                min="1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Retenção na Fonte</Label>
                <p className="text-sm text-muted-foreground">
                  Aplicar retenção automática
                </p>
              </div>
              <Switch
                checked={taxSettings.withholdingTax}
                onCheckedChange={(checked) => setTaxSettings({ ...taxSettings, withholdingTax: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Faturação Automática</Label>
                <p className="text-sm text-muted-foreground">
                  Gerar faturas automaticamente
                </p>
              </div>
              <Switch
                checked={taxSettings.autoInvoicing}
                onCheckedChange={(checked) => setTaxSettings({ ...taxSettings, autoInvoicing: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações Financeiras
      </Button>
    </div>
  );
};
