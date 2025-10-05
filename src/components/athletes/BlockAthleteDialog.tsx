import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BlockAthleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: any;
  onSuccess: () => void;
}

export const BlockAthleteDialog = ({ isOpen, onClose, athlete, onSuccess }: BlockAthleteDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const predefinedReasons = [
    'Pagamento pendente',
    'Inadimplência',
    'Suspensão temporária',
    'Comportamento inadequado',
    'Documentação incompleta',
    'A pedido do cliente',
    'Outro'
  ];

  const handleBlock = async () => {
    if (!reason) {
      toast.error('Selecione um motivo');
      return;
    }

    if (reason === 'Outro' && !customReason.trim()) {
      toast.error('Descreva o motivo do bloqueio');
      return;
    }

    setLoading(true);

    try {
      const finalReason = reason === 'Outro' ? customReason : reason;

      const { error } = await supabase
        .from('athletes')
        .update({
          status: 'inactive',
          blocked_reason: finalReason,
          blocked_at: new Date().toISOString()
        })
        .eq('id', athlete.id);

      if (error) throw error;

      toast.success('Atleta bloqueado com sucesso');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error('Erro ao bloquear atleta');
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
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Bloquear Acesso
          </DialogTitle>
          <DialogDescription>
            O atleta {athlete?.name} não conseguirá fazer login após o bloqueio.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="reason">Motivo do Bloqueio *</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Selecione um motivo" />
              </SelectTrigger>
              <SelectContent>
                {predefinedReasons.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {reason === 'Outro' && (
            <div>
              <Label htmlFor="custom-reason">Descreva o motivo *</Label>
              <Textarea
                id="custom-reason"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Descreva o motivo do bloqueio..."
                rows={3}
              />
            </div>
          )}

          <div className="p-4 bg-destructive/10 rounded-lg">
            <p className="text-sm text-destructive">
              <strong>Atenção:</strong> O atleta será notificado sobre o bloqueio e 
              deverá entrar em contato com a empresa para resolver a situação.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleBlock}
            disabled={loading}
            className="bg-destructive hover:bg-destructive/90"
          >
            {loading ? 'Bloqueando...' : 'Confirmar Bloqueio'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};