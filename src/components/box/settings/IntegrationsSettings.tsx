import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plug, CreditCard, ShieldCheck, Link as LinkIcon, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/integrations/supabase/client';

export const IntegrationsSettings: React.FC = () => {
  const { currentCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  
  const [ifthenPaySettings, setIfthenPaySettings] = useState({
    is_enabled: false,
    is_sandbox: true,
    mb_key: '',
    mbway_key: '',
    backoffice_key: '',
  });

  const webhookUrl = `${window.location.origin.replace('localhost:8080', 'vwonynqoybfvaleyfmog.supabase.co')}/functions/v1/ifthenpay-webhook`;

  useEffect(() => {
    if (currentCompany?.id) {
      loadIfthenPaySettings();
    }
  }, [currentCompany?.id]);

  const loadIfthenPaySettings = async () => {
    if (!currentCompany?.id) return;

    try {
      const { data, error } = await supabase
        .from('payment_gateway_settings')
        .select('*')
        .eq('company_id', currentCompany.id)
        .eq('gateway_type', 'ifthenpay')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        const gatewaySettings = data.settings as any;
        setIfthenPaySettings({
          is_enabled: data.is_enabled,
          is_sandbox: data.is_sandbox,
          mb_key: gatewaySettings.mb_key || '',
          mbway_key: gatewaySettings.mbway_key || '',
          backoffice_key: gatewaySettings.backoffice_key || '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSaveIfthenPay = async () => {
    if (!currentCompany?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('payment_gateway_settings')
        .upsert({
          company_id: currentCompany.id,
          gateway_type: 'ifthenpay',
          is_enabled: ifthenPaySettings.is_enabled,
          is_sandbox: ifthenPaySettings.is_sandbox,
          settings: {
            mb_key: ifthenPaySettings.mb_key,
            mbway_key: ifthenPaySettings.mbway_key,
            backoffice_key: ifthenPaySettings.backoffice_key,
          },
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Configurações IfthenPay salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setLoading(false);
    }
  };

  const copyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    toast.success('URL copiado!');
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

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

      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">IfthenPay</CardTitle>
                <CardDescription>Multibanco, MBWay - Integrado e pronto</CardDescription>
              </div>
            </div>
            <Badge variant={ifthenPaySettings.is_enabled ? 'default' : 'outline'}>
              {ifthenPaySettings.is_enabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loadingSettings ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Ativar Pagamentos</Label>
                  <p className="text-xs text-muted-foreground">Habilitar Multibanco e MBWay</p>
                </div>
                <Switch
                  checked={ifthenPaySettings.is_enabled}
                  onCheckedChange={(checked) => 
                    setIfthenPaySettings({ ...ifthenPaySettings, is_enabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Modo Teste (Sandbox)</Label>
                  <p className="text-xs text-muted-foreground">Use credenciais de teste</p>
                </div>
                <Switch
                  checked={ifthenPaySettings.is_sandbox}
                  onCheckedChange={(checked) => 
                    setIfthenPaySettings({ ...ifthenPaySettings, is_sandbox: checked })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Chave Multibanco (MB Key)</Label>
                  <Input
                    type="text"
                    placeholder={ifthenPaySettings.is_sandbox ? "Ex: XCE-762598" : "Sua MB Key"}
                    value={ifthenPaySettings.mb_key}
                    onChange={(e) => 
                      setIfthenPaySettings({ ...ifthenPaySettings, mb_key: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm">Chave MBWay</Label>
                  <Input
                    type="text"
                    placeholder={ifthenPaySettings.is_sandbox ? "Ex: SRG-918938" : "Sua MBWay Key"}
                    value={ifthenPaySettings.mbway_key}
                    onChange={(e) => 
                      setIfthenPaySettings({ ...ifthenPaySettings, mbway_key: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm">Chave BackOffice</Label>
                  <Input
                    type="password"
                    placeholder={ifthenPaySettings.is_sandbox ? "7450-9536-2609-1991" : "Sua BackOffice Key"}
                    value={ifthenPaySettings.backoffice_key}
                    onChange={(e) => 
                      setIfthenPaySettings({ ...ifthenPaySettings, backoffice_key: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              {ifthenPaySettings.is_sandbox && (
                <Alert className="bg-amber-500/10 border-amber-500/20">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-xs">
                    <strong>Credenciais de Teste:</strong> MB: XCE-762598 | MBWay: SRG-918938 | BackOffice: 7450-9536-2609-1991
                  </AlertDescription>
                </Alert>
              )}

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm">URL do Webhook (configure no IfthenPay)</Label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={webhookUrl}
                    readOnly
                    className="font-mono text-xs"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyWebhookUrl}
                  >
                    {copiedWebhook ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleSaveIfthenPay} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar Configurações IfthenPay'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h3 className="text-lg font-semibold mb-4">Outras Integrações</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <IntegrationCard
            title="Stripe"
            description="Plataforma global de pagamentos – cartões, subscrições e faturação."
            onConnect={() => handleConnect('stripe')}
            docsUrl="https://stripe.com/docs"
          />

          <IntegrationCard
            title="Vendus"
            description="Faturação certificada em Portugal e gestão de documentos."
            onConnect={() => handleConnect('vendus')}
            docsUrl="https://www.vendus.pt/suporte/"
          />
        </div>
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
