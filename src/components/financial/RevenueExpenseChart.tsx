import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FinancialTransaction } from '@/hooks/useFinancialTransactions';
import { format, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RevenueExpenseChartProps {
  transactions: FinancialTransaction[];
}

export const RevenueExpenseChart: React.FC<RevenueExpenseChartProps> = ({ transactions }) => {
  const chartData = useMemo(() => {
    const now = new Date();
    const last6Months = eachMonthOfInterval({
      start: subMonths(now, 5),
      end: now,
    });

    return last6Months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.transaction_date);
        return transactionDate >= monthStart && transactionDate <= monthEnd;
      });

      const revenue = monthTransactions
        .filter((t) => t.type === 'income' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = monthTransactions
        .filter((t) => t.type === 'expense' && t.status === 'completed')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      return {
        month: format(month, 'MMM', { locale: ptBR }),
        receitas: revenue,
        despesas: expenses,
      };
    });
  }, [transactions]);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Receitas e Despesas (Últimos 6 Meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => `€${value.toLocaleString('pt-PT', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
            />
            <Legend />
            <Bar dataKey="receitas" fill="hsl(var(--primary))" name="Receitas" />
            <Bar dataKey="despesas" fill="hsl(var(--destructive))" name="Despesas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};