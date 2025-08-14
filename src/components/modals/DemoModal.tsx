
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, User, Dumbbell, Play } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const handleDemo = (type: string) => {
    alert(`🎮 Demo ${type} será aberto em breve!\n\nEsta funcionalidade permitirá testar todas as funcionalidades do CagioTech sem necessidade de registro.`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <DialogTitle className="text-center text-2xl">
            🎮 Experimente nossa Demo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-center text-muted-foreground">
            Teste todas as funcionalidades do CagioTech sem necessidade de registro:
          </p>
          
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="h-20 justify-start space-x-4 hover:border-[#bed700] hover:bg-[#bed700]/5"
              onClick={() => handleDemo('BOX')}
            >
              <div className="w-12 h-12 bg-[#bed700]/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-[#bed700]" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Demo BOX</div>
                <div className="text-sm text-muted-foreground">
                  Gerir atletas, aulas, pagamentos e relatórios
                </div>
              </div>
              <Play className="h-5 w-5 text-[#bed700]" />
            </Button>

            <Button
              variant="outline"
              className="h-20 justify-start space-x-4 hover:border-[#bed700] hover:bg-[#bed700]/5"
              onClick={() => handleDemo('Personal Trainer')}
            >
              <div className="w-12 h-12 bg-[#bed700]/10 rounded-full flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-[#bed700]" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Demo Personal Trainer</div>
                <div className="text-sm text-muted-foreground">
                  Criar WODs, acompanhar alunos e planos
                </div>
              </div>
              <Play className="h-5 w-5 text-[#bed700]" />
            </Button>

            <Button
              variant="outline"
              className="h-20 justify-start space-x-4 hover:border-[#bed700] hover:bg-[#bed700]/5"
              onClick={() => handleDemo('Aluno')}
            >
              <div className="w-12 h-12 bg-[#bed700]/10 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-[#bed700]" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold">Demo Aluno</div>
                <div className="text-sm text-muted-foreground">
                  Reservar aulas, ver progresso e treinos
                </div>
              </div>
              <Play className="h-5 w-5 text-[#bed700]" />
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Dica:</strong> As demos mostram dados reais de exemplo para você testar todas as funcionalidades antes de se registar.
            </p>
          </div>

          <div className="text-center">
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
