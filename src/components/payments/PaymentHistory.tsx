
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  History, 
  Search,
  Download, 
  Receipt,
  CreditCard,
  Calendar,
  Filter
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

export const PaymentHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - em produção virá da API/Supabase
  const paymentHistory = [
    {
      id: 1,
      date: '2024-01-15T10:30:00',
      amount: 89.99,
      method: 'Cartão de Crédito',
      lastFour: '1234',
      status: 'completed',
      description: 'Plano Unlimited - Janeiro 2024',
      invoiceUrl: '#'
    },
    {
      id: 2,
      date: '2023-12-15T09:15:00',
      amount: 89.99,
      method: 'Cartão de Crédito',
      lastFour: '1234',
      status: 'completed',
      description: 'Plano Unlimited - Dezembro 2023',
      invoiceUrl: '#'
    },
    {
      id: 3,
      date: '2023-11-15T14:20:00',
      amount: 59.99,
      method: 'MB Way',
      lastFour: null,
      status: 'completed',
      description: 'Plano Premium - Novembro 2023',
      invoiceUrl: '#'
    },
    {
      id: 4,
      date: '2023-10-15T11:45:00',
      amount: 59.99,
      method: 'Transferência Bancária',
      lastFour: null,
      status: 'pending',
      description: 'Plano Premium - Outubro 2023',
      invoiceUrl: null
    },
    {
      id: 5,
      date: '2023-09-15T16:10:00',
      amount: 39.99,
      method: 'Cartão de Crédito',
      lastFour: '1234',
      status: 'failed',
      description: 'Plano Basic - Setembro 2023',
      invoiceUrl: null
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>;
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-100 text-blue-800">Reembolsado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('Cartão')) return <CreditCard className="h-4 w-4" />;
    return <Receipt className="h-4 w-4" />;
  };

  const filteredHistory = paymentHistory.filter(payment => {
    const matchesSearch = 
      payment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.method.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleDownloadInvoice = (paymentId: number) => {
    console.log('Downloading invoice for payment:', paymentId);
    // Implementar download de fatura
  };

  const totalPaid = paymentHistory
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="h-5 w-5 mr-2" />
          Histórico de Pagamentos
        </CardTitle>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">€{totalPaid.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Pago</p>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {paymentHistory.filter(p => p.status === 'completed').length}
            </p>
            <p className="text-sm text-muted-foreground">Pagamentos</p>
          </div>
          
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {new Date().getFullYear() - 2023 + 1}
            </p>
            <p className="text-sm text-muted-foreground">Anos como Cliente</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Pesquisar pagamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="all">Todos os Status</option>
            <option value="completed">Pagos</option>
            <option value="pending">Pendentes</option>
            <option value="failed">Falharam</option>
            <option value="refunded">Reembolsados</option>
          </select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredHistory.map((payment) => (
            <div key={payment.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {getPaymentMethodIcon(payment.method)}
                  <div>
                    <h4 className="font-medium">{payment.description}</h4>
                    <p className="text-sm text-muted-foreground">
                      {payment.method}
                      {payment.lastFour && ` •••• ${payment.lastFour}`}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold">€{payment.amount.toFixed(2)}</p>
                  {getStatusBadge(payment.status)}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {format(parseISO(payment.date), 'dd/MM/yyyy HH:mm', { locale: pt })}
                  </span>
                </div>
                
                {payment.invoiceUrl && payment.status === 'completed' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadInvoice(payment.id)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Fatura
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum pagamento encontrado</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
