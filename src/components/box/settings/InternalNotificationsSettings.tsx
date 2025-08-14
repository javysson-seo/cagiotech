
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Save } from 'lucide-react';
import { toast } from 'sonner';

export const InternalNotificationsSettings: React.FC = () => {
  const [notifications, setNotifications] = useState({
    newMembers: true,
    paymentsDue: true,
    lowClassOccupancy: true,
    equipmentMaintenance: true,
    monthlyGoals: true,
    operationalAlerts: true
  });

  const handleSave = () => {
    toast.success('Configurações de notificações salvas!');
    console.log('Notificações:', notifications);
  };

  const updateNotification = (key: string, value: boolean) => {
    setNotifications({ ...notifications, [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Bell className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Notificações Internas</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Centro de Notificações da BOX</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <Label>
                    {key === 'newMembers' ? 'Novos Membros Cadastrados' :
                     key === 'paymentsDue' ? 'Pagamentos em Atraso' :
                     key === 'lowClassOccupancy' ? 'Aulas com Baixa Ocupação' :
                     key === 'equipmentMaintenance' ? 'Manutenção de Equipamentos' :
                     key === 'monthlyGoals' ? 'Metas Mensais' :
                     key === 'operationalAlerts' ? 'Alertas Operacionais' : key}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {key === 'newMembers' ? 'Notificar sobre novos cadastros' :
                     key === 'paymentsDue' ? 'Alertas de pagamentos pendentes' :
                     key === 'lowClassOccupancy' ? 'Aulas com poucos inscritos' :
                     key === 'equipmentMaintenance' ? 'Equipamentos precisando manutenção' :
                     key === 'monthlyGoals' ? 'Status das metas mensais' :
                     key === 'operationalAlerts' ? 'Alertas importantes da operação' : ''}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateNotification(key, checked)}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações de Notificações
      </Button>
    </div>
  );
};
