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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FinancialContent: React.FC = () => {
  const { currentCompany } = useCompany();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expenseDialog, setExpenseDialog] = useState(false);

  const { data: metrics } = useFinancialMetrics(currentCompany?.id || '');
  const { transactions } = useFinancialTransactions(currentCompany?.id || '');

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
      toast({
        title: 'Pagamento confirmado',
        description: 'O pagamento foi marcado como pago',
      });
    },
  });

  const handleAddExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from('financial_transactions')
        .insert({
          company_id: currentCompany?.id,
          type: 'expense',
          category: formData.get('category') as string,
          amount: Number(formData.get('amount')),
          transaction_date: formData.get('date') as string,
          description: formData.get('description') as string,
          payment_method: formData.get('payment_method') as string,
          status: 'completed',
        });

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['financial-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['financial-metrics'] });
      toast({
        title: 'Despesa registrada',
        description: 'A despesa foi registrada com sucesso',
      });
      setExpenseDialog(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao registrar despesa',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const expenses = transactions.filter(t => t.type === 'expense');

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
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Financeiro</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Acompanhamento financeiro e gestão de receitas
              </p>
            </div>

            <FinancialMetricsCards metrics={metrics} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <RevenueExpenseChart transactions={transactions} />
              <RecentTransactionsList transactions={transactions} />
            </div>

            <Tabs defaultValue="receivables" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="receivables">Recebíveis</TabsTrigger>
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
              </TabsList>

              <TabsContent value="receivables" className="space-y-4">
                <ReceivablesList 
                  payments={payments} 
                  onMarkAsPaid={(id) => markAsPaid.mutate(id)}
                />
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                <ExpensesList 
                  expenses={expenses}
                  onAddExpense={() => setExpenseDialog(true)}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={expenseDialog} onOpenChange={setExpenseDialog}>
        <DialogContent>
          <form onSubmit={handleAddExpense}>
            <DialogHeader>
              <DialogTitle>Nova Despesa</DialogTitle>
              <DialogDescription>Registre uma nova despesa da empresa</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" name="description" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (€)</Label>
                  <Input id="amount" name="amount" type="number" step="0.01" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select name="category" required>
                  <SelectTrigger className="bg-popover z-50">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="rent">Aluguel</SelectItem>
                    <SelectItem value="utilities">Utilidades</SelectItem>
                    <SelectItem value="equipment">Equipamentos</SelectItem>
                    <SelectItem value="salaries">Salários</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="other">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="payment_method">Método de Pagamento</Label>
                <Select name="payment_method">
                  <SelectTrigger className="bg-popover z-50">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="cash">Dinheiro</SelectItem>
                    <SelectItem value="bank_transfer">Transferência</SelectItem>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Despesa
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
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