import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, isPast } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CheckCircle } from 'lucide-react';

interface Payment {
  id: string;
  athlete_id: string;
  amount: number;
  due_date: string;
  status: string;
  plan_name?: string;
  athlete?: {
    name: string;
  };
}

interface ReceivablesListProps {
  payments: Payment[];
  onMarkAsPaid?: (paymentId: string) => void;
}

export const ReceivablesList: React.FC<ReceivablesListProps> = ({ payments, onMarkAsPaid }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getPaymentStatus = (payment: Payment) => {
    if (payment.status === 'paid') return 'paid';
    if (isPast(new Date(payment.due_date))) return 'overdue';
    return 'pending';
  };

  const statusConfig = {
    paid: { label: 'Pago', variant: 'default' as const },
    overdue: { label: 'Vencido', variant: 'destructive' as const },
    pending: { label: 'Pendente', variant: 'secondary' as const },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contas a Receber</CardTitle>
        <CardDescription>Gerencie mensalidades e pagamentos pendentes</CardDescription>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum pagamento pendente
          </p>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => {
              const status = getPaymentStatus(payment);
              const config = statusConfig[status];

              return (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">
                      {payment.athlete?.name || 'Atleta'} - {payment.plan_name || 'Mensalidade'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Vencimento: {format(new Date(payment.due_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">€{formatCurrency(Number(payment.amount))}</p>
                      <Badge variant={config.variant}>{config.label}</Badge>
                    </div>
                    {status !== 'paid' && onMarkAsPaid && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onMarkAsPaid(payment.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};