import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';

interface ModalityFormProps {
  isOpen: boolean;
  onClose: () => void;
  modality?: any;
  onSave: (data: any) => void;
}

export const ModalityForm: React.FC<ModalityFormProps> = ({
  isOpen,
  onClose,
  modality,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#10b981',
    duration_minutes: 60,
    max_capacity: 20,
    requires_booking: true,
    is_active: true,
  });

  useEffect(() => {
    if (modality) {
      setFormData({
        name: modality.name || '',
        description: modality.description || '',
        color: modality.color || '#10b981',
        duration_minutes: modality.duration_minutes || 60,
        max_capacity: modality.max_capacity || 20,
        requires_booking: modality.requires_booking ?? true,
        is_active: modality.is_active ?? true,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        color: '#10b981',
        duration_minutes: 60,
        max_capacity: 20,
        requires_booking: true,
        is_active: true,
      });
    }
  }, [modality, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: modality?.id });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {modality ? 'Editar Modalidade' : 'Nova Modalidade'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Yoga, Pilates, Musculação"
                required
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da modalidade"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) }))}
                min="15"
                max="180"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacidade Máxima</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.max_capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, max_capacity: parseInt(e.target.value) }))}
                min="1"
                max="100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor</Label>
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="requires_booking">Requer Reserva</Label>
                <Switch
                  id="requires_booking"
                  checked={formData.requires_booking}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, requires_booking: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="is_active">Ativa</Label>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-cagio-green hover:bg-cagio-green-dark">
              {modality ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};