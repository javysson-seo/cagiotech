import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';

export interface TransactionFilters {
  type?: 'income' | 'expense' | 'all';
  category?: string;
  paymentMethod?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

interface TransactionFiltersProps {
  filters: TransactionFilters;
  onFiltersChange: (filters: TransactionFilters) => void;
  categories: string[];
}

export const TransactionFiltersComponent: React.FC<TransactionFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
}) => {
  const handleClearFilters = () => {
    onFiltersChange({
      type: 'all',
      category: undefined,
      paymentMethod: undefined,
      status: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      search: undefined,
    });
  };

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.category ||
    filters.paymentMethod ||
    filters.status ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.search;

  const paymentMethods = [
    { value: 'cash', label: 'Dinheiro' },
    { value: 'debit_card', label: 'Cartão de Débito' },
    { value: 'credit_card', label: 'Cartão de Crédito' },
    { value: 'bank_transfer', label: 'Transferência Bancária' },
    { value: 'mb_way', label: 'MB Way' },
    { value: 'multibanco', label: 'Multibanco' },
    { value: 'check', label: 'Cheque' },
    { value: 'other', label: 'Outro' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            <CardDescription>Filtre as transações por diferentes critérios</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={filters.type || 'all'}
              onValueChange={(value) =>
                onFiltersChange({ ...filters, type: value as any })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Receitas</SelectItem>
                <SelectItem value="expense">Despesas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={filters.category || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  category: value === 'all' ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Método de Pagamento</Label>
            <Select
              value={filters.paymentMethod || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  paymentMethod: value === 'all' ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={filters.status || 'all'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  status: value === 'all' ? undefined : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Data Inicial</Label>
            <Input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) =>
                onFiltersChange({ ...filters, dateFrom: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Data Final</Label>
            <Input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) =>
                onFiltersChange({ ...filters, dateTo: e.target.value })
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Pesquisar</Label>
          <Input
            placeholder="Pesquisar por descrição, categoria, método..."
            value={filters.search || ''}
            onChange={(e) =>
              onFiltersChange({ ...filters, search: e.target.value })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
