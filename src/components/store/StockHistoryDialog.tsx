import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useStockMovements } from '@/hooks/useStockMovements';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUp, ArrowDown, RefreshCw, ShoppingCart, Undo } from 'lucide-react';
import { StoreProduct } from '@/hooks/useStoreProducts';

interface StockHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: StoreProduct | null;
}

export const StockHistoryDialog: React.FC<StockHistoryDialogProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { movements, isLoading } = useStockMovements(product?.id);

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'entrada':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'saida':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      case 'ajuste':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      case 'venda':
        return <ShoppingCart className="h-4 w-4 text-purple-600" />;
      case 'devolucao':
        return <Undo className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getMovementLabel = (type: string) => {
    const labels: Record<string, string> = {
      entrada: 'Entrada',
      saida: 'Saída',
      ajuste: 'Ajuste',
      venda: 'Venda',
      devolucao: 'Devolução',
    };
    return labels[type] || type;
  };

  const getMovementColor = (type: string) => {
    const colors: Record<string, string> = {
      entrada: 'bg-green-100 text-green-800',
      saida: 'bg-red-100 text-red-800',
      ajuste: 'bg-blue-100 text-blue-800',
      venda: 'bg-purple-100 text-purple-800',
      devolucao: 'bg-orange-100 text-orange-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico de Movimentações - {product?.name}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Carregando histórico...</p>
          </div>
        ) : movements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground">Nenhuma movimentação registrada</p>
          </div>
        ) : (
          <div className="space-y-4">
            {movements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-muted">
                  {getMovementIcon(movement.movement_type)}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge className={getMovementColor(movement.movement_type)}>
                        {getMovementLabel(movement.movement_type)}
                      </Badge>
                      {movement.performed_by_name && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Por: {movement.performed_by_name}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {movement.movement_type === 'entrada' ? '+' : '-'}
                        {movement.quantity} un.
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(movement.created_at), "dd MMM yyyy 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      {movement.previous_stock} un.
                    </span>
                    <span>→</span>
                    <span className="font-medium">
                      {movement.new_stock} un.
                    </span>
                  </div>

                  {movement.reason && (
                    <p className="text-sm text-muted-foreground">
                      {movement.reason}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
