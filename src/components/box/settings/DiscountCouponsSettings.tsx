import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Percent, Euro, Trash2, Calendar } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { useDiscountCoupons } from '@/hooks/useDiscountCoupons';
import { toast } from 'sonner';

export const DiscountCouponsSettings = () => {
  const { currentCompany } = useCompany();
  const { coupons, createCoupon, deleteCoupon, isLoading } = useDiscountCoupons(currentCompany?.id);
  
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    expires_at: '',
  });

  const handleCreateCoupon = () => {
    if (!currentCompany) return;
    if (!newCoupon.code || newCoupon.discount_value <= 0) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    createCoupon({
      company_id: currentCompany.id,
      code: newCoupon.code.toUpperCase(),
      discount_type: newCoupon.discount_type,
      discount_value: newCoupon.discount_value,
      discount_percentage: newCoupon.discount_type === 'percentage' ? newCoupon.discount_value : 0,
      is_active: true,
      expires_at: newCoupon.expires_at || null,
    } as any);

    setNewCoupon({ code: '', discount_type: 'percentage', discount_value: 0, expires_at: '' });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Percent className="h-5 w-5 text-cagio-green" />
            Cupons de Desconto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulário de novo cupom */}
          <div className="p-4 border border-border rounded-lg space-y-4">
            <h3 className="font-medium">Criar Novo Cupom</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="coupon-code">Código do Cupom *</Label>
                <Input
                  id="coupon-code"
                  placeholder="EX: WELCOME10"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                />
              </div>
              
              <div>
                <Label htmlFor="discount-type">Tipo de Desconto *</Label>
                <Select 
                  value={newCoupon.discount_type}
                  onValueChange={(value: 'percentage' | 'fixed') => 
                    setNewCoupon(prev => ({ ...prev, discount_type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">
                      <div className="flex items-center gap-2">
                        <Percent className="h-4 w-4" />
                        Porcentagem
                      </div>
                    </SelectItem>
                    <SelectItem value="fixed">
                      <div className="flex items-center gap-2">
                        <Euro className="h-4 w-4" />
                        Valor Fixo
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="discount">
                  {newCoupon.discount_type === 'percentage' ? 'Desconto (%) *' : 'Desconto (€) *'}
                </Label>
                <Input
                  id="discount"
                  type="number"
                  min="1"
                  max={newCoupon.discount_type === 'percentage' ? '100' : undefined}
                  step={newCoupon.discount_type === 'fixed' ? '0.01' : '1'}
                  placeholder={newCoupon.discount_type === 'percentage' ? '10' : '5.00'}
                  value={newCoupon.discount_value || ''}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, discount_value: Number(e.target.value) }))}
                />
              </div>
              
              <div>
                <Label htmlFor="expires">Data de Expiração (opcional)</Label>
                <Input
                  id="expires"
                  type="date"
                  value={newCoupon.expires_at}
                  onChange={(e) => setNewCoupon(prev => ({ ...prev, expires_at: e.target.value }))}
                />
              </div>
            </div>
            
            <Button onClick={handleCreateCoupon} className="bg-cagio-green hover:bg-cagio-green-dark">
              <Plus className="h-4 w-4 mr-2" />
              Criar Cupom
            </Button>
          </div>

          {/* Lista de cupons */}
          <div className="space-y-3">
            <h3 className="font-medium">Cupons Ativos</h3>
            
            {isLoading ? (
              <p className="text-muted-foreground">Carregando cupons...</p>
            ) : coupons.length === 0 ? (
              <p className="text-muted-foreground">Nenhum cupom criado ainda.</p>
            ) : (
              <div className="space-y-2">
                {coupons.map((coupon) => (
                  <div
                    key={coupon.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-cagio-green text-white font-mono text-sm px-3 py-1">
                          {coupon.code}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {(coupon as any).discount_type === 'percentage' ? (
                            <>
                              <Percent className="h-3 w-3" />
                              {(coupon as any).discount_value || coupon.discount_percentage}% OFF
                            </>
                          ) : (
                            <>
                              <Euro className="h-3 w-3" />
                              €{(coupon as any).discount_value} OFF
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      {coupon.expires_at && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Expira: {new Date(coupon.expires_at).toLocaleDateString()}
                        </div>
                      )}
                      
                      {!coupon.is_active && (
                        <Badge variant="destructive">Inativo</Badge>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCoupon(coupon.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};