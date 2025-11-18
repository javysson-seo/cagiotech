import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useCagioSubscriptionPlans } from '@/hooks/useCagioSubscriptionPlans';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ViewPlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ViewPlansModal: React.FC<ViewPlansModalProps> = ({ open, onOpenChange }) => {
  const { plans, isLoading } = useCagioSubscriptionPlans();
  const [billingPeriod, setBillingPeriod] = React.useState<'monthly' | 'yearly'>('monthly');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Planos Disponíveis</DialogTitle>
          <DialogDescription>
            Escolha o plano ideal para o seu box
          </DialogDescription>
        </DialogHeader>

        <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')} className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList>
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="yearly">Anual</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={billingPeriod} className="mt-0">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Carregando planos...</p>
              </div>
            ) : plans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum plano disponível no momento.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Os planos serão configurados em breve.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plans.map((plan) => {
                  const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
                  const isPopular = plan.slug === 'pro';

                  return (
                    <Card key={plan.id} className={isPopular ? 'border-primary shadow-lg' : ''}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{plan.name}</CardTitle>
                          {isPopular && (
                            <Badge variant="default">Popular</Badge>
                          )}
                        </div>
                        <CardDescription>{plan.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex items-baseline">
                            <span className="text-4xl font-bold">€{price}</span>
                            <span className="text-muted-foreground ml-2">
                              /{billingPeriod === 'monthly' ? 'mês' : 'ano'}
                            </span>
                          </div>
                          {billingPeriod === 'yearly' && (
                            <p className="text-sm text-muted-foreground mt-1">
                              €{(price / 12).toFixed(2)}/mês
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          {plan.max_athletes && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-primary" />
                              <span className="text-sm">
                                {plan.max_athletes === -1 ? 'Atletas ilimitados' : `Até ${plan.max_athletes} atletas`}
                              </span>
                            </div>
                          )}
                          {plan.max_staff && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-primary" />
                              <span className="text-sm">
                                {plan.max_staff === -1 ? 'Staff ilimitado' : `Até ${plan.max_staff} staff`}
                              </span>
                            </div>
                          )}
                          {plan.max_classes_per_month && (
                            <div className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-primary" />
                              <span className="text-sm">
                                {plan.max_classes_per_month === -1 
                                  ? 'Aulas ilimitadas' 
                                  : `Até ${plan.max_classes_per_month} aulas/mês`}
                              </span>
                            </div>
                          )}
                          {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Check className="h-4 w-4 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant={isPopular ? 'default' : 'outline'}>
                          Escolher Plano
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
