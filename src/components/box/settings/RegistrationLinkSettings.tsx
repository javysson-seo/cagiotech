import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link2, Copy, CheckCircle, ExternalLink } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { toast } from 'sonner';

export const RegistrationLinkSettings = () => {
  const { currentCompany } = useCompany();
  const [copied, setCopied] = useState(false);

  if (!currentCompany) return null;

  const registrationUrl = `${window.location.origin}/register/${currentCompany.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    toast.success('Link copiado para a área de transferência!');
    
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleOpenLink = () => {
    window.open(registrationUrl, '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-cagio-green" />
          Link de Registro Automático
        </CardTitle>
        <CardDescription>
          Compartilhe este link com os alunos para que possam se registrar automaticamente na sua empresa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h3 className="font-medium mb-2 text-blue-900 dark:text-blue-100">Como funciona?</h3>
          <ul className="text-sm space-y-1 text-blue-800 dark:text-blue-200">
            <li>• Os alunos acessam o link e preenchem seus próprios dados</li>
            <li>• Credenciais de acesso são geradas automaticamente</li>
            <li>• O cadastro fica pendente de aprovação pela empresa</li>
            <li>• Você pode aprovar ou rejeitar os cadastros na gestão de alunos</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label>Link de Registro Público</Label>
          <div className="flex gap-2">
            <Input
              value={registrationUrl}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="shrink-0"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2 text-cagio-green" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleOpenLink}
            variant="outline"
            className="flex-1"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Testar Link
          </Button>
        </div>

        <div className="p-4 bg-muted rounded-lg space-y-2">
          <h3 className="font-medium text-sm">Dicas de Uso</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Compartilhe o link nas redes sociais da empresa</li>
            <li>• Adicione o link no site ou blog da empresa</li>
            <li>• Envie o link por email para prospects</li>
            <li>• Coloque o link em QR codes para materiais físicos</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};