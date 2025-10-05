import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Activity, Ruler, Weight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface PhysicalAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: any;
  onSuccess: () => void;
}

export const PhysicalAssessmentModal = ({ isOpen, onClose, athlete, onSuccess }: PhysicalAssessmentModalProps) => {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [assessment, setAssessment] = useState({
    assessment_date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    body_fat_percentage: '',
    muscle_mass: '',
    chest: '',
    waist: '',
    hip: '',
    arm_right: '',
    arm_left: '',
    thigh_right: '',
    thigh_left: '',
    notes: ''
  });

  const handleSave = async () => {
    if (!currentCompany || !user) return;

    setLoading(true);

    try {
      const measurements = {
        chest: assessment.chest ? Number(assessment.chest) : null,
        waist: assessment.waist ? Number(assessment.waist) : null,
        hip: assessment.hip ? Number(assessment.hip) : null,
        arm_right: assessment.arm_right ? Number(assessment.arm_right) : null,
        arm_left: assessment.arm_left ? Number(assessment.arm_left) : null,
        thigh_right: assessment.thigh_right ? Number(assessment.thigh_right) : null,
        thigh_left: assessment.thigh_left ? Number(assessment.thigh_left) : null,
      };

      const { error } = await supabase
        .from('physical_assessments')
        .insert({
          athlete_id: athlete.id,
          company_id: currentCompany.id,
          assessed_by: user.id,
          assessment_date: assessment.assessment_date,
          weight: assessment.weight ? Number(assessment.weight) : null,
          height: assessment.height ? Number(assessment.height) : null,
          body_fat_percentage: assessment.body_fat_percentage ? Number(assessment.body_fat_percentage) : null,
          muscle_mass: assessment.muscle_mass ? Number(assessment.muscle_mass) : null,
          measurements,
          notes: assessment.notes || null
        });

      if (error) throw error;

      toast.success('Avaliação física registrada com sucesso!');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Erro ao registrar avaliação');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-cagio-green" />
            Avaliação Física - {athlete?.name}
          </DialogTitle>
          <DialogDescription>
            Registar medidas e composição corporal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Data da Avaliação */}
          <div>
            <Label htmlFor="date">Data da Avaliação</Label>
            <Input
              id="date"
              type="date"
              value={assessment.assessment_date}
              onChange={(e) => setAssessment({ ...assessment, assessment_date: e.target.value })}
            />
          </div>

          {/* Peso e Altura */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Weight className="h-4 w-4" />
                Dados Básicos
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={assessment.weight}
                    onChange={(e) => setAssessment({ ...assessment, weight: e.target.value })}
                    placeholder="70.5"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    value={assessment.height}
                    onChange={(e) => setAssessment({ ...assessment, height: e.target.value })}
                    placeholder="175"
                  />
                </div>
                <div>
                  <Label htmlFor="bf">% Gordura Corporal</Label>
                  <Input
                    id="bf"
                    type="number"
                    step="0.1"
                    value={assessment.body_fat_percentage}
                    onChange={(e) => setAssessment({ ...assessment, body_fat_percentage: e.target.value })}
                    placeholder="15.5"
                  />
                </div>
                <div>
                  <Label htmlFor="muscle">Massa Muscular (kg)</Label>
                  <Input
                    id="muscle"
                    type="number"
                    step="0.1"
                    value={assessment.muscle_mass}
                    onChange={(e) => setAssessment({ ...assessment, muscle_mass: e.target.value })}
                    placeholder="60.0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medidas Corporais */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-4 flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Perímetros (cm)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chest">Peito</Label>
                  <Input
                    id="chest"
                    type="number"
                    step="0.1"
                    value={assessment.chest}
                    onChange={(e) => setAssessment({ ...assessment, chest: e.target.value })}
                    placeholder="95"
                  />
                </div>
                <div>
                  <Label htmlFor="waist">Cintura</Label>
                  <Input
                    id="waist"
                    type="number"
                    step="0.1"
                    value={assessment.waist}
                    onChange={(e) => setAssessment({ ...assessment, waist: e.target.value })}
                    placeholder="80"
                  />
                </div>
                <div>
                  <Label htmlFor="hip">Anca</Label>
                  <Input
                    id="hip"
                    type="number"
                    step="0.1"
                    value={assessment.hip}
                    onChange={(e) => setAssessment({ ...assessment, hip: e.target.value })}
                    placeholder="95"
                  />
                </div>
                <div>
                  <Label htmlFor="arm_right">Braço Direito</Label>
                  <Input
                    id="arm_right"
                    type="number"
                    step="0.1"
                    value={assessment.arm_right}
                    onChange={(e) => setAssessment({ ...assessment, arm_right: e.target.value })}
                    placeholder="35"
                  />
                </div>
                <div>
                  <Label htmlFor="arm_left">Braço Esquerdo</Label>
                  <Input
                    id="arm_left"
                    type="number"
                    step="0.1"
                    value={assessment.arm_left}
                    onChange={(e) => setAssessment({ ...assessment, arm_left: e.target.value })}
                    placeholder="35"
                  />
                </div>
                <div>
                  <Label htmlFor="thigh_right">Coxa Direita</Label>
                  <Input
                    id="thigh_right"
                    type="number"
                    step="0.1"
                    value={assessment.thigh_right}
                    onChange={(e) => setAssessment({ ...assessment, thigh_right: e.target.value })}
                    placeholder="55"
                  />
                </div>
                <div>
                  <Label htmlFor="thigh_left">Coxa Esquerda</Label>
                  <Input
                    id="thigh_left"
                    type="number"
                    step="0.1"
                    value={assessment.thigh_left}
                    onChange={(e) => setAssessment({ ...assessment, thigh_left: e.target.value })}
                    placeholder="55"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <div>
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={assessment.notes}
              onChange={(e) => setAssessment({ ...assessment, notes: e.target.value })}
              placeholder="Anotações sobre a avaliação, objetivos, observações gerais..."
              rows={4}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-cagio-green hover:bg-cagio-green-dark"
          >
            {loading ? 'A Guardar...' : 'Guardar Avaliação'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};