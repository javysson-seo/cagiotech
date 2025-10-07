import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Package, ShoppingCart, Euro, TrendingUp } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { useStoreProducts } from '@/hooks/useStoreProducts';

export const Store: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const { products, isLoading } = useStoreProducts(currentCompany?.id || '');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalValue = products.reduce((acc, p) => acc + (p.price * p.stock_quantity), 0);
  const totalStock = products.reduce((acc, p) => acc + p.stock_quantity, 0);
  const activeProducts = products.filter(p => p.is_active).length;

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
              <Button style={{ backgroundColor: '#aeca12' }} className="text-white">
                <Plus className="mr-2 h-4 w-4" />
                Novo Produto
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(174, 202, 18, 0.1)' }}>
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
                  <div className="p-3 rounded-lg bg-purple-50">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ativos</p>
                    <p className="text-2xl font-bold">{activeProducts}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum produto cadastrado</p>
                  <Button className="mt-4" style={{ backgroundColor: '#aeca12' }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Produto
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="p-6 hover:shadow-lg transition-shadow">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-lg">{product.name}</h3>
                          <Badge variant={product.is_active ? 'default' : 'secondary'}>
                            {product.is_active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>

                        {product.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                        )}

                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Preço</p>
                            <p className="text-xl font-bold" style={{ color: '#aeca12' }}>
                              €{product.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Estoque</p>
                            <p className="text-xl font-bold">{product.stock_quantity}</p>
                          </div>
                        </div>

                        {product.category && (
                          <Badge variant="outline">{product.category}</Badge>
                        )}

                        <div className="flex gap-2">
                          <Button variant="outline" className="flex-1">Editar</Button>
                          <Button variant="outline" className="flex-1">Vender</Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Store;