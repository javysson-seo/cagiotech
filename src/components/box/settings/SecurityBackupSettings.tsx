
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Save, Lock, Database, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

export const SecurityBackupSettings: React.FC = () => {
  const [security, setSecurity] = useState({
    twoFactorRequired: false,
    sessionTimeout: 60,
    passwordExpiry: 90,
    gdprCompliance: true,
    dataRetention: 7
  });

  const [backup, setBackup] = useState({
    autoBackup: true,
    frequency: 'daily',
    retention: 30,
    testRecovery: false
  });

  const handleSave = () => {
    toast.success('Configurações de segurança salvas!');
    console.log('Segurança:', { security, backup });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Segurança & Backup</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="h-5 w-5" />
            <span>Políticas de Segurança</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>2FA Obrigatório para Admins</Label>
              <p className="text-sm text-muted-foreground">
                Autenticação de dois fatores obrigatória
              </p>
            </div>
            <Switch
              checked={security.twoFactorRequired}
              onCheckedChange={(checked) => setSecurity({ ...security, twoFactorRequired: checked })}
            />
          </div>

          <div>
            <Label>Timeout de Sessão (minutos)</Label>
            <Select value={String(security.sessionTimeout)} onValueChange={(value) => setSecurity({ ...security, sessionTimeout: parseInt(value) })}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutos</SelectItem>
                <SelectItem value="60">1 hora</SelectItem>
                <SelectItem value="120">2 horas</SelectItem>
                <SelectItem value="240">4 horas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Expiração de Senha (dias)</Label>
            <Select value={String(security.passwordExpiry)} onValueChange={(value) => setSecurity({ ...security, passwordExpiry: parseInt(value) })}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="60">60 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Retenção de Dados (anos)</Label>
            <Select value={String(security.dataRetention)} onValueChange={(value) => setSecurity({ ...security, dataRetention: parseInt(value) })}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 anos</SelectItem>
                <SelectItem value="5">5 anos</SelectItem>
                <SelectItem value="7">7 anos</SelectItem>
                <SelectItem value="10">10 anos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Backup Automático</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Backup Automático</Label>
              <p className="text-sm text-muted-foreground">
                Backup automático dos dados da BOX
              </p>
            </div>
            <Switch
              checked={backup.autoBackup}
              onCheckedChange={(checked) => setBackup({ ...backup, autoBackup: checked })}
            />
          </div>

          <div>
            <Label>Frequência</Label>
            <Select value={backup.frequency} onValueChange={(value) => setBackup({ ...backup, frequency: value })}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Diário</SelectItem>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Retenção de Backups (dias)</Label>
            <Select value={String(backup.retention)} onValueChange={(value) => setBackup({ ...backup, retention: parseInt(value) })}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
                <SelectItem value="90">90 dias</SelectItem>
                <SelectItem value="365">1 ano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileCheck className="h-5 w-5" />
            <span>RGPD Compliance (Portugal)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-green-600">
              <FileCheck className="h-4 w-4" />
              <span className="text-sm">Consentimento de dados implementado</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <FileCheck className="h-4 w-4" />
              <span className="text-sm">Direito ao esquecimento ativo</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <FileCheck className="h-4 w-4" />
              <span className="text-sm">Export de dados pessoais disponível</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <FileCheck className="h-4 w-4" />
              <span className="text-sm">Log de acessos mantido</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações de Segurança
      </Button>
    </div>
  );
};
