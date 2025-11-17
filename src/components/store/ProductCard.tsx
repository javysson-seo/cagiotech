import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StoreProduct } from '@/hooks/useStoreProducts';
import { 
  Edit, 
  Trash2, 
  Package, 
  AlertTriangle,
  TrendingDown,
  ArrowUpDown
} from 'lucide-react';

interface ProductCardProps {
  product: StoreProduct;
  onEdit: (product: StoreProduct) => void;
  onDelete: (id: string) => void;
  onStockAdjust: (product: StoreProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
  onStockAdjust,
}) => {
  const isLowStock = product.stock_quantity <= (product.low_stock_threshold || 10);
  const stockStatus = product.stock_quantity === 0 ? 'out' : isLowStock ? 'low' : 'ok';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square relative bg-muted">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        
        {!product.is_active && (
          <Badge className="absolute top-2 right-2 bg-gray-500">
            Inativo
          </Badge>
        )}

        {stockStatus === 'out' && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            Sem Estoque
          </Badge>
        )}

        {stockStatus === 'low' && (
          <Badge className="absolute top-2 left-2 bg-orange-500">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Estoque Baixo
          </Badge>
        )}
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            {product.sku && (
              <Badge variant="outline" className="text-xs">
                {product.sku}
              </Badge>
            )}
          </div>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>

        {product.category && (
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-2xl font-bold" style={{ color: '#aeca12' }}>
              €{product.price.toFixed(2)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Estoque</p>
            <p className="text-lg font-semibold">
              {product.stock_quantity} un.
            </p>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStockAdjust(product)}
            className="flex-1"
          >
            <ArrowUpDown className="h-4 w-4 mr-1" />
            Ajustar
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(product.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
