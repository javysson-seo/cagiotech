import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CreditCard, Smartphone, Building2, ArrowLeftRight, Wallet } from 'lucide-react';
import { usePaymentMethods, PaymentMethodType } from '@/hooks/usePaymentMethods';

interface PaymentMethodsSettingsProps {
  companyId: string;
}

export const PaymentMethodsSettings = ({ companyId }: PaymentMethodsSettingsProps) => {
  const { methods, toggleMethod } = usePaymentMethods(companyId);

  const paymentMethodsConfig = [
    {
      type: 'credit_card' as PaymentMethodType,
      label: 'Cartão de Crédito/Débito',
      description: 'Aceitar pagamentos com cartão via Stripe',
      icon: CreditCard,
    },
    {
      type: 'mb_way' as PaymentMethodType,
      label: 'MB WAY',
      description: 'Pagamento via MB WAY (Portugal)',
      icon: Smartphone,
    },
    {
      type: 'multibanco' as PaymentMethodType,
      label: 'Multibanco',
      description: 'Referência Multibanco para pagamento',
      icon: Building2,
    },
    {
      type: 'bank_transfer' as PaymentMethodType,
      label: 'Transferência Bancária',
      description: 'Pagamento manual por transferência',
      icon: ArrowLeftRight,
    },
    {
      type: 'paypal' as PaymentMethodType,
      label: 'PayPal',
      description: 'Aceitar pagamentos via PayPal',
      icon: Wallet,
    },
  ];

  const isMethodEnabled = (type: PaymentMethodType) => {
    const method = methods.find(m => m.method_type === type);
    return method?.is_enabled || false;
  };

  const handleToggle = (type: PaymentMethodType, enabled: boolean) => {
    toggleMethod({ methodType: type, enabled });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Métodos de Pagamento</h2>
        <p className="text-muted-foreground">
          Configure quais métodos de pagamento estarão disponíveis para seus alunos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Métodos Disponíveis</CardTitle>
          <CardDescription>
            Ative ou desative métodos de pagamento para suas assinaturas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentMethodsConfig.map(({ type, label, description, icon: Icon }) => (
            <div key={type} className="flex items-start justify-between space-x-4 pb-6 border-b last:border-0 last:pb-0">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={type} className="text-base font-medium cursor-pointer">
                    {label}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {description}
                  </p>
                </div>
              </div>
              <Switch
                id={type}
                checked={isMethodEnabled(type)}
                onCheckedChange={(enabled) => handleToggle(type, enabled)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuração de Integração</CardTitle>
          <CardDescription>
            Para aceitar pagamentos online, conecte suas contas de gateway de pagamento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">
              <strong>Nota:</strong> A integração com Stripe e Vendus será configurada em breve.
              Por enquanto, você pode habilitar os métodos que pretende usar.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
