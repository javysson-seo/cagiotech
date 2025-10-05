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
import { CheckCircle, QrCode } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

interface CheckInDialogProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: any;
  onSuccess: () => void;
}

export const CheckInDialog = ({ isOpen, onClose, athlete, onSuccess }: CheckInDialogProps) => {
  const { currentCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const handleCheckIn = async () => {
    if (!currentCompany) return;

    setLoading(true);

    try {
      // Registrar check-in
      const { error: checkInError } = await supabase
        .from('athlete_check_ins')
        .insert({
          athlete_id: athlete.id,
          company_id: currentCompany.id,
          check_in_type: 'manual',
          notes: notes || null
        });

      if (checkInError) throw checkInError;

      // Atualizar contadores do atleta
      const { error: updateError } = await supabase
        .from('athletes')
        .update({
          last_check_in: new Date().toISOString(),
          total_check_ins: (athlete.total_check_ins || 0) + 1
        })
        .eq('id', athlete.id);

      if (updateError) throw updateError;

      toast.success(`Check-in realizado para ${athlete.name}!`);
      onSuccess();
      onClose();
      setNotes('');
    } catch (error: any) {
      toast.error('Erro ao realizar check-in');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-cagio-green" />
            Check-in Manual
          </DialogTitle>
          <DialogDescription>
            Registrar entrada de {athlete?.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-cagio-green/10 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium">{athlete?.name}</p>
                <p className="text-sm text-muted-foreground">{athlete?.email}</p>
              </div>
              <QrCode className="h-8 w-8 text-cagio-green" />
            </div>
            
            {athlete?.last_check_in && (
              <p className="text-xs text-muted-foreground mt-2">
                Último check-in: {new Date(athlete.last_check_in).toLocaleString('pt-PT')}
              </p>
            )}
            
            <p className="text-xs text-muted-foreground">
              Total de presenças: {athlete?.total_check_ins || 0}
            </p>
          </div>

          <div>
            <Label htmlFor="notes">Observações (opcional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Primeira aula, aula experimental, etc."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            Cancelar
          </Button>
          <Button
            onClick={handleCheckIn}
            disabled={loading}
            className="flex-1 bg-cagio-green hover:bg-cagio-green-dark"
          >
            {loading ? 'Registrando...' : 'Confirmar Check-in'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};