import React, { useState } from 'react';
import { BoxHeader } from '@/components/box/BoxHeader';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Check, CreditCard, Smartphone, AlertCircle } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { useCompanySubscription } from '@/hooks/useCompanySubscription';
import { useCagioSubscriptionPlans } from '@/hooks/useCagioSubscriptionPlans';
import { useCagioSubscriptionPayments } from '@/hooks/useCagioSubscriptionPayments';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ViewPlansModal } from '@/components/subscriptions/ViewPlansModal';

const Subscription: React.FC = () => {
  const [viewPlansOpen, setViewPlansOpen] = useState(false);
  const { currentCompany } = useCompany();
  const { subscription, loading } = useCompanySubscription();
  const { plans, isLoading: plansLoading } = useCagioSubscriptionPlans();
  const { createPayment, isCreating } = useCagioSubscriptionPayments();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'multibanco' | 'mbway'>('multibanco');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const currentPlan = plans.find(p => p.slug === subscription?.subscription_plan) || plans.find(p => p.slug === 'free');

  const handleSubscribe = async (planId: string) => {
    if (!currentCompany) return;

    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const amount = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;

    if (amount === 0) {
      // Free plan, no payment needed
      return;
    }

    createPayment(
      {
        company_id: currentCompany.id,
        plan_id: planId,
        billing_period: billingPeriod,
        amount,
        payment_method: paymentMethod,
        phone_number: paymentMethod === 'mbway' ? phoneNumber : undefined,
      },
      {
        onSuccess: (data) => {
          setPaymentResult(data);
        },
      }
    );
  };

  if (loading || plansLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <BoxHeader />
        <div className="flex flex-1">
          <BoxSidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse">Carregando...</div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <BoxHeader />
      <div className="flex flex-1">
        <BoxSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Assinatura do Cagio</h1>
                <p className="text-muted-foreground">Gerencie sua assinatura e plano</p>
              </div>
              <Button onClick={() => setViewPlansOpen(true)}>
                Ver Planos
              </Button>
            </div>

            {/* Current Plan */}
            {currentPlan && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Plano Atual</CardTitle>
                      <CardDescription>
                        {subscription?.isTrialActive
                          ? `${subscription.daysLeftInTrial} dias restantes de trial`
                          : subscription?.subscription_status === 'active'
                          ? 'Assinatura ativa'
                          : 'Assinatura expirada'}
                      </CardDescription>
                    </div>
                    <Badge variant={subscription?.isSubscriptionActive ? 'default' : 'destructive'}>
                      {currentPlan.name}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {subscription?.isTrialActive && (
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Trial Progress</span>
                        <span>{subscription.daysLeftInTrial} dias restantes</span>
                      </div>
                      <Progress value={(subscription.daysLeftInTrial / 14) * 100} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="font-semibold">Funcionalidades incluídas:</h4>
                    <ul className="space-y-1">
                      {currentPlan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warning for trial ending */}
            {subscription?.isTrialActive && subscription.daysLeftInTrial <= 7 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Seu trial termina em {subscription.daysLeftInTrial} dias. Escolha um plano para continuar usando o Cagio.
                </AlertDescription>
              </Alert>
            )}

            {/* Available Plans */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Planos Disponíveis</h2>
              
              <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as any)} className="mb-6">
                <TabsList>
                  <TabsTrigger value="monthly">Mensal</TabsTrigger>
                  <TabsTrigger value="yearly">Anual (economize 17%)</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="grid md:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
                  const isCurrent = currentPlan?.id === plan.id;

                  return (
                    <Card key={plan.id} className={isCurrent ? 'border-primary' : ''}>
                      <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="mt-4">
                          <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold">€{price}</span>
                            <span className="text-muted-foreground">
                              /{billingPeriod === 'monthly' ? 'mês' : 'ano'}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm">
                              <Check className="h-4 w-4 text-primary flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter>
                        {isCurrent ? (
                          <Button disabled className="w-full">
                            Plano Atual
                          </Button>
                        ) : price === 0 ? (
                          <Button variant="outline" className="w-full" disabled>
                            Plano Gratuito
                          </Button>
                        ) : (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                className="w-full"
                                onClick={() => setSelectedPlan(plan.id)}
                              >
                                Selecionar Plano
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Escolher Método de Pagamento</DialogTitle>
                                <DialogDescription>
                                  Plano {plan.name} - €{price} {billingPeriod === 'monthly' ? '/mês' : '/ano'}
                                </DialogDescription>
                              </DialogHeader>

                              {paymentResult ? (
                                <div className="space-y-4">
                                  <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                      Referência de pagamento gerada com sucesso!
                                    </AlertDescription>
                                  </Alert>

                                  {paymentResult.method === 'multibanco' && (
                                    <div className="space-y-2 p-4 bg-muted rounded-lg">
                                      <h4 className="font-semibold">Dados Multibanco:</h4>
                                      <div className="space-y-1 text-sm">
                                        <div className="flex justify-between">
                                          <span>Entidade:</span>
                                          <span className="font-mono font-bold">{paymentResult.reference.entity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Referência:</span>
                                          <span className="font-mono font-bold">{paymentResult.reference.reference}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Valor:</span>
                                          <span className="font-bold">€{paymentResult.reference.amount}</span>
                                        </div>
                                        <div className="flex justify-between text-muted-foreground">
                                          <span>Válido até:</span>
                                          <span>{new Date(paymentResult.reference.expires_at).toLocaleDateString()}</span>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {paymentResult.method === 'mbway' && (
                                    <div className="space-y-2 p-4 bg-muted rounded-lg">
                                      <h4 className="font-semibold">Pagamento MBWay:</h4>
                                      <p className="text-sm">{paymentResult.reference.message}</p>
                                      <p className="text-xs text-muted-foreground">
                                        Aguardando confirmação no seu telemóvel...
                                      </p>
                                    </div>
                                  )}

                                  <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => setPaymentResult(null)}
                                  >
                                    Fechar
                                  </Button>
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={(v) => setPaymentMethod(v as any)}
                                  >
                                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                                      <RadioGroupItem value="multibanco" id="multibanco" />
                                      <Label htmlFor="multibanco" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <CreditCard className="h-5 w-5" />
                                        <span>Multibanco</span>
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 p-4 border rounded-lg cursor-pointer hover:bg-accent">
                                      <RadioGroupItem value="mbway" id="mbway" />
                                      <Label htmlFor="mbway" className="flex items-center gap-2 cursor-pointer flex-1">
                                        <Smartphone className="h-5 w-5" />
                                        <span>MB WAY</span>
                                      </Label>
                                    </div>
                                  </RadioGroup>

                                  {paymentMethod === 'mbway' && (
                                    <div className="space-y-2">
                                      <Label htmlFor="phone">Número de telemóvel</Label>
                                      <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="912345678"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                      />
                                    </div>
                                  )}

                                  <Button
                                    className="w-full"
                                    onClick={() => handleSubscribe(plan.id)}
                                    disabled={isCreating || (paymentMethod === 'mbway' && !phoneNumber)}
                                  >
                                    {isCreating ? 'Processando...' : 'Confirmar Pagamento'}
                                  </Button>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        )}
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
      
      <ViewPlansModal 
        open={viewPlansOpen} 
        onOpenChange={setViewPlansOpen} 
      />
    </div>
  );
};

export default Subscription;
