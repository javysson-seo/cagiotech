
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CreditCard, 
  Plus, 
  Edit, 
  Trash2, 
  Shield,
  CheckCircle
} from 'lucide-react';

export const PaymentMethods: React.FC = () => {
  const [showAddCard, setShowAddCard] = useState(false);

  // Mock data - em produção virá da API/Supabase
  const paymentMethods = [
    {
      id: 1,
      type: 'credit_card',
      brand: 'Visa',
      lastFour: '1234',
      expiryMonth: '12',
      expiryYear: '26',
      isDefault: true,
      name: 'João Silva'
    },
    {
      id: 2,
      type: 'credit_card',
      brand: 'Mastercard',
      lastFour: '5678',
      expiryMonth: '08',
      expiryYear: '25',
      isDefault: false,
      name: 'João Silva'
    }
  ];

  const getCardIcon = (brand: string) => {
    // Em produção, usar ícones específicos de cada marca
    return <CreditCard className="h-6 w-6" />;
  };

  const handleAddCard = () => {
    setShowAddCard(true);
  };

  const handleDeleteCard = (cardId: number) => {
    console.log('Deleting card:', cardId);
    // Implementar lógica de remoção
  };

  const handleSetDefault = (cardId: number) => {
    console.log('Setting default card:', cardId);
    // Implementar lógica de cartão padrão
  };

  const handleEditCard = (cardId: number) => {
    console.log('Editing card:', cardId);
    // Implementar lógica de edição
  };

  if (showAddCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Adicionar Método de Pagamento
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cardName">Nome no Cartão</Label>
              <Input
                id="cardName"
                placeholder="João Silva"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryMonth">Mês</Label>
              <select
                id="expiryMonth"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Mês</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {String(i + 1).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expiryYear">Ano</Label>
              <select
                id="expiryYear"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="">Ano</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                maxLength={4}
                type="password"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-4 bg-muted/50 rounded-lg">
            <Shield className="h-5 w-5 text-green-600" />
            <div>
              <p className="font-medium text-sm">Segurança Garantida</p>
              <p className="text-xs text-muted-foreground">
                Seus dados são criptografados e protegidos por SSL
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={() => setShowAddCard(false)} variant="outline">
              Cancelar
            </Button>
            <Button>
              Adicionar Cartão
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Methods List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Métodos de Pagamento
            </CardTitle>
            <Button onClick={handleAddCard}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getCardIcon(method.brand)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">
                        {method.brand} •••• {method.lastFour}
                      </h4>
                      {method.isDefault && (
                        <Badge className="bg-blue-100 text-blue-800">Padrão</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {method.name} • Expira {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Tornar Padrão
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCard(method.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCard(method.id)}
                    disabled={method.isDefault}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Segurança dos Pagamentos
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Criptografia SSL</h4>
                <p className="text-sm text-muted-foreground">
                  Todos os dados são protegidos com criptografia de nível bancário
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">PCI Compliance</h4>
                <p className="text-sm text-muted-foreground">
                  Certificado pelos mais altos padrões de segurança
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Não Armazenamos CVV</h4>
                <p className="text-sm text-muted-foreground">
                  Códigos de segurança nunca são salvos nos nossos servidores
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm">Monitoramento 24/7</h4>
                <p className="text-sm text-muted-foreground">
                  Sistemas de detecção de fraude sempre ativos
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
