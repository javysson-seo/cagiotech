import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FinancialTransaction } from '@/hooks/useFinancialTransactions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ExpensesListProps {
  expenses: FinancialTransaction[];
  onAddExpense: () => void;
}

export const ExpensesList: React.FC<ExpensesListProps> = ({ expenses, onAddExpense }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Outros';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {} as Record<string, FinancialTransaction[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Controle de Despesas</CardTitle>
        <CardDescription>Registre e acompanhe todas as despesas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button onClick={onAddExpense} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Nova Despesa
          </Button>

          {expenses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma despesa registrada
            </p>
          ) : (
            <div className="space-y-2">
              {Object.entries(expensesByCategory).map(([category, categoryExpenses]) => (
                <div key={category} className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{category}</p>
                  {categoryExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1">
                        <span className="text-sm">{expense.description}</span>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(expense.transaction_date), 'dd/MM/yyyy', { locale: ptBR })}
                        </p>
                      </div>
                      <span className="font-medium">€{formatCurrency(Number(expense.amount))}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};