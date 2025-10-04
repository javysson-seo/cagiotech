import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { X, Plus } from 'lucide-react';

interface SubscriptionPlanFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (plan: any) => void;
  companyId: string;
  initialData?: any;
}

export const SubscriptionPlanForm = ({
  open,
  onClose,
  onSubmit,
  companyId,
  initialData,
}: SubscriptionPlanFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [billingPeriod, setBillingPeriod] = useState<string>(initialData?.billing_period || 'monthly');
  const [maxClassesPerWeek, setMaxClassesPerWeek] = useState(initialData?.max_classes_per_week?.toString() || '');
  const [isActive, setIsActive] = useState(initialData?.is_active ?? true);
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [newFeature, setNewFeature] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      ...(initialData?.id && { id: initialData.id }),
      company_id: companyId,
      name,
      description: description || null,
      price: parseFloat(price),
      billing_period: billingPeriod,
      max_classes_per_week: maxClassesPerWeek ? parseInt(maxClassesPerWeek) : null,
      is_active: isActive,
      features,
    });

    onClose();
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFeatures([...features, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Plano' : 'Novo Plano de Assinatura'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome do Plano *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Plano Mensal Básico"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que está incluído neste plano"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Preço (€) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <Label htmlFor="billing_period">Período de Cobrança *</Label>
              <Select value={billingPeriod} onValueChange={setBillingPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="max_classes">Máximo de Aulas por Semana</Label>
            <Input
              id="max_classes"
              type="number"
              min="0"
              value={maxClassesPerWeek}
              onChange={(e) => setMaxClassesPerWeek(e.target.value)}
              placeholder="Deixe vazio para ilimitado"
            />
          </div>

          <div>
            <Label>Funcionalidades Incluídas</Label>
            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input value={feature} disabled className="flex-1" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFeature(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Adicionar funcionalidade"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addFeature();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="icon" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="is_active">Plano Ativo</Label>
            <Switch
              id="is_active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {initialData ? 'Atualizar' : 'Criar'} Plano
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
