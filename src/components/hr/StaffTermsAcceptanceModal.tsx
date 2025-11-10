import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, ExternalLink, AlertCircle } from 'lucide-react';
import { useStaffRequiredTerms } from '@/hooks/useStaffRequiredTerms';
import { Loading } from '@/components/ui/loading';
import { toast } from 'sonner';

interface StaffTermsAcceptanceModalProps {
  isOpen: boolean;
  staffId: string;
  onCompleted: () => void;
}

export const StaffTermsAcceptanceModal: React.FC<StaffTermsAcceptanceModalProps> = ({
  isOpen,
  staffId,
  onCompleted
}) => {
  const { requiredTerms, loading, checkStaffAcceptances, acceptTerm } = useStaffRequiredTerms();
  const [acceptances, setAcceptances] = useState<Record<string, boolean>>({});
  const [processing, setProcessing] = useState(false);
  const [pendingTerms, setPendingTerms] = useState<any[]>([]);

  useEffect(() => {
    const loadPendingTerms = async () => {
      if (!staffId || !isOpen) return;

      const existingAcceptances = await checkStaffAcceptances(staffId);
      const acceptedIds = existingAcceptances.map(a => a.document_id);
      
      const pending = requiredTerms.filter(term => 
        !acceptedIds.includes(term.document_id) && term.is_required
      );

      setPendingTerms(pending);

      // Auto-accept terms that are configured for it
      const autoAccepts: Record<string, boolean> = {};
      pending.forEach(term => {
        if (term.auto_accept) {
          autoAccepts[term.document_id] = true;
        }
      });
      setAcceptances(autoAccepts);
    };

    loadPendingTerms();
  }, [staffId, isOpen, requiredTerms, checkStaffAcceptances]);

  const handleAccept = (documentId: string, checked: boolean) => {
    setAcceptances(prev => ({
      ...prev,
      [documentId]: checked
    }));
  };

  const handleSubmit = async () => {
    // Verificar se todos os termos obrigatórios foram aceitos
    const allAccepted = pendingTerms.every(term => 
      acceptances[term.document_id] === true
    );

    if (!allAccepted) {
      toast.error('Você deve aceitar todos os termos obrigatórios para continuar.');
      return;
    }

    setProcessing(true);

    try {
      // Aceitar todos os termos
      for (const term of pendingTerms) {
        if (acceptances[term.document_id]) {
          await acceptTerm(staffId, term.document_id);
        }
      }

      toast.success('Termos aceitos com sucesso!');
      onCompleted();
    } catch (error) {
      console.error('Error accepting terms:', error);
      toast.error('Erro ao aceitar termos');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <Loading />;

  // Se não há termos pendentes, completar automaticamente
  if (pendingTerms.length === 0) {
    if (isOpen) {
      setTimeout(onCompleted, 0);
    }
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent 
        className="max-w-2xl max-h-[90vh]" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Termos e Condições
          </DialogTitle>
          <DialogDescription>
            Por favor, leia e aceite os termos obrigatórios para continuar.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900 dark:text-amber-100">
            Você precisa aceitar todos os termos obrigatórios para acessar o sistema.
          </AlertDescription>
        </Alert>

        <ScrollArea className="max-h-[400px] pr-4">
          <div className="space-y-4">
            {pendingTerms.map((term) => (
              <div 
                key={term.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{term.document?.name}</h4>
                    {term.document?.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {term.document.description}
                      </p>
                    )}
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto mt-2"
                      asChild
                    >
                      <a 
                        href={term.document?.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Visualizar documento
                      </a>
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-8">
                  <Checkbox
                    id={`term-${term.id}`}
                    checked={acceptances[term.document_id] || false}
                    onCheckedChange={(checked) => 
                      handleAccept(term.document_id, checked as boolean)
                    }
                    disabled={term.auto_accept || processing}
                  />
                  <label
                    htmlFor={`term-${term.id}`}
                    className="text-sm cursor-pointer"
                  >
                    {term.auto_accept 
                      ? 'Este termo é aceito automaticamente'
                      : 'Li e aceito os termos deste documento'}
                  </label>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            onClick={handleSubmit}
            disabled={processing || !pendingTerms.every(term => acceptances[term.document_id])}
            className="bg-primary hover:bg-primary/90"
          >
            {processing ? 'Processando...' : 'Aceitar e Continuar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
