import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface StaffCredentialsAlertProps {
  email: string;
  password: string;
}

export const StaffCredentialsAlert: React.FC<StaffCredentialsAlertProps> = ({
  email,
  password
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  return (
    <Alert className="bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800">
      <CheckCircle2 className="h-4 w-4 text-green-600" />
      <AlertDescription>
        <div className="space-y-3">
          <p className="font-semibold text-green-900 dark:text-green-100">
            Funcionário criado com sucesso!
          </p>
          <p className="text-sm text-green-800 dark:text-green-200">
            Credenciais de acesso geradas:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-green-900 dark:text-green-100">Email:</Label>
              <div className="flex gap-1">
                <Input
                  value={email}
                  readOnly
                  className="bg-white dark:bg-gray-900 text-sm font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(email, 'Email')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs text-green-900 dark:text-green-100">Senha Temporária:</Label>
              <div className="flex gap-1">
                <Input
                  value={password}
                  readOnly
                  className="bg-white dark:bg-gray-900 text-sm font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(password, 'Senha')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <p className="text-xs text-green-700 dark:text-green-300 mt-2">
            ⚠️ Anote estas credenciais! O funcionário deverá usar este email e senha para fazer o primeiro login.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );
};
