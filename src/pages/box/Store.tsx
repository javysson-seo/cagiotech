import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Package, ShoppingCart, Euro, TrendingUp, AlertTriangle, History } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { useStoreProducts, StoreProduct } from '@/hooks/useStoreProducts';
import { ProductFormModal } from '@/components/store/ProductFormModal';
import { ProductCard } from '@/components/store/ProductCard';
import { StockAdjustmentDialog } from '@/components/store/StockAdjustmentDialog';
import { StockHistoryDialog } from '@/components/store/StockHistoryDialog';
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

export const Store: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const { products, isLoading, createProduct, updateProduct, deleteProduct } = useStoreProducts(
    currentCompany?.id || ''
  );

  const categories = ['all', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0);
  const totalStock = products.reduce((acc, p) => acc + p.stock_quantity, 0);
  const activeProducts = products.filter((p) => p.is_active).length;
  const lowStockProducts = products.filter(
    (p) => p.stock_quantity <= (p.low_stock_threshold || 10) && p.stock_quantity > 0
  ).length;
  const outOfStockProducts = products.filter((p) => p.stock_quantity === 0).length;

  const handleSubmit = async (data: Partial<StoreProduct>) => {
    if (!currentCompany) return;

    const productData = {
      ...data,
      company_id: currentCompany.id,
    };

    if (selectedProduct) {
      await updateProduct.mutateAsync({ id: selectedProduct.id, ...productData });
    } else {
      await createProduct.mutateAsync(productData as any);
    }

    setIsFormOpen(false);
    setSelectedProduct(null);
  };

  const handleEdit = (product: StoreProduct) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct.mutateAsync(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleStockAdjust = (product: StoreProduct) => {
    setSelectedProduct(product);
    setIsStockDialogOpen(true);
  };

  const handleViewHistory = (product: StoreProduct) => {
    setSelectedProduct(product);
    setIsHistoryDialogOpen(true);
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen flex w-full">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col">
        <BoxHeader />
        
        <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Loja</h1>
                <p className="text-muted-foreground">Gerencie produtos e estoque</p>
              </div>
              <Button
                style={{ backgroundColor: '#aeca12' }}
                className="text-white"
                onClick={handleNewProduct}
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: 'rgba(174, 202, 18, 0.1)' }}
                  >
                    <Package className="h-6 w-6" style={{ color: '#aeca12' }} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Produtos</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estoque Total</p>
                    <p className="text-2xl font-bold">{totalStock}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-50">
                    <Euro className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-2xl font-bold">€{totalValue.toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-orange-50">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estoque Baixo</p>
                    <p className="text-2xl font-bold">{lowStockProducts}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-red-50">
                    <Package className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sem Estoque</p>
                    <p className="text-2xl font-bold">{outOfStockProducts}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Buscar produtos por nome, descrição ou SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? 'default' : 'outline'}
                      onClick={() => setCategoryFilter(category)}
                      style={
                        categoryFilter === category
                          ? { backgroundColor: '#aeca12', color: 'white' }
                          : undefined
                      }
                    >
                      {category === 'all' ? 'Todos' : category}
                    </Button>
                  ))}
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Carregando produtos...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Package className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || categoryFilter !== 'all'
                      ? 'Tente ajustar sua busca ou filtros'
                      : 'Comece adicionando seu primeiro produto'}
                  </p>
                  {!searchTerm && categoryFilter === 'all' && (
                    <Button
                      style={{ backgroundColor: '#aeca12' }}
                      className="text-white"
                      onClick={handleNewProduct}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Produto
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onStockAdjust={handleStockAdjust}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>

        <Footer />
      </div>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmit}
        product={selectedProduct || undefined}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />

      <StockAdjustmentDialog
        isOpen={isStockDialogOpen}
        onClose={() => {
          setIsStockDialogOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSuccess={() => {
          setIsStockDialogOpen(false);
          setSelectedProduct(null);
        }}
      />

      <StockHistoryDialog
        isOpen={isHistoryDialogOpen}
        onClose={() => {
          setIsHistoryDialogOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita e
              todo o histórico de movimentações será perdido.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Store;