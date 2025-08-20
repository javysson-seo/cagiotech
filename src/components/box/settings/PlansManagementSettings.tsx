
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Euro,
  Calendar,
  Save,
  X
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface Plan {
  id: number;
  name: string;
  price: number;
  durationMonths: number;
  features: string[];
  isActive: boolean;
}

export const PlansManagementSettings: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 1,
      name: 'Básico',
      price: 50,
      durationMonths: 1,
      features: ['Acesso ao ginásio', 'Vestiários'],
      isActive: true
    },
    {
      id: 2,
      name: 'Premium',
      price: 80,
      durationMonths: 12,
      features: ['Acesso ao ginásio', 'Vestiários', 'Aulas de grupo', 'Personal Trainer'],
      isActive: true
    },
    {
      id: 3,
      name: 'VIP',
      price: 120,
      durationMonths: 6,
      features: ['Acesso completo', 'Personal Trainer exclusivo', 'Plano nutricional', 'Acesso prioritário'],
      isActive: true
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    durationMonths: '',
    features: [''],
    isActive: true
  });

  const handleAddPlan = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      price: '',
      durationMonths: '',
      features: [''],
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      durationMonths: plan.durationMonths.toString(),
      features: plan.features,
      isActive: plan.isActive
    });
    setShowModal(true);
  };

  const handleDeletePlan = (planId: number) => {
    setPlans(prev => prev.filter(p => p.id !== planId));
    toast.success('Plano excluído com sucesso');
  };

  const handleSavePlan = () => {
    if (!formData.name || !formData.price || !formData.durationMonths) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const planData = {
      name: formData.name,
      price: parseFloat(formData.price),
      durationMonths: parseInt(formData.durationMonths),
      features: formData.features.filter(f => f.trim() !== ''),
      isActive: formData.isActive
    };

    if (editingPlan) {
      setPlans(prev => prev.map(p => 
        p.id === editingPlan.id ? { ...p, ...planData } : p
      ));
      toast.success('Plano atualizado com sucesso');
    } else {
      const newPlan = {
        ...planData,
        id: Date.now()
      };
      setPlans(prev => [...prev, newPlan]);
      toast.success('Plano criado com sucesso');
    }

    setShowModal(false);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f, i) => i === index ? value : f)
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const togglePlanStatus = (planId: number) => {
    setPlans(prev => prev.map(p => 
      p.id === planId ? { ...p, isActive: !p.isActive } : p
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Gestão de Planos</h3>
          <p className="text-sm text-muted-foreground">
            Configure os planos disponíveis para os atletas
          </p>
        </div>
        <Button onClick={handleAddPlan} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <Card key={plan.id} className={!plan.isActive ? 'opacity-60' : ''}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{plan.name}</CardTitle>
                <div className="flex items-center space-x-1">
                  <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                    {plan.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1">
                  <Euro className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">{plan.price}</span>
                </div>
                <div className="flex items-center justify-center space-x-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{plan.durationMonths} {plan.durationMonths === 1 ? 'mês' : 'meses'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Recursos:</Label>
                <ul className="space-y-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center space-x-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditPlan(plan)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Editar
                </Button>
                
                <Button
                  variant={plan.isActive ? "secondary" : "default"}
                  size="sm"
                  onClick={() => togglePlanStatus(plan.id)}
                >
                  {plan.isActive ? 'Desativar' : 'Ativar'}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir o plano <strong>{plan.name}</strong>?
                        Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeletePlan(plan.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de Criação/Edição */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingPlan ? 'Editar Plano' : 'Novo Plano'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Plano</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Premium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Preço (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="80"
                />
              </div>
              <div>
                <Label htmlFor="duration">Duração (meses)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.durationMonths}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationMonths: e.target.value }))}
                  placeholder="12"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Recursos</Label>
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Recurso do plano"
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSavePlan} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                {editingPlan ? 'Atualizar' : 'Criar'} Plano
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
