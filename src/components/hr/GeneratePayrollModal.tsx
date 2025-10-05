import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratePayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeneratePayrollModal: React.FC<GeneratePayrollModalProps> = ({
  isOpen,
  onClose
}) => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));

  const handleGenerate = () => {
    toast.success('Folha de pagamento gerada com sucesso!');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar Folha de Pagamento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Mês de Referência</Label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium">A folha incluirá:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Salários base configurados</li>
              <li>• Horas trabalhadas registradas</li>
              <li>• Aulas ministradas</li>
              <li>• Bônus e deduções</li>
              <li>• Cálculo automático de impostos</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleGenerate} className="gap-2">
              <FileText className="h-4 w-4" />
              Gerar Folha
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
