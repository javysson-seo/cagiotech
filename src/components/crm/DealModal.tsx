import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Euro, Save, Trash2, Users, Activity } from 'lucide-react';
import { useCRMStages } from '@/hooks/useCRMStages';
import { useCRMDeals } from '@/hooks/useCRMDeals';
import { useCRMActivities } from '@/hooks/useCRMActivities';
import { ActivityTimeline } from './ActivityTimeline';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: any;
  onSave?: () => void;
}

export const DealModal: React.FC<DealModalProps> = ({ 
  isOpen, 
  onClose, 
  deal,
  onSave 
}) => {
  const { stages } = useCRMStages();
  const { saveDeal, deleteDeal } = useCRMDeals();
  const { activities, saveActivity } = useCRMActivities(deal?.id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stage_id: '',
    value: '',
    probability: 50,
    expected_close_date: '',
    prospect_id: '',
  });

  const [newActivity, setNewActivity] = useState({
    title: '',
    description: '',
    activity_type: 'note' as const,
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        description: deal.description || '',
        stage_id: deal.stage_id || '',
        value: deal.value?.toString() || '',
        probability: deal.probability || 50,
        expected_close_date: deal.expected_close_date || '',
        prospect_id: deal.prospect_id || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        stage_id: stages[0]?.id || '',
        value: '',
        probability: 50,
        expected_close_date: '',
        prospect_id: '',
      });
    }
  }, [deal, stages]);

  const handleSave = async () => {
    const dealData = {
      ...formData,
      id: deal?.id,
      value: formData.value ? parseFloat(formData.value) : undefined,
    };

    const success = await saveDeal(dealData);
    if (success) {
      onSave?.();
      onClose();
    }
  };

  const handleDelete = async () => {
    if (deal?.id && confirm('Tem certeza que deseja excluir esta oportunidade?')) {
      const success = await deleteDeal(deal.id);
      if (success) {
        onSave?.();
        onClose();
      }
    }
  };

  const handleAddActivity = async () => {
    if (!deal?.id || !newActivity.title) return;

    const success = await saveActivity({
      deal_id: deal.id,
      ...newActivity,
      status: 'completed',
      completed_at: new Date().toISOString(),
    });

    if (success) {
      setNewActivity({ title: '', description: '', activity_type: 'note' });
    }
  };

  const currentStage = stages.find(s => s.id === formData.stage_id);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            {deal ? 'Editar Oportunidade' : 'Nova Oportunidade'}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalhes</TabsTrigger>
            <TabsTrigger value="activities" disabled={!deal}>
              Atividades {activities.length > 0 && `(${activities.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nome da oportunidade"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Estágio *</Label>
                <Select 
                  value={formData.stage_id} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, stage_id: value }))}
                >
                  <SelectTrigger className="z-50 bg-popover">
                    <SelectValue placeholder="Selecionar estágio" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: stage.color }}
                          />
                          {stage.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentStage && (
                  <p className="text-xs text-muted-foreground">
                    {currentStage.description}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detalhes sobre a oportunidade..."
                rows={4}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Valor (€)</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="probability">Probabilidade (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData(prev => ({ ...prev, probability: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected_close_date">Data Esperada</Label>
                <Input
                  id="expected_close_date"
                  type="date"
                  value={formData.expected_close_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, expected_close_date: e.target.value }))}
                />
              </div>
            </div>

            {deal && (
              <>
                <Separator />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Criada em: {format(new Date(deal.created_at), 'dd/MM/yyyy HH:mm', { locale: pt })}
                  </div>
                  {deal.prospect && (
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {deal.prospect.name}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-4 mt-4">
            <div className="space-y-4 p-4 bg-muted/20 rounded-lg">
              <h4 className="font-medium text-sm">Adicionar Atividade</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select 
                  value={newActivity.activity_type} 
                  onValueChange={(value: any) => setNewActivity(prev => ({ ...prev, activity_type: value }))}
                >
                  <SelectTrigger className="z-50 bg-popover">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-popover">
                    <SelectItem value="note">Nota</SelectItem>
                    <SelectItem value="call">Chamada</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="meeting">Reunião</SelectItem>
                    <SelectItem value="task">Tarefa</SelectItem>
                  </SelectContent>
                </Select>

                <div className="md:col-span-2">
                  <Input
                    placeholder="Título da atividade..."
                    value={newActivity.title}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
              </div>

              <Textarea
                placeholder="Descrição..."
                value={newActivity.description}
                onChange={(e) => setNewActivity(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />

              <Button 
                onClick={handleAddActivity}
                disabled={!newActivity.title}
                size="sm"
              >
                <Activity className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>

            <ActivityTimeline activities={activities} />
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <div className="flex justify-between">
          <div>
            {deal && (
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                size="sm"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={!formData.title || !formData.stage_id}>
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
