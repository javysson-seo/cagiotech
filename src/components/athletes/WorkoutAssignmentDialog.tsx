import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus } from 'lucide-react';
import { useWorkoutPlans } from '@/hooks/useWorkoutPlans';
import { useWorkoutAssignments } from '@/hooks/useWorkoutAssignments';
import { useCompany } from '@/contexts/CompanyContext';
import { WorkoutPlanFormModal } from '@/components/workouts/WorkoutPlanFormModal';
import { cn } from '@/lib/utils';

interface WorkoutAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  athleteId: string;
  trainerId?: string;
}

export const WorkoutAssignmentDialog: React.FC<WorkoutAssignmentDialogProps> = ({
  open,
  onOpenChange,
  athleteId,
  trainerId,
}) => {
  const { currentCompany } = useCompany();
  const { workoutPlans, createWorkoutPlan } = useWorkoutPlans(currentCompany?.id || '');
  const { assignWorkoutPlan } = useWorkoutAssignments(currentCompany?.id || '');
  
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [notes, setNotes] = useState('');
  const [showCreatePlanModal, setShowCreatePlanModal] = useState(false);

  const handleSubmit = () => {
    if (!selectedPlanId || !currentCompany) return;

    assignWorkoutPlan.mutate({
      company_id: currentCompany.id,
      athlete_id: athleteId,
      workout_plan_id: selectedPlanId,
      assigned_by: trainerId,
      start_date: format(startDate, 'yyyy-MM-dd'),
      end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      status: 'active',
      notes,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setSelectedPlanId('');
        setNotes('');
        setEndDate(undefined);
      },
    });
  };

  const handleCreateAndAssignPlan = (planData: any) => {
    if (!currentCompany) return;

    // Criar plano com o atleta já vinculado
    createWorkoutPlan.mutate({
      ...planData,
      company_id: currentCompany.id,
      athlete_id: athleteId,
    }, {
      onSuccess: (newPlan) => {
        setShowCreatePlanModal(false);
        // Atribuir o plano recém-criado
        setSelectedPlanId(newPlan.id);
        
        // Auto-atribuir após criar
        assignWorkoutPlan.mutate({
          company_id: currentCompany.id,
          athlete_id: athleteId,
          workout_plan_id: newPlan.id,
          assigned_by: trainerId,
          start_date: format(startDate, 'yyyy-MM-dd'),
          end_date: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
          status: 'active',
          notes: notes || 'Plano criado e atribuído automaticamente',
        }, {
          onSuccess: () => {
            onOpenChange(false);
            setSelectedPlanId('');
            setNotes('');
            setEndDate(undefined);
          },
        });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Atribuir Plano de Treino</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Selecionar Plano de Treino</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreatePlanModal(true)}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar Novo Plano
              </Button>
            </div>
            <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um plano..." />
              </SelectTrigger>
              <SelectContent>
                {workoutPlans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name} {plan.difficulty && `(${plan.difficulty})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP", { locale: ptBR }) : "Selecione..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => date && setStartDate(date)}
                    locale={ptBR}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Data de Término (Opcional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP", { locale: ptBR }) : "Selecione..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    locale={ptBR}
                    disabled={(date) => date < startDate}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Adicione observações sobre este plano..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedPlanId}
            style={{ backgroundColor: '#aeca12' }}
            className="text-white"
          >
            Atribuir Plano
          </Button>
        </DialogFooter>
      </DialogContent>

      <WorkoutPlanFormModal
        open={showCreatePlanModal}
        onOpenChange={setShowCreatePlanModal}
        onSave={handleCreateAndAssignPlan}
      />
    </Dialog>
  );
};
