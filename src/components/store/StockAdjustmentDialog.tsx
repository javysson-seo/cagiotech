import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StoreProduct } from '@/hooks/useStoreProducts';
import { useStockMovements } from '@/hooks/useStockMovements';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Plus, Minus } from 'lucide-react';

interface StockAdjustmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: StoreProduct | null;
  onSuccess: () => void;
}

export const StockAdjustmentDialog: React.FC<StockAdjustmentDialogProps> = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}) => {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const { createMovement } = useStockMovements(product?.id);
  
  const [movementType, setMovementType] = useState<'entrada' | 'saida' | 'ajuste'>('entrada');
  const [quantity, setQuantity] = useState<number>(0);
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCompany || quantity <= 0) return;

    setIsLoading(true);
    try {
      const newStock = movementType === 'entrada' 
        ? product.stock_quantity + quantity
        : movementType === 'saida'
        ? Math.max(0, product.stock_quantity - quantity)
        : quantity;

      await createMovement.mutateAsync({
        company_id: currentCompany.id,
        product_id: product.id,
        movement_type: movementType,
        quantity: movementType === 'ajuste' ? Math.abs(quantity - product.stock_quantity) : quantity,
        previous_stock: product.stock_quantity,
        new_stock: newStock,
        reason: reason || undefined,
        performed_by: user?.id,
        performed_by_name: user?.name,
      });

      // Update product stock
      const { supabase } = await import('@/integrations/supabase/client');
      await supabase
        .from('store_products')
        .update({ stock_quantity: newStock })
        .eq('id', product.id);

      onSuccess();
      onClose();
      setQuantity(0);
      setReason('');
    } catch (error) {
      console.error('Error adjusting stock:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const previewNewStock = () => {
    if (movementType === 'entrada') {
      return product.stock_quantity + quantity;
    } else if (movementType === 'saida') {
      return Math.max(0, product.stock_quantity - quantity);
    } else {
      return quantity;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajustar Estoque - {product.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Estoque Atual</p>
            <p className="text-2xl font-bold">{product.stock_quantity} un.</p>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Movimentação</Label>
            <Select value={movementType} onValueChange={(value: any) => setMovementType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entrada">
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 mr-2 text-green-600" />
                    Entrada (Adicionar)
                  </div>
                </SelectItem>
                <SelectItem value="saida">
                  <div className="flex items-center">
                    <Minus className="h-4 w-4 mr-2 text-red-600" />
                    Saída (Remover)
                  </div>
                </SelectItem>
                <SelectItem value="ajuste">
                  <div className="flex items-center">
                    Ajuste Manual
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">
              {movementType === 'ajuste' ? 'Nova Quantidade' : 'Quantidade'}
            </Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo (opcional)</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Descreva o motivo da movimentação"
              rows={3}
            />
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Novo Estoque</p>
            <p className="text-2xl font-bold" style={{ color: '#aeca12' }}>
              {previewNewStock()} un.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading || quantity <= 0}
              style={{ backgroundColor: '#aeca12' }}
              className="text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                'Confirmar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
