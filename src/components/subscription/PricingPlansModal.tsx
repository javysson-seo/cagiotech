import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { useCagioSubscriptionPlans } from '@/hooks/useCagioSubscriptionPlans';
import { useCagioSubscriptionPayments } from '@/hooks/useCagioSubscriptionPayments';
import { useCompany } from '@/contexts/CompanyContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PricingPlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PricingPlansModal: React.FC<PricingPlansModalProps> = ({ open, onOpenChange }) => {
  const { plans, isLoading } = useCagioSubscriptionPlans();
  const { createPayment, isCreating } = useCagioSubscriptionPayments();
  const { currentCompany } = useCompany();
  const { toast } = useToast();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (!currentCompany?.id) {
      toast({
        title: 'Erro',
        description: 'Company não encontrada',
        variant: 'destructive',
      });
      return;
    }

    setSelectedPlanId(planId);
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;

    const amount = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;

    try {
      await createPayment({
        company_id: currentCompany.id,
        plan_id: plan.id,
        billing_period: billingPeriod,
        amount,
        payment_method: 'multibanco',
      });
      
      toast({
        title: 'Sucesso',
        description: 'Referência de pagamento gerada. Verifique seu email.',
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao processar pagamento',
        variant: 'destructive',
      });
    } finally {
      setSelectedPlanId(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Escolha seu Plano</DialogTitle>
          <DialogDescription>
            Selecione o plano ideal para o seu box
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <Tabs value={billingPeriod} onValueChange={(v) => setBillingPeriod(v as 'monthly' | 'yearly')}>
              <TabsList>
                <TabsTrigger value="monthly">Mensal</TabsTrigger>
                <TabsTrigger value="yearly">
                  Anual
                  <Badge variant="secondary" className="ml-2">-20%</Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const price = billingPeriod === 'monthly' ? plan.price_monthly : plan.price_yearly;
                const isProcessing = isCreating && selectedPlanId === plan.id;

                return (
                  <Card key={plan.id} className="relative flex flex-col">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">€{price}</span>
                        <span className="text-muted-foreground">
                          /{billingPeriod === 'monthly' ? 'mês' : 'ano'}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-3">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleSelectPlan(plan.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Processando...
                          </>
                        ) : (
                          'Selecionar Plano'
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
