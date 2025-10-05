import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FinancialTransaction } from '@/hooks/useFinancialTransactions';

interface RecentTransactionsListProps {
  transactions: FinancialTransaction[];
}

export const RecentTransactionsList: React.FC<RecentTransactionsListProps> = ({ transactions }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhuma transação registrada
          </p>
        ) : (
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center space-x-4">
                <div 
                  className={`w-2 h-2 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{transaction.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(transaction.transaction_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </p>
                </div>
                <div 
                  className={`text-sm font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}€{formatCurrency(Number(transaction.amount))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};