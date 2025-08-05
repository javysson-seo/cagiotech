
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  X
} from 'lucide-react';

export const SystemAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      type: 'error',
      title: 'Servidor de backup offline',
      message: 'O servidor de backup está inacessível há 2 horas',
      timestamp: '14:30',
      priority: 'high'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Utilização de recursos alta',
      message: 'CPU está a 85% de utilização',
      timestamp: '13:15',
      priority: 'medium'
    },
    {
      id: 3,
      type: 'info',
      title: 'Nova versão disponível',
      message: 'Atualização v2.1.0 está pronta para instalação',
      timestamp: '12:00',
      priority: 'low'
    },
    {
      id: 4,
      type: 'success',
      title: 'Backup concluído',
      message: 'Backup automático realizado com sucesso',
      timestamp: '06:00',
      priority: 'low'
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'info': return <Info className="h-4 w-4 text-blue-600" />;
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Alta</Badge>;
      case 'medium': return <Badge className="bg-orange-100 text-orange-800">Média</Badge>;
      case 'low': return <Badge variant="outline">Baixa</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alertas do Sistema
          </div>
          <Badge className="bg-red-100 text-red-800">
            {alerts.filter(a => a.type === 'error' || a.priority === 'high').length}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start justify-between p-3 border rounded-lg">
              <div className="flex items-start space-x-3 flex-1">
                <div className="mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-sm">{alert.title}</h5>
                    <div className="flex items-center space-x-2">
                      {getPriorityBadge(alert.priority)}
                      <span className="text-xs text-muted-foreground">
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {alert.message}
                  </p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="ml-2">
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full">
            Ver Todos os Alertas
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
