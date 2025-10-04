import React from 'react';
import { Monitor, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useMobileDetection } from '@/hooks/useMobileDetection';

export const WebOnlyAccessBanner: React.FC = () => {
  const { isMobileApp } = useMobileDetection();

  if (!isMobileApp) return null;

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-2">
        <Monitor className="h-4 w-4" />
        Acesso Apenas pelo Navegador
      </AlertTitle>
      <AlertDescription>
        Esta área está disponível apenas através do navegador web. 
        Por favor, aceda através de um computador ou tablet.
      </AlertDescription>
    </Alert>
  );
};
