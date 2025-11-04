import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, X, Plus, CreditCard, Building2, Smartphone, Wallet } from 'lucide-react';
import { subscriptionPlanSchema } from '@/lib/validation-schemas';
import { z } from 'zod';
import { toast } from 'sonner';

interface PaymentMethodConfig {
  enabled: boolean;
  requiresApproval: boolean;
  autoRenewal: boolean;
}

interface SubscriptionPlanFormEnhancedProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (plan: any) => void;
  companyId: string;
  initialData?: any;
}

export const SubscriptionPlanFormEnhanced = ({
  open,
  onClose,
  onSubmit,
  companyId,
  initialData,
}: SubscriptionPlanFormEnhancedProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [billingPeriod, setBillingPeriod] = useState<string>(initialData?.billing_period || 'monthly');
  const [maxClassesPerWeek, setMaxClassesPerWeek] = useState(initialData?.max_classes_per_week?.toString() || '');
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [newFeature, setNewFeature] = useState('');
  const [validationErrors, setValidationErrors] = useState<z.ZodError | null>(null);
  
  // Payment methods configuration
  const [paymentMethods, setPaymentMethods] = useState<Record<string, PaymentMethodConfig>>({
    mbway: {
      enabled: initialData?.payment_methods?.mbway?.enabled ?? true,
      requiresApproval: true, // MBWay sempre requer aprovação manual
      autoRenewal: initialData?.payment_methods?.mbway?.autoRenewal ?? false,
    },
    multibanco: {
      enabled: initialData?.payment_methods?.multibanco?.enabled ?? true,
      requiresApproval: initialData?.payment_methods?.multibanco?.requiresApproval ?? false,
      autoRenewal: initialData?.payment_methods?.multibanco?.autoRenewal ?? false,
    },
    cash: {
      enabled: initialData?.payment_methods?.cash?.enabled ?? true,
      requiresApproval: initialData?.payment_methods?.cash?.requiresApproval ?? false,
      autoRenewal: false, // Dinheiro não pode ter renovação automática
    },
    bank_transfer: {
      enabled: initialData?.payment_methods?.bank_transfer?.enabled ?? true,
      requiresApproval: initialData?.payment_methods?.bank_transfer?.requiresApproval ?? true,
      autoRenewal: initialData?.payment_methods?.bank_transfer?.autoRenewal ?? false,
    },
  });

  const [notificationSettings, setNotificationSettings] = useState({
    daysBeforeDue: initialData?.notification_settings?.daysBeforeDue ?? 3,
    reminderEnabled: initialData?.notification_settings?.reminderEnabled ?? true,
    overdueNotification: initialData?.notification_settings?.overdueNotification ?? true,
  });

  useEffect(() => {
    if (open && !initialData) {
      // Reset form when opening for new plan
      setName('');
      setDescription('');
      setPrice('');
      setBillingPeriod('monthly');
      setMaxClassesPerWeek('');
      setIsActive(true);
      setFeatures([]);
      setNewFeature('');
      setValidationErrors(null);
    }
  }, [open, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const planData = {
      name,
      price: parseFloat(price),
      billing_period: billingPeriod as 'monthly' | 'quarterly' | 'yearly',
      features,
      is_active: isActive,
    };

    const validation = subscriptionPlanSchema.safeParse(planData);
    
    if (!validation.success) {
      setValidationErrors(validation.error);
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setValidationErrors(null);

    onSubmit({
      ...(initialData?.id && { id: initialData.id }),
      company_id: companyId,
      ...validation.data,
      description: description || null,
      max_classes_per_week: maxClassesPerWeek ? parseInt(maxClassesPerWeek) : null,
      payment_methods: paymentMethods,
      notification_settings: notificationSettings,
    });

    onClose();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const togglePaymentMethod = (method: string, field: keyof PaymentMethodConfig) => {
    setPaymentMethods(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: !prev[method][field],
      },
    }));
  };

  const paymentMethodsInfo = [
    { 
      id: 'mbway', 
      label: 'MBWay', 
      icon: Smartphone,
      description: 'Requer aprovação manual do usuário no app',
      gateway: 'IfthenPay'
    },
    { 
      id: 'multibanco', 
      label: 'Multibanco', 
      icon: Building2,
      description: 'Referência de pagamento automática',
      gateway: 'IfthenPay'
    },
    { 
      id: 'cash', 
      label: 'Dinheiro', 
      icon: Wallet,
      description: 'Pagamento presencial',
      gateway: 'Manual'
    },
    { 
      id: 'bank_transfer', 
      label: 'Transferência', 
      icon: CreditCard,
      description: 'Transferência bancária',
      gateway: 'Manual'
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Plano' : 'Novo Plano de Assinatura'}
          </DialogTitle>
        </DialogHeader>

        {validationErrors && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error.path.join('.')}: {error.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
            <TabsTrigger value="payment">Métodos de Pagamento</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Plano *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Plano Mensal Básico"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o que está incluído neste plano"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (€) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="billing_period">Período de Cobrança *</Label>
                  <Select value={billingPeriod} onValueChange={setBillingPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensal</SelectItem>
                      <SelectItem value="quarterly">Trimestral</SelectItem>
                      <SelectItem value="yearly">Anual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="max_classes">Máximo de Aulas por Semana</Label>
                <Input
                  id="max_classes"
                  type="number"
                  min="0"
                  value={maxClassesPerWeek}
                  onChange={(e) => setMaxClassesPerWeek(e.target.value)}
                  placeholder="Deixe vazio para ilimitado"
                />
              </div>

              <div>
                <Label>Funcionalidades Incluídas</Label>
                <div className="space-y-2">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={feature} disabled className="flex-1" />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Adicionar funcionalidade"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addFeature();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" size="icon" onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Plano Ativo</Label>
                <Switch
                  id="is_active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>
            </TabsContent>

            <TabsContent value="payment" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Configure os métodos de pagamento disponíveis para este plano. 
                  MBWay sempre requer aprovação manual do atleta no app.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                {paymentMethodsInfo.map((method) => {
                  const Icon = method.icon;
                  return (
                    <Card key={method.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-base">{method.label}</CardTitle>
                              <CardDescription className="text-xs">
                                Gateway: {method.gateway}
                              </CardDescription>
                            </div>
                          </div>
                          <Switch
                            checked={paymentMethods[method.id]?.enabled}
                            onCheckedChange={() => togglePaymentMethod(method.id, 'enabled')}
                          />
                        </div>
                      </CardHeader>
                      {paymentMethods[method.id]?.enabled && (
                        <CardContent className="space-y-3 pt-0">
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`${method.id}-approval`} className="text-sm">
                              Requer Aprovação Manual
                            </Label>
                            <Switch
                              id={`${method.id}-approval`}
                              checked={paymentMethods[method.id]?.requiresApproval}
                              onCheckedChange={() => togglePaymentMethod(method.id, 'requiresApproval')}
                              disabled={method.id === 'mbway'}
                            />
                          </div>

                          {method.id !== 'cash' && (
                            <div className="flex items-center justify-between">
                              <Label htmlFor={`${method.id}-renewal`} className="text-sm">
                                Renovação Automática
                              </Label>
                              <Switch
                                id={`${method.id}-renewal`}
                                checked={paymentMethods[method.id]?.autoRenewal}
                                onCheckedChange={() => togglePaymentMethod(method.id, 'autoRenewal')}
                              />
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Notificação</CardTitle>
                  <CardDescription>
                    Configure quando os atletas serão notificados sobre pagamentos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="days-before">Dias antes do vencimento</Label>
                    <Input
                      id="days-before"
                      type="number"
                      min="1"
                      max="30"
                      value={notificationSettings.daysBeforeDue}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        daysBeforeDue: parseInt(e.target.value) || 3,
                      }))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Atletas receberão lembretes {notificationSettings.daysBeforeDue} dias antes do vencimento
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="reminder">Lembretes Automáticos</Label>
                      <p className="text-xs text-muted-foreground">
                        Enviar lembretes automáticos de pagamento
                      </p>
                    </div>
                    <Switch
                      id="reminder"
                      checked={notificationSettings.reminderEnabled}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        reminderEnabled: checked,
                      }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="overdue">Notificação de Atraso</Label>
                      <p className="text-xs text-muted-foreground">
                        Notificar atletas com pagamentos atrasados
                      </p>
                    </div>
                    <Switch
                      id="overdue"
                      checked={notificationSettings.overdueNotification}
                      onCheckedChange={(checked) => setNotificationSettings(prev => ({
                        ...prev,
                        overdueNotification: checked,
                      }))}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                {initialData ? 'Atualizar' : 'Criar'} Plano
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};