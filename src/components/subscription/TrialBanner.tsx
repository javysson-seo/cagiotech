import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Clock, CreditCard, AlertTriangle } from 'lucide-react';
import { useCompanySubscription } from '@/hooks/useCompanySubscription';
import { useNavigate } from 'react-router-dom';

export const TrialBanner: React.FC = () => {
  const { subscription } = useCompanySubscription();
  const navigate = useNavigate();

  if (!subscription || subscription.subscription_status !== 'trial') {
    return null;
  }

  const daysLeft = subscription.daysLeftInTrial || 0;
  const isExpiringSoon = daysLeft <= 3;
  const isExpired = daysLeft <= 0;

  if (isExpired) {
    return (
      <Alert variant="destructive" className="border-red-500">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span className="font-semibold">
            Seu período de teste expirou. Ative uma assinatura para continuar usando o sistema.
          </span>
          <Button 
            variant="outline" 
            size="sm"
            className="ml-4 bg-white text-red-600 hover:bg-red-50"
            onClick={() => navigate('settings')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Assinar Agora
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isExpiringSoon) {
    return (
      <Alert variant="destructive" className="border-orange-500 bg-orange-50 dark:bg-orange-950">
        <Clock className="h-4 w-4 text-orange-600" />
        <AlertDescription className="flex items-center justify-between">
          <span className="font-semibold text-orange-900 dark:text-orange-100">
            ⚠️ Seu teste gratuito termina em {daysLeft} {daysLeft === 1 ? 'dia' : 'dias'}!
          </span>
          <Button 
            variant="outline" 
            size="sm"
            className="ml-4 bg-white text-orange-600 hover:bg-orange-50"
            onClick={() => navigate('settings')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Escolher Plano
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-blue-500 bg-blue-50 dark:bg-blue-950">
      <Clock className="h-4 w-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between">
        <span className="font-semibold text-blue-900 dark:text-blue-100">
          🎉 Teste grátis ativo! Você tem {daysLeft} dias restantes para explorar todos os recursos.
        </span>
        <Button 
          variant="outline" 
          size="sm"
          className="ml-4 bg-white text-blue-600 hover:bg-blue-50"
          onClick={() => navigate('settings')}
        >
          Ver Planos
        </Button>
      </AlertDescription>
    </Alert>
  );
};
