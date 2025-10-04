import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import { useSubscriptionPlans, SubscriptionPlan } from '@/hooks/useSubscriptionPlans';
import { SubscriptionPlanForm } from './SubscriptionPlanForm';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SubscriptionPlansListProps {
  companyId: string;
}

export const SubscriptionPlansList = ({ companyId }: SubscriptionPlansListProps) => {
  const { plans, createPlan, updatePlan, deletePlan } = useSubscriptionPlans(companyId);
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setFormOpen(true);
  };

  const handleDelete = () => {
    if (deletingPlanId) {
      deletePlan(deletingPlanId);
      setDeletingPlanId(null);
    }
  };

  const handleFormSubmit = (data: any) => {
    if (editingPlan) {
      updatePlan(data);
    } else {
      createPlan(data);
    }
    setEditingPlan(null);
  };

  const getBillingPeriodLabel = (period: string) => {
    const labels = {
      monthly: 'Mensal',
      quarterly: 'Trimestral',
      yearly: 'Anual',
    };
    return labels[period as keyof typeof labels] || period;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Planos de Assinatura</h2>
          <p className="text-muted-foreground">
            Crie e gerencie os planos disponíveis para seus alunos
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="mt-1">
                    {plan.description}
                  </CardDescription>
                </div>
                <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                  {plan.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold">
                    €{plan.price.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {getBillingPeriodLabel(plan.billing_period)}
                  </div>
                </div>

                {plan.max_classes_per_week && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Máximo: </span>
                    <span className="font-medium">
                      {plan.max_classes_per_week} aulas/semana
                    </span>
                  </div>
                )}

                {plan.features.length > 0 && (
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEdit(plan)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingPlanId(plan.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">
              Nenhum plano criado ainda
            </p>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Plano
            </Button>
          </CardContent>
        </Card>
      )}

      <SubscriptionPlanForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={handleFormSubmit}
        companyId={companyId}
        initialData={editingPlan}
      />

      <AlertDialog open={!!deletingPlanId} onOpenChange={() => setDeletingPlanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este plano? Esta ação não pode ser desfeita.
              Assinaturas ativas vinculadas a este plano não serão afetadas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
