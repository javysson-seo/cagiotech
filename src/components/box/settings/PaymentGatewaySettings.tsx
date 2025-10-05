import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const PaymentGatewaySettings: React.FC = () => {
  const { currentCompany } = useCompany();
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  
  const [settings, setSettings] = useState({
    is_enabled: false,
    is_sandbox: true,
    mb_key: '',
    mbway_key: '',
    ccard_key: '',
    backoffice_key: '',
  });

  useEffect(() => {
    if (currentCompany?.id) {
      loadSettings();
    }
  }, [currentCompany?.id]);

  const loadSettings = async () => {
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
        setSettings({
          is_enabled: data.is_enabled,
          is_sandbox: data.is_sandbox,
          mb_key: gatewaySettings.mb_key || '',
          mbway_key: gatewaySettings.mbway_key || '',
          ccard_key: gatewaySettings.ccard_key || '',
          backoffice_key: gatewaySettings.backoffice_key || '',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast.error('Erro ao carregar configurações de pagamento');
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSave = async () => {
    if (!currentCompany?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('payment_gateway_settings')
        .upsert({
          company_id: currentCompany.id,
          gateway_type: 'ifthenpay',
          is_enabled: settings.is_enabled,
          is_sandbox: settings.is_sandbox,
          settings: {
            mb_key: settings.mb_key,
            mbway_key: settings.mbway_key,
            ccard_key: settings.ccard_key,
            backoffice_key: settings.backoffice_key,
          },
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Configurações de pagamento salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar configurações de pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSettings) {
    return <div className="text-sm text-muted-foreground">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <CreditCard className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Gateway de Pagamento - IfthenPay</h2>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Configure suas credenciais do IfthenPay para aceitar pagamentos via Multibanco, MBWay e Cartão de Crédito.
          <br />
          <strong>URL do Webhook:</strong> {window.location.origin}/functions/v1/ifthenpay-webhook
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Configurações Gerais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Ativar Gateway de Pagamento</Label>
              <p className="text-sm text-muted-foreground">
                Permite que seus clientes paguem via IfthenPay
              </p>
            </div>
            <Switch
              checked={settings.is_enabled}
              onCheckedChange={(checked) => setSettings({ ...settings, is_enabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Modo Sandbox (Teste)</Label>
              <p className="text-sm text-muted-foreground">
                Use credenciais de teste fornecidas pelo IfthenPay
              </p>
            </div>
            <Switch
              checked={settings.is_sandbox}
              onCheckedChange={(checked) => setSettings({ ...settings, is_sandbox: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Credenciais IfthenPay</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Chave Multibanco (MB Key)</Label>
            <Input
              type="text"
              placeholder="Ex: XCE-762598"
              value={settings.mb_key}
              onChange={(e) => setSettings({ ...settings, mb_key: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Para aceitar pagamentos via referência Multibanco
            </p>
          </div>

          <div>
            <Label>Chave MBWay (MBWay Key)</Label>
            <Input
              type="text"
              placeholder="Ex: SRG-918938"
              value={settings.mbway_key}
              onChange={(e) => setSettings({ ...settings, mbway_key: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Para aceitar pagamentos via MBWay
            </p>
          </div>

          <div>
            <Label>Chave Cartão de Crédito (CCard Key)</Label>
            <Input
              type="text"
              placeholder="Ex: AAA-000000"
              value={settings.ccard_key}
              onChange={(e) => setSettings({ ...settings, ccard_key: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Para aceitar pagamentos via Cartão de Crédito
            </p>
          </div>

          <div>
            <Label>Chave de BackOffice</Label>
            <Input
              type="password"
              placeholder="Ex: 7450-9536-2609-1991"
              value={settings.backoffice_key}
              onChange={(e) => setSettings({ ...settings, backoffice_key: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Chave de autenticação do BackOffice
            </p>
          </div>
        </CardContent>
      </Card>

      {settings.is_sandbox && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Credenciais de Teste (Sandbox):</strong>
            <br />
            MB Key: XCE-762598 | MBWay Key: SRG-918938 | BackOffice: 7450-9536-2609-1991
            <br />
            CCard Key: AAA-000000
          </AlertDescription>
        </Alert>
      )}

      <Button onClick={handleSave} className="w-full" size="lg" disabled={loading}>
        <Save className="h-4 w-4 mr-2" />
        {loading ? 'Salvando...' : 'Salvar Configurações'}
      </Button>
    </div>
  );
};
