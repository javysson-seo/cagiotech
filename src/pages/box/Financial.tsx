import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCompany } from '@/contexts/CompanyContext';
import { useFinancialMetrics } from '@/hooks/useFinancialMetrics';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FinancialMetricsCards } from '@/components/financial/FinancialMetricsCards';
import { RecentTransactionsList } from '@/components/financial/RecentTransactionsList';
import { RevenueExpenseChart } from '@/components/financial/RevenueExpenseChart';
import { ReceivablesList } from '@/components/financial/ReceivablesList';
import { ExpensesList } from '@/components/financial/ExpensesList';
import { TransactionForm } from '@/components/financial/TransactionForm';
import { TransactionFiltersComponent, TransactionFilters } from '@/components/financial/TransactionFilters';
import { TransactionsTable } from '@/components/financial/TransactionsTable';
import { SubscriptionPlansList } from '@/components/subscriptions/SubscriptionPlansList';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { toast } from 'sonner';

const FinancialContent: React.FC = () => {
  const { currentCompany } = useCompany();
  const queryClient = useQueryClient();
  const [incomeDialog, setIncomeDialog] = useState(false);
  const [expenseDialog, setExpenseDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TransactionFilters>({
    type: 'all',
  });

  const { data: metrics } = useFinancialMetrics(currentCompany?.id || '');
  const { transactions, isLoading: isLoadingTransactions, createTransaction } = useFinancialTransactions(currentCompany?.id || '');

  // Fetch athlete payments (receivables)
  const { data: payments = [] } = useQuery({
    queryKey: ['athlete-payments', currentCompany?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('athlete_payments')
        .select(`
          *,
          athlete:athletes(name)
        `)
        .eq('company_id', currentCompany?.id)
        .in('status', ['pending', 'overdue'])
        .order('due_date', { ascending: true });

      if (error) throw error;

      return data.map((payment: any) => ({
        ...payment,
        athlete: payment.athlete ? { name: payment.athlete.name } : undefined,
      }));
    },
    enabled: !!currentCompany?.id,
  });

  const markAsPaid = useMutation({
    mutationFn: async (paymentId: string) => {
      const { error } = await supabase
        .from('athlete_payments')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString().split('T')[0],
        })
        .eq('id', paymentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athlete-payments'] });
      queryClient.invalidateQueries({ queryKey: ['financial-metrics'] });
      toast.success('Pagamento confirmado', {
        description: 'O pagamento foi marcado como pago',
      });
    },
    onError: (error: Error) => {
      toast.error('Erro ao confirmar pagamento', {
        description: error.message,
      });
    },
  });

  const handleAddTransaction = (data: any) => {
    createTransaction(data);
    setIncomeDialog(false);
    setExpenseDialog(false);
  };

  // Apply filters
  const filteredTransactions = transactions.filter((t) => {
    if (filters.type && filters.type !== 'all' && t.type !== filters.type) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.paymentMethod && t.payment_method !== filters.paymentMethod) return false;
    if (filters.status && t.status !== filters.status) return false;
    if (filters.dateFrom && t.transaction_date < filters.dateFrom) return false;
    if (filters.dateTo && t.transaction_date > filters.dateTo) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        t.description.toLowerCase().includes(searchLower) ||
        t.category.toLowerCase().includes(searchLower) ||
        t.payment_method?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const incomeTransactions = filteredTransactions.filter(t => t.type === 'income');
  const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
  const categories = Array.from(new Set(transactions.map(t => t.category)));

  if (!metrics) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Carregando dados financeiros...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-full mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Financeiro</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gestão completa de receitas, despesas e recebíveis
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button size="sm" onClick={() => setIncomeDialog(true)}>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Nova Receita
                </Button>
                <Button size="sm" variant="destructive" onClick={() => setExpenseDialog(true)}>
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Nova Despesa
                </Button>
              </div>
            </div>

            <FinancialMetricsCards metrics={metrics} />

            {showFilters && (
              <TransactionFiltersComponent
                filters={filters}
                onFiltersChange={setFilters}
                categories={categories}
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RevenueExpenseChart transactions={transactions} />
              <RecentTransactionsList transactions={transactions} />
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="income">Receitas</TabsTrigger>
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
                <TabsTrigger value="receivables">Recebíveis</TabsTrigger>
                <TabsTrigger value="plans">Planos</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                <TransactionsTable
                  transactions={filteredTransactions}
                  title="Todas as Transações"
                  description="Histórico completo de receitas e despesas"
                />
              </TabsContent>

              <TabsContent value="income" className="space-y-4">
                <TransactionsTable
                  transactions={incomeTransactions}
                  title="Receitas"
                  description="Histórico de todas as receitas registradas"
                />
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                <TransactionsTable
                  transactions={expenseTransactions}
                  title="Despesas"
                  description="Histórico de todas as despesas registradas"
                />
              </TabsContent>

              <TabsContent value="receivables" className="space-y-4">
                <ReceivablesList 
                  payments={payments} 
                  onMarkAsPaid={(id) => markAsPaid.mutate(id)}
                />
              </TabsContent>

              <TabsContent value="plans" className="space-y-4">
                {currentCompany && <SubscriptionPlansList companyId={currentCompany.id} />}
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Transaction Forms */}
      <TransactionForm
        open={incomeDialog}
        onOpenChange={setIncomeDialog}
        onSubmit={handleAddTransaction}
        type="income"
      />

      <TransactionForm
        open={expenseDialog}
        onOpenChange={setExpenseDialog}
        onSubmit={handleAddTransaction}
        type="expense"
      />
    </div>
  );
};

export const Financial: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <FinancialContent />
    </AreaThemeProvider>
  );
};