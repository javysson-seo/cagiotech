import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCompanySubscription } from '@/hooks/useCompanySubscription';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SubscriptionGuardProps {
  children: React.ReactNode;
}

export const SubscriptionGuard: React.FC<SubscriptionGuardProps> = ({ children }) => {
  const { subscription, loading } = useCompanySubscription();
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [showModal, setShowModal] = React.useState(false);

  useEffect(() => {
    if (!loading && subscription && !subscription.isSubscriptionActive) {
      setShowModal(true);
    }
  }, [loading, subscription]);

  const handleUpgrade = () => {
    if (companyId) {
      navigate(`/${companyId}/subscription`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="h-5 w-5" />
              <DialogTitle>Assinatura Expirada</DialogTitle>
            </div>
            <DialogDescription className="space-y-4">
              <p>
                {subscription?.subscription_status === 'trial' 
                  ? 'Seu período de trial de 14 dias expirou.'
                  : 'Sua assinatura expirou.'}
              </p>
              
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">Para continuar usando o Cagio:</p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Escolha um plano de assinatura</li>
                      <li>Mantenha acesso a todas as funcionalidades</li>
                      <li>Suporte prioritário</li>
                      <li>Sem perda de dados</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex gap-2 justify-end mt-4">
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Depois
            </Button>
            <Button onClick={handleUpgrade}>
              Ver Planos
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
