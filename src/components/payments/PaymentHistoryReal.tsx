import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  History, 
  Search,
  Calendar,
} from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { useCurrentAthlete } from '@/hooks/useCurrentAthlete';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface AthletePayment {
  id: string;
  amount: number;
  due_date: string;
  paid_date: string | null;
  status: string;
  plan_name: string | null;
  payment_method: string | null;
  installment_number: number | null;
  total_installments: number | null;
}

export const PaymentHistoryReal: React.FC = () => {
  const { athlete } = useCurrentAthlete();
  const [payments, setPayments] = useState<AthletePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (athlete?.id) {
      fetchPayments();
    }
  }, [athlete?.id]);

  const fetchPayments = async () => {
    if (!athlete?.id) return;

    try {
      const { data, error } = await supabase
        .from('athlete_payments')
        .select('*')
        .eq('athlete_id', athlete.id)
        .order('due_date', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Atrasado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      (payment.plan_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (payment.payment_method?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

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
            <p className="text-2xl font-bold text-orange-600">€{totalPending.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">Total Pendente</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
            <p className="text-sm text-muted-foreground">Total de Pagamentos</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pagamentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-md bg-background"
          >
            <option value="all">Todos os Status</option>
            <option value="paid">Pagos</option>
            <option value="pending">Pendentes</option>
            <option value="overdue">Atrasados</option>
          </select>
        </div>

        {/* Payments List */}
        {filteredPayments.length === 0 ? (
          <div className="text-center py-12">
            <History className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Nenhum pagamento encontrado com os filtros aplicados' 
                : 'Você ainda não possui histórico de pagamentos'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">
                      {payment.plan_name || 'Pagamento'}
                      {payment.installment_number && payment.total_installments && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({payment.installment_number}/{payment.total_installments})
                        </span>
                      )}
                    </h4>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Vencimento: {format(new Date(payment.due_date), 'dd/MM/yyyy', { locale: pt })}
                      </span>
                    </div>
                    {payment.paid_date && (
                      <span>
                        Pago em: {format(new Date(payment.paid_date), 'dd/MM/yyyy', { locale: pt })}
                      </span>
                    )}
                    {payment.payment_method && (
                      <span>{payment.payment_method}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 sm:mt-0">
                  <div className="text-right">
                    <p className="text-lg font-bold">€{payment.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
