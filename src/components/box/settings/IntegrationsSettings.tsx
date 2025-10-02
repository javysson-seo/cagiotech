import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plug, CreditCard, ShieldCheck, Link as LinkIcon } from 'lucide-react';
import { toast } from 'sonner';

export const IntegrationsSettings: React.FC = () => {
  const handleConnect = (provider: 'stripe' | 'eupago' | 'vendus') => {
    toast.success(`Iniciaremos a configuração com ${provider.toUpperCase()}.`);
  };

  const IntegrationCard = ({
    title,
    description,
    status = 'Desconectado',
    onConnect,
    docsUrl
  }: {
    title: string;
    description: string;
    status?: 'Conectado' | 'Desconectado';
    onConnect: () => void;
    docsUrl?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
        <Badge variant={status === 'Conectado' ? 'default' : 'outline'}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={onConnect}>
            <Plug className="h-4 w-4 mr-2" />
            Conectar
          </Button>
          {docsUrl && (
            <a href={docsUrl} target="_blank" rel="noreferrer">
              <Button variant="outline">
                <LinkIcon className="h-4 w-4 mr-2" />
                Documentação
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Plug className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Integrações de Pagamento</h2>
          <p className="text-sm text-muted-foreground">Conecte o seu processador de pagamentos e o software de faturação.</p>
        </div>
      </div>

      <Card className="bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <p>
              As chaves e segredos serão guardados de forma segura através do backend (Supabase). Nunca coloque chaves privadas diretamente no código.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <IntegrationCard
          title="Stripe"
          description="Plataforma global de pagamentos – cartões, subscrições e faturação."
          onConnect={() => handleConnect('stripe')}
          docsUrl="https://stripe.com/docs"
        />

        <IntegrationCard
          title="EuPago"
          description="Pagamentos em Portugal: MBWay, Multibanco e referências."
          onConnect={() => handleConnect('eupago')}
          docsUrl="https://support.eupago.pt/pt/"
        />

        <IntegrationCard
          title="Vendus"
          description="Faturação certificada em Portugal e gestão de documentos."
          onConnect={() => handleConnect('vendus')}
          docsUrl="https://www.vendus.pt/suporte/"
        />
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Fluxo recomendado
          </CardTitle>
          <CardDescription>
            1) Conectar Stripe ou EuPago para pagamentos • 2) Conectar Vendus para faturação • 3) Sincronizar planos e recibos.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default IntegrationsSettings;
