import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { NutritionalPlanModal } from './NutritionalPlanModal';

interface AthleteNutritionPlansProps {
  athleteId: string;
  athleteName: string;
}

export const AthleteNutritionPlans: React.FC<AthleteNutritionPlansProps> = ({
  athleteId,
  athleteName,
}) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<any>(null);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('nutritional_plans')
        .select('*')
        .eq('athlete_id', athleteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
      toast.error('Erro ao carregar planos nutricionais');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [athleteId]);

  const handleEdit = (plan: any) => {
    setSelectedPlan(plan);
    setShowPlanModal(true);
  };

  const handleNew = () => {
    setSelectedPlan(null);
    setShowPlanModal(true);
  };

  const handleDeleteClick = (plan: any) => {
    setPlanToDelete(plan);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;

    try {
      const { error } = await supabase
        .from('nutritional_plans')
        .delete()
        .eq('id', planToDelete.id);

      if (error) throw error;

      toast.success('Plano nutricional removido com sucesso!');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Erro ao remover plano nutricional');
    } finally {
      setDeleteDialogOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleModalClose = () => {
    setShowPlanModal(false);
    setSelectedPlan(null);
  };

  const handleSuccess = () => {
    fetchPlans();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">A carregar planos nutricionais...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Planos Nutricionais</h3>
          <Button onClick={handleNew} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        {plans.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">
                Nenhum plano nutricional criado ainda
              </p>
              <Button onClick={handleNew} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Plano
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(plan)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(plan)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {plan.plan_details?.calories_target && (
                      <Badge variant="outline">
                        Meta: {plan.plan_details.calories_target}
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      Criado em {new Date(plan.created_at).toLocaleDateString('pt-PT')}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <NutritionalPlanModal
        isOpen={showPlanModal}
        onClose={handleModalClose}
        athleteId={athleteId}
        athleteName={athleteName}
        existingPlan={selectedPlan}
        onSuccess={handleSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o plano nutricional "{planToDelete?.title}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
