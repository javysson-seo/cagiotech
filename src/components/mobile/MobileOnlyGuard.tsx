import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useAuth } from '@/contexts/AuthContext';
import { Monitor, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MobileOnlyGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const MobileOnlyGuard: React.FC<MobileOnlyGuardProps> = ({ children, allowedRoles }) => {
  const { isMobileApp, platform } = useMobileDetection();
  const { user } = useAuth();

  // Se não é mobile app e o usuário tem role que requer mobile
  if (!isMobileApp && user?.role && allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-primary/10">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">
              Acesso Apenas via App Mobile
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Esta área está disponível apenas através do aplicativo mobile na Apple Store ou Google Play Store.
            </p>
            <div className="bg-primary/5 p-4 rounded-lg">
              <Monitor className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm text-primary font-medium">
                Por favor, baixe nosso app para acessar sua conta.
              </p>
            </div>
            <div className="pt-4 space-y-2">
              <Button 
                onClick={() => window.open('https://apps.apple.com', '_blank')}
                className="w-full"
                variant="default"
              >
                Baixar na Apple Store
              </Button>
              <Button 
                onClick={() => window.open('https://play.google.com', '_blank')}
                className="w-full"
                variant="outline"
              >
                Baixar no Google Play
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
