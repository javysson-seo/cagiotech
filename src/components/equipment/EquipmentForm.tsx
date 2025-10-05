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
import { Equipment } from '@/hooks/useEquipment';

const equipmentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(200),
  description: z.string().max(1000).optional(),
  category: z.string().optional(),
  quantity: z.number().min(0).max(9999),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  location: z.string().max(200).optional(),
  serial_number: z.string().max(100).optional(),
  purchase_date: z.string().optional(),
  purchase_price: z.number().min(0).max(1000000).optional(),
  supplier: z.string().max(200).optional(),
  maintenance_date: z.string().optional(),
  next_maintenance: z.string().optional(),
  warranty_expiry: z.string().optional(),
  status: z.enum(['active', 'maintenance', 'retired']),
});

type EquipmentFormData = z.infer<typeof equipmentSchema>;

interface EquipmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<Equipment>) => void;
  equipment?: Equipment;
  isLoading?: boolean;
}

export const EquipmentForm: React.FC<EquipmentFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  equipment,
  isLoading,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<EquipmentFormData>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      quantity: 1,
      condition: 'good' as const,
      status: 'active' as const,
    },
  });

  const condition = watch('condition');
  const status = watch('status');

  React.useEffect(() => {
    if (equipment) {
      reset({
        name: equipment.name,
        description: equipment.description,
        category: equipment.category,
        quantity: equipment.quantity,
        condition: equipment.condition,
        location: equipment.location,
        serial_number: equipment.serial_number,
        purchase_date: equipment.purchase_date,
        purchase_price: equipment.purchase_price,
        supplier: equipment.supplier,
        maintenance_date: equipment.maintenance_date,
        next_maintenance: equipment.next_maintenance,
        warranty_expiry: equipment.warranty_expiry,
        status: equipment.status,
      });
    } else {
      reset({
        quantity: 1,
        condition: 'good' as const,
        status: 'active' as const,
      });
    }
  }, [equipment, reset]);

  const handleFormSubmit = (data: EquipmentFormData) => {
    onSubmit(data);
    if (!equipment) {
      reset();
    }
  };

  const categories = [
    'Pesos Livres',
    'Cardio',
    'Funcional',
    'Ginástica',
    'Mobilidade',
    'Acessórios',
    'Máquinas',
    'Outro',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {equipment ? 'Editar Equipamento' : 'Novo Equipamento'}
          </DialogTitle>
          <DialogDescription>
            {equipment
              ? 'Atualize as informações do equipamento'
              : 'Adicione um novo equipamento ao inventário'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Kettlebell 16kg"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Detalhes sobre o equipamento..."
                rows={2}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={watch('category')}
                onValueChange={(value) => setValue('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quantity">Quantidade *</Label>
              <Input
                id="quantity"
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                min="0"
              />
              {errors.quantity && (
                <p className="text-sm text-destructive mt-1">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="condition">Condição *</Label>
              <Select
                value={condition}
                onValueChange={(value) =>
                  setValue('condition', value as EquipmentFormData['condition'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excelente</SelectItem>
                  <SelectItem value="good">Boa</SelectItem>
                  <SelectItem value="fair">Razoável</SelectItem>
                  <SelectItem value="poor">Má</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setValue('status', value as EquipmentFormData['status'])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="maintenance">Em Manutenção</SelectItem>
                  <SelectItem value="retired">Retirado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Ex: Área de Musculação"
              />
            </div>

            <div>
              <Label htmlFor="serial_number">Número de Série</Label>
              <Input
                id="serial_number"
                {...register('serial_number')}
                placeholder="Ex: SN123456"
              />
            </div>

            <div>
              <Label htmlFor="supplier">Fornecedor</Label>
              <Input
                id="supplier"
                {...register('supplier')}
                placeholder="Nome do fornecedor"
              />
            </div>

            <div>
              <Label htmlFor="purchase_date">Data de Compra</Label>
              <Input id="purchase_date" type="date" {...register('purchase_date')} />
            </div>

            <div>
              <Label htmlFor="purchase_price">Preço de Compra (€)</Label>
              <Input
                id="purchase_price"
                type="number"
                step="0.01"
                {...register('purchase_price', { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="maintenance_date">Última Manutenção</Label>
              <Input
                id="maintenance_date"
                type="date"
                {...register('maintenance_date')}
              />
            </div>

            <div>
              <Label htmlFor="next_maintenance">Próxima Manutenção</Label>
              <Input
                id="next_maintenance"
                type="date"
                {...register('next_maintenance')}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="warranty_expiry">Expiração da Garantia</Label>
              <Input
                id="warranty_expiry"
                type="date"
                {...register('warranty_expiry')}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'A guardar...' : equipment ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
