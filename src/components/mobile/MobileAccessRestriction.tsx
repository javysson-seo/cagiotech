import React from 'react';
import { AlertCircle, Monitor } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface MobileAccessRestrictionProps {
  attemptedRole: 'box_owner' | 'cagio_admin' | 'box_admin';
}

export const MobileAccessRestriction: React.FC<MobileAccessRestrictionProps> = ({ attemptedRole }) => {
  const { t } = useTranslation();
  
  const roleLabels = {
    box_owner: 'Empresa',
    box_admin: 'Administrador da Empresa',
    cagio_admin: 'Administrador Cagio'
  };

  return (
    <div className="p-4 space-y-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Acesso Restrito no Aplicativo</AlertTitle>
        <AlertDescription>
          O acesso como <strong>{roleLabels[attemptedRole]}</strong> está disponível apenas através do navegador web.
        </AlertDescription>
      </Alert>

      <div className="bg-muted p-4 rounded-lg space-y-3">
        <div className="flex items-start gap-3">
          <Monitor className="h-5 w-5 mt-0.5 text-primary" />
          <div className="space-y-2">
            <p className="font-medium">Para aceder à área da empresa:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Abra o navegador web no seu computador ou tablet</li>
              <li>Aceda a <span className="font-mono text-primary">app.cagiotech.com</span></li>
              <li>Faça login com as suas credenciais</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <p className="text-sm font-medium mb-2">📱 Aplicativo Mobile - Acesso Permitido:</p>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>✓ Alunos (Students)</li>
          <li>✓ Personal Trainers</li>
        </ul>
      </div>
    </div>
  );
};
