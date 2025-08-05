
import React from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export const MobileAdminRedirect: React.FC = () => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8 text-orange-600" />
          </div>
          <CardTitle className="text-xl font-bold text-orange-800">
            Acesso Restrito no Mobile
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            O painel administrativo não está otimizado para dispositivos móveis devido à complexidade do layout.
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <Monitor className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800 font-medium">
              Por favor, acesse através de um computador ou tablet para a melhor experiência.
            </p>
          </div>
          <Button 
            onClick={() => window.open(window.location.href, '_blank')}
            className="w-full"
          >
            Abrir no Navegador Desktop
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
