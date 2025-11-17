import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useCurrentAthlete } from '@/hooks/useCurrentAthlete';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AthleteSubscription {
  id: string;
  plan_id: string;
  status: string;
  start_date: string;
  end_date: string | null;
  next_billing_date: string | null;
  auto_renew: boolean;
  subscription_plans: {
    name: string;
    price: number;
    description: string | null;
    billing_period: string;
    max_classes_per_week: number | null;
  };
}

export const CurrentPlanReal: React.FC = () => {
  const { athlete } = useCurrentAthlete();
  const [subscription, setSubscription] = useState<AthleteSubscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (athlete?.id) {
      fetchSubscription();
    }
  }, [athlete?.id]);

  const fetchSubscription = async () => {
    if (!athlete?.id) return;

    try {
      const { data, error } = await supabase
        .from('athlete_subscriptions')
        .select(`
          *,
          subscription_plans (
            name,
            price,
            description,
            billing_period,
            max_classes_per_week
          )
        `)
        .eq('athlete_id', athlete.id)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'suspended':
        return <Badge className="bg-orange-100 text-orange-800">Suspenso</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Plano Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Você ainda não possui um plano ativo. Entre em contato com a academia para ativar seu plano.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const plan = subscription.subscription_plans;

  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Plano Atual
            </CardTitle>
            {getStatusBadge(subscription.status)}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Plan Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p className="text-2xl font-bold text-blue-600">€{plan.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                {plan.billing_period === 'monthly' ? 'por mês' : 
                 plan.billing_period === 'quarterly' ? 'por trimestre' : 
                 'por ano'}
              </p>
            </div>
            
            {subscription.next_billing_date && (
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="font-medium">Próximo Pagamento</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.next_billing_date), 'dd/MM/yyyy', { locale: pt })}
                </p>
              </div>
            )}
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="font-medium">Aulas</p>
              <p className="text-sm text-muted-foreground">
                {plan.max_classes_per_week ? `${plan.max_classes_per_week} por semana` : 'Ilimitadas'}
              </p>
            </div>
          </div>

          {/* Plan Description */}
          {plan.description && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </div>
          )}

          {/* Plan Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Data de Início</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(subscription.start_date), 'dd/MM/yyyy', { locale: pt })}
                </p>
              </div>
            </div>

            {subscription.end_date && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <p className="font-medium">Data de Término</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(subscription.end_date), 'dd/MM/yyyy', { locale: pt })}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Renovação Automática</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.auto_renew ? 'Ativada' : 'Desativada'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button variant="outline" className="flex-1">
              Gerenciar Plano
            </Button>
            <Button variant="outline" className="flex-1">
              Histórico de Pagamentos
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
