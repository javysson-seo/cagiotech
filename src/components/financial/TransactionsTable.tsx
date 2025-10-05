import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FinancialTransaction } from '@/hooks/useFinancialTransactions';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { TrendingUp, TrendingDown, Link2, ExternalLink } from 'lucide-react';

interface TransactionsTableProps {
  transactions: FinancialTransaction[];
  title: string;
  description: string;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  title,
  description,
}) => {
  const getPaymentMethodLabel = (method?: string) => {
    const methods: Record<string, string> = {
      cash: 'Dinheiro',
      debit_card: 'Débito',
      credit_card: 'Crédito',
      bank_transfer: 'Transferência',
      mb_way: 'MB Way',
      multibanco: 'Multibanco',
      check: 'Cheque',
      other: 'Outro',
    };
    return method ? methods[method] || method : '-';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      completed: 'Concluído',
      pending: 'Pendente',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhuma transação encontrada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {description} - {transactions.length} transações
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {format(new Date(transaction.transaction_date), 'dd/MM/yyyy', {
                      locale: pt,
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        {transaction.reference_type && (
                          <div className="flex items-center gap-1 mt-1">
                            <Link2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Integração automática
                            </span>
                          </div>
                        )}
                        {transaction.notes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {transaction.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {getPaymentMethodLabel(transaction.payment_method)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(transaction.status)}>
                      {getStatusLabel(transaction.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {transaction.type === 'income' ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`font-bold ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}€
                        {transaction.amount.toLocaleString('pt-PT', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
