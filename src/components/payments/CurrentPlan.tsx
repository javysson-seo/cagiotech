
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  Star,
  CheckCircle,
  AlertCircle,
  ArrowUpRight
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { pt } from 'date-fns/locale';

export const CurrentPlan: React.FC = () => {
  // Mock data - em produção virá da API/Supabase
  const currentPlan = {
    name: 'Unlimited',
    type: 'monthly',
    price: 89.99,
    status: 'active',
    nextPayment: '2024-02-15',
    remainingClasses: null, // unlimited
    usedClasses: 12,
    totalClasses: null,
    startDate: '2024-01-15',
    features: [
      'Aulas ilimitadas',
      'Acesso a todas as modalidades',
      'Reservas com 48h de antecedência',
      'Cancelamento até 2h antes',
      'Acesso ao app móvel',
      'Suporte prioritário'
    ]
  };

  const availablePlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 39.99,
      classes: 8,
      description: '8 aulas por mês'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 59.99,
      classes: 16,
      description: '16 aulas por mês'
    },
    {
      id: 'unlimited',
      name: 'Unlimited',
      price: 89.99,
      classes: null,
      description: 'Aulas ilimitadas'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'suspended':
        return <Badge className="bg-orange-100 text-orange-800">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleUpgrade = () => {
    console.log('Upgrading plan...');
    // Implementar lógica de upgrade
  };

  const handleCancelPlan = () => {
    console.log('Cancelling plan...');
    // Implementar lógica de cancelamento
  };

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
            {getStatusBadge(currentPlan.status)}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Plan Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <h3 className="font-semibold text-lg">{currentPlan.name}</h3>
              <p className="text-2xl font-bold text-blue-600">€{currentPlan.price}</p>
              <p className="text-sm text-muted-foreground">por mês</p>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Calendar className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="font-medium">Próximo Pagamento</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(currentPlan.nextPayment), 'dd/MM/yyyy', { locale: pt })}
              </p>
            </div>
            
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="font-medium">
                {currentPlan.totalClasses ? 'Aulas Utilizadas' : 'Aulas este Mês'}
              </p>
              <p className="text-sm text-muted-foreground">
                {currentPlan.usedClasses}{currentPlan.totalClasses ? `/${currentPlan.totalClasses}` : ''}
              </p>
            </div>
          </div>

          {/* Usage Progress (só para planos limitados) */}
          {currentPlan.totalClasses && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progresso do Plano</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round((currentPlan.usedClasses / currentPlan.totalClasses) * 100)}%
                </span>
              </div>
              <Progress 
                value={(currentPlan.usedClasses / currentPlan.totalClasses) * 100} 
                className="h-2"
              />
            </div>
          )}

          {/* Plan Features */}
          <div>
            <h4 className="font-medium mb-3">Recursos Incluídos</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <Button variant="outline" onClick={handleCancelPlan}>
              Cancelar Plano
            </Button>
            <Button onClick={handleUpgrade}>
              <ArrowUpRight className="h-4 w-4 mr-2" />
              Alterar Plano
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Planos Disponíveis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Compare e altere para um plano que se adapte melhor às suas necessidades
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {availablePlans.map((plan) => (
              <div 
                key={plan.id}
                className={`p-4 border rounded-lg ${
                  plan.name.toLowerCase() === currentPlan.name.toLowerCase()
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-border hover:border-blue-200'
                }`}
              >
                <div className="text-center mb-4">
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold text-blue-600">€{plan.price}</p>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                
                {plan.name.toLowerCase() === currentPlan.name.toLowerCase() ? (
                  <Badge className="w-full justify-center">Plano Atual</Badge>
                ) : (
                  <Button variant="outline" className="w-full" size="sm">
                    Selecionar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Warning */}
      {currentPlan.status === 'active' && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="flex items-center space-x-3 p-4">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Próximo Pagamento</p>
              <p className="text-sm text-muted-foreground">
                Seu próximo pagamento de €{currentPlan.price} será processado em{' '}
                {format(new Date(currentPlan.nextPayment), 'dd/MM/yyyy', { locale: pt })}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
