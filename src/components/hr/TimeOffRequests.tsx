import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStaffTimeOff } from '@/hooks/useStaffTimeOff';
import { useStaff } from '@/hooks/useStaff';
import { Plus, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { TimeOffRequestModal } from './TimeOffRequestModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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

export const TimeOffRequests: React.FC = () => {
  const { requests, loading, updateRequestStatus } = useStaffTimeOff();
  const { staff } = useStaff();
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  if (loading) return <Loading />;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: 'secondary', icon: Clock, label: 'Pendente' },
      approved: { variant: 'default', icon: CheckCircle, label: 'Aprovado' },
      rejected: { variant: 'destructive', icon: XCircle, label: 'Rejeitado' }
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      vacation: 'Férias',
      sick_leave: 'Licença Médica',
      personal: 'Pessoal',
      other: 'Outro'
    };
    return labels[type] || type;
  };

  const handleAction = (requestId: string, action: 'approve' | 'reject') => {
    setSelectedRequest(requestId);
    setActionType(action);
  };

  const confirmAction = async () => {
    if (!selectedRequest || !actionType) return;

    const status = actionType === 'approve' ? 'approved' : 'rejected';
    await updateRequestStatus(
      selectedRequest,
      status,
      actionType === 'reject' ? rejectionReason : undefined
    );

    setSelectedRequest(null);
    setActionType(null);
    setRejectionReason('');
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pedidos de Férias e Licenças</CardTitle>
          <Button onClick={() => setShowModal(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Pedido
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum pedido registrado
              </p>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium">{request.staff?.name || 'Colaborador'}</h4>
                      {getStatusBadge(request.status)}
                      <Badge variant="outline">{getTypeLabel(request.request_type)}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(request.start_date), 'dd MMM', { locale: ptBR })} - 
                        {format(new Date(request.end_date), 'dd MMM yyyy', { locale: ptBR })}
                      </div>
                      <span>({request.days_count} dias)</span>
                    </div>

                    {request.reason && (
                      <p className="text-sm text-muted-foreground">{request.reason}</p>
                    )}

                    {request.rejection_reason && (
                      <p className="text-sm text-destructive">
                        Motivo da rejeição: {request.rejection_reason}
                      </p>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleAction(request.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleAction(request.id, 'reject')}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Rejeitar
                      </Button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <TimeOffRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        staff={staff}
      />

      <AlertDialog open={!!selectedRequest} onOpenChange={() => {
        setSelectedRequest(null);
        setActionType(null);
        setRejectionReason('');
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Aprovar Pedido' : 'Rejeitar Pedido'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve' 
                ? 'Tem certeza que deseja aprovar este pedido de férias/licença?'
                : 'Tem certeza que deseja rejeitar este pedido? Por favor, informe o motivo.'
              }
            </AlertDialogDescription>
          </AlertDialogHeader>

          {actionType === 'reject' && (
            <div className="py-4">
              <Textarea
                placeholder="Motivo da rejeição..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
              />
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
