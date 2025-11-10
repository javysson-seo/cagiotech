import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Save } from 'lucide-react';
import { useStaffPaymentConfig, type StaffPaymentConfig } from '@/hooks/useStaffPaymentConfig';

interface PayrollConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any;
}

export const PayrollConfigModal: React.FC<PayrollConfigModalProps> = ({
  isOpen,
  onClose,
  staff
}) => {
  const { getConfigByStaffId, saveConfig } = useStaffPaymentConfig();
  const [config, setConfig] = useState<Partial<StaffPaymentConfig>>({
    payment_type: 'monthly_salary',
    base_amount: 0,
    hourly_rate: 0,
    per_class_rate: 0,
    commission_percentage: 0,
    payment_day: 25,
    payment_frequency: 'monthly',
    iban: '',
    notes: ''
  });

  useEffect(() => {
    if (staff?.id) {
      const existingConfig = getConfigByStaffId(staff.id);
      if (existingConfig) {
        setConfig(existingConfig);
      } else {
        setConfig({
          staff_id: staff.id,
          payment_type: 'monthly_salary',
          base_amount: 0,
          hourly_rate: 0,
          per_class_rate: 0,
          commission_percentage: 0,
          payment_day: 25,
          payment_frequency: 'monthly',
          iban: '',
          notes: ''
        });
      }
    }
  }, [staff, getConfigByStaffId]);

  const handleSave = async () => {
    if (!staff?.id) return;
    await saveConfig({ ...config, staff_id: staff.id } as StaffPaymentConfig);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Configurar Pagamento - {staff?.name || 'Funcionário'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tipo de Pagamento *</Label>
              <Select 
                value={config.payment_type}
                onValueChange={(value) => setConfig({ ...config, payment_type: value as StaffPaymentConfig['payment_type'] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly_salary">Salário Mensal</SelectItem>
                  <SelectItem value="hourly">Por Hora</SelectItem>
                  <SelectItem value="per_class">Por Aula</SelectItem>
                  <SelectItem value="commission">Comissão</SelectItem>
                  <SelectItem value="mixed">Misto</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Frequência de Pagamento</Label>
              <Select 
                value={config.payment_frequency}
                onValueChange={(value) => setConfig({ ...config, payment_frequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="bi-weekly">Quinzenal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {config.payment_type === 'monthly_salary' && (
            <div>
              <Label>Salário Base (€) *</Label>
              <Input
                type="number"
                step="0.01"
                value={config.base_amount}
                onChange={(e) => setConfig({ ...config, base_amount: parseFloat(e.target.value) })}
              />
            </div>
          )}

          {config.payment_type === 'hourly' && (
            <div>
              <Label>Valor por Hora (€) *</Label>
              <Input
                type="number"
                step="0.01"
                value={config.hourly_rate}
                onChange={(e) => setConfig({ ...config, hourly_rate: parseFloat(e.target.value) })}
              />
            </div>
          )}

          {config.payment_type === 'per_class' && (
            <div>
              <Label>Valor por Aula (€) *</Label>
              <Input
                type="number"
                step="0.01"
                value={config.per_class_rate}
                onChange={(e) => setConfig({ ...config, per_class_rate: parseFloat(e.target.value) })}
              />
            </div>
          )}

          {config.payment_type === 'commission' && (
            <div>
              <Label>Percentual de Comissão (%) *</Label>
              <Input
                type="number"
                step="0.01"
                max="100"
                value={config.commission_percentage}
                onChange={(e) => setConfig({ ...config, commission_percentage: parseFloat(e.target.value) })}
              />
            </div>
          )}

          {config.payment_type === 'mixed' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Salário Base (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={config.base_amount}
                  onChange={(e) => setConfig({ ...config, base_amount: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <Label>Valor por Aula (€)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={config.per_class_rate}
                  onChange={(e) => setConfig({ ...config, per_class_rate: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Dia de Pagamento</Label>
              <Input
                type="number"
                min="1"
                max="31"
                value={config.payment_day}
                onChange={(e) => setConfig({ ...config, payment_day: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <Label>IBAN</Label>
              <Input
                placeholder="PT50..."
                value={config.iban}
                onChange={(e) => setConfig({ ...config, iban: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label>Observações</Label>
            <Textarea
              placeholder="Informações adicionais sobre o pagamento"
              value={config.notes}
              onChange={(e) => setConfig({ ...config, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Salvar Configuração
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
