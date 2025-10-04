import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Ban } from 'lucide-react';
import { useAthleteSubscriptions } from '@/hooks/useAthleteSubscriptions';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ActiveSubscriptionsProps {
  companyId: string;
}

export const ActiveSubscriptions = ({ companyId }: ActiveSubscriptionsProps) => {
  const { subscriptions, cancelSubscription } = useAthleteSubscriptions(companyId);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'default',
      pending: 'secondary',
      cancelled: 'destructive',
      expired: 'outline',
      suspended: 'outline',
    };
    
    const labels = {
      active: 'Ativa',
      pending: 'Pendente',
      cancelled: 'Cancelada',
      expired: 'Expirada',
      suspended: 'Suspensa',
    };

    return (
      <Badge variant={variants[status as keyof typeof variants] as any}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleCancelConfirm = () => {
    if (cancellingId) {
      cancelSubscription({ id: cancellingId, reason: cancellationReason });
      setCancellingId(null);
      setCancellationReason('');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Assinaturas Ativas</h2>
        <p className="text-muted-foreground">
          Gerencie as assinaturas dos seus alunos
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              Nenhuma assinatura encontrada
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data Início</TableHead>
                  <TableHead>Próximo Pagamento</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription: any) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">
                      {subscription.athletes?.name}
                    </TableCell>
                    <TableCell>{subscription.subscription_plans?.name}</TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell>
                      {format(new Date(subscription.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      {subscription.next_billing_date
                        ? format(new Date(subscription.next_billing_date), 'dd/MM/yyyy', { locale: ptBR })
                        : '-'}
                    </TableCell>
                    <TableCell>
                      €{subscription.subscription_plans?.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {subscription.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCancellingId(subscription.id)}
                        >
                          <Ban className="h-4 w-4 mr-1" />
                          Cancelar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!cancellingId} onOpenChange={() => setCancellingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar Assinatura</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta assinatura? O aluno perderá acesso ao plano.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reason">Motivo do cancelamento (opcional)</Label>
            <Textarea
              id="reason"
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Informe o motivo do cancelamento..."
              rows={3}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCancellationReason('')}>
              Voltar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelConfirm}>
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
