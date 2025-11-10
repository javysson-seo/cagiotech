import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap } from 'lucide-react';
import { usePublicSubscriptionPlans } from '@/hooks/usePublicSubscriptionPlans';
import { Loading } from '@/components/ui/loading';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PricingPlansProps {
  onSelectPlan: (planSlug: string, billingCycle: 'monthly' | 'yearly') => void;
  selectedPlan?: string;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onSelectPlan, selectedPlan }) => {
  const { plans, loading } = usePublicSubscriptionPlans();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" text="Carregando planos..." />
      </div>
    );
  }

  const getPrice = (plan: any) => {
    return billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
  };

  const getMonthlyPrice = (plan: any) => {
    if (billingCycle === 'monthly') return plan.price_monthly;
    return (plan.price_yearly / 12).toFixed(2);
  };

  return (
    <div className="space-y-8">
      {/* Billing Cycle Toggle */}
      <div className="flex flex-col items-center gap-4">
        <Tabs value={billingCycle} onValueChange={(v) => setBillingCycle(v as 'monthly' | 'yearly')}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
            <TabsTrigger value="yearly">
              Anual
              <Badge className="ml-2 bg-green-500 text-white text-xs">-17%</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {billingCycle === 'yearly' && (
          <p className="text-sm text-muted-foreground">
            💰 Economize até 2 meses pagando anualmente!
          </p>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {plans.map((plan, index) => {
          const isPopular = index === 1; // Professional is popular
          const isPremium = index === 2;
          const isSelected = selectedPlan === plan.slug;

          return (
            <Card 
              key={plan.id}
              className={`relative transition-all hover:shadow-xl ${
                isSelected 
                  ? 'border-2 border-cagio-green shadow-lg' 
                  : isPremium 
                  ? 'border-2 border-purple-500' 
                  : isPopular 
                  ? 'border-2 border-blue-500 shadow-lg scale-105' 
                  : 'border'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    Mais Popular
                  </Badge>
                </div>
              )}
              {isPremium && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-purple-500 text-white px-4 py-1 flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    Premium
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="mt-2">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">€{getMonthlyPrice(plan)}</span>
                  <span className="text-muted-foreground">/mês</span>
                  {billingCycle === 'yearly' && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Cobrado €{getPrice(plan)} anualmente
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {plan.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    isPremium 
                      ? 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800' 
                      : isPopular 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : ''
                  }`}
                  size="lg"
                  onClick={() => onSelectPlan(plan.slug, billingCycle)}
                  variant={isSelected ? 'default' : 'outline'}
                >
                  {isSelected ? '✓ Plano Selecionado' : 'Escolher Plano'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Trial Notice */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100 px-6 py-3 rounded-full">
          <Check className="h-5 w-5" />
          <span className="font-medium">14 dias de teste grátis • Sem cartão de crédito • Cancele quando quiser</span>
        </div>
      </div>
    </div>
  );
};
