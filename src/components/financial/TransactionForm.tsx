import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FinancialTransaction } from '@/hooks/useFinancialTransactions';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  category: z.string().min(2, 'Categoria é obrigatória').max(100),
  amount: z.number().min(0.01, 'Valor deve ser maior que 0').max(1000000),
  transaction_date: z.string().min(1, 'Data é obrigatória'),
  description: z.string().min(2, 'Descrição é obrigatória').max(500),
  payment_method: z.string().optional(),
  notes: z.string().max(1000).optional(),
  status: z.enum(['completed', 'pending', 'cancelled']),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<FinancialTransaction, 'id' | 'created_at' | 'company_id'>) => void;
  type: 'income' | 'expense';
  isLoading?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  type,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type,
      status: 'completed',
      transaction_date: new Date().toISOString().split('T')[0],
    },
  });

  const category = watch('category');
  const paymentMethod = watch('payment_method');
  const status = watch('status');

  React.useEffect(() => {
    setValue('type', type);
  }, [type, setValue]);

  const handleFormSubmit = (data: TransactionFormData) => {
    onSubmit(data as any);
    reset({
      type,
      status: 'completed',
      transaction_date: new Date().toISOString().split('T')[0],
    });
  };

  const incomeCategories = [
    'Mensalidade',
    'Matrícula',
    'Personal Training',
    'Aulas Extras',
    'Eventos',
    'Produtos',
    'Outros',
  ];

  const expenseCategories = [
    'Aluguel',
    'Utilidades',
    'Salários',
    'Equipamentos',
    'Manutenção',
    'Marketing',
    'Seguros',
    'Impostos',
    'Material de Limpeza',
    'Outros',
  ];

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === 'income' ? 'Nova Receita' : 'Nova Despesa'}
          </DialogTitle>
          <DialogDescription>
            {type === 'income'
              ? 'Registre uma nova receita ou recebível'
              : 'Registre uma nova despesa da empresa'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              {...register('description')}
              placeholder={
                type === 'income'
                  ? 'Ex: Mensalidade - João Silva'
                  : 'Ex: Pagamento de aluguel'
              }
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (€) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register('amount', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_date">Data *</Label>
              <Input id="transaction_date" type="date" {...register('transaction_date')} />
              {errors.transaction_date && (
                <p className="text-sm text-destructive">
                  {errors.transaction_date.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={category} onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecionar categoria" />
              </SelectTrigger>
              <SelectContent>
                {(type === 'income' ? incomeCategories : expenseCategories).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Método de Pagamento</Label>
            <Select
              value={paymentMethod}
              onValueChange={(value) => setValue('payment_method', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecionar método" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Estado</Label>
            <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas / Observações</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Informações adicionais..."
              rows={3}
            />
            {errors.notes && (
              <p className="text-sm text-destructive">{errors.notes.message}</p>
            )}
          </div>

          <div className="bg-muted/50 p-3 rounded-lg text-sm text-muted-foreground">
            <p className="font-medium mb-1">💡 Integração Automática</p>
            <p>
              Transações de mensalidades, matrículas e pagamentos de atletas serão registradas
              automaticamente quando processadas no sistema.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'A guardar...' : 'Registrar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
