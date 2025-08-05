
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bell, 
  BellRing,
  CheckCircle,
  AlertCircle,
  Info,
  Calendar,
  CreditCard,
  Users,
  MessageSquare,
  Settings,
  Search,
  Filter
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'payment' | 'class' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const NotificationCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'class',
      title: 'Aula Confirmada',
      message: 'Sua aula de CrossFit está confirmada para hoje às 18:00',
      timestamp: '2024-01-16T15:30:00Z',
      read: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'payment',
      title: 'Pagamento Processado',
      message: 'Mensalidade de janeiro foi processada com sucesso',
      timestamp: '2024-01-15T10:15:00Z',
      read: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'message',
      title: 'Nova Mensagem do Trainer',
      message: 'Carlos enviou seu novo plano de treino',
      timestamp: '2024-01-15T08:45:00Z',
      read: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'info',
      title: 'Atualização do Sistema',
      message: 'Novas funcionalidades foram adicionadas ao app',
      timestamp: '2024-01-14T16:20:00Z',
      read: true,
      priority: 'low'
    },
    {
      id: '5',
      type: 'warning',
      title: 'Aula Cancelada',
      message: 'A aula de yoga de amanhã foi cancelada devido à indisponibilidade do instrutor',
      timestamp: '2024-01-14T14:00:00Z',
      read: false,
      priority: 'high'
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'class': return <Calendar className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      case 'message': return <MessageSquare className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'success': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'class': return 'text-blue-600 bg-blue-50';
      case 'payment': return 'text-green-600 bg-green-50';
      case 'message': return 'text-purple-600 bg-purple-50';
      case 'warning': return 'text-red-600 bg-red-50';
      case 'success': return 'text-green-600 bg-green-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <Badge variant="destructive">Alta</Badge>;
      case 'medium': return <Badge variant="outline">Média</Badge>;
      case 'low': return <Badge variant="secondary">Baixa</Badge>;
      default: return null;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesSearch = notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notif.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'unread' && !notif.read) ||
                         (filterType === 'read' && notif.read) ||
                         notif.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="h-8 w-8 text-blue-600" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Central de Notificações</h1>
            <p className="text-muted-foreground">
              {unreadCount} notificações não lidas
            </p>
          </div>
        </div>
        
        <Button onClick={markAllAsRead} variant="outline">
          <CheckCircle className="h-4 w-4 mr-2" />
          Marcar Todas como Lidas
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar notificações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="all">Todas</option>
              <option value="unread">Não Lidas</option>
              <option value="read">Lidas</option>
              <option value="class">Aulas</option>
              <option value="payment">Pagamentos</option>
              <option value="message">Mensagens</option>
              <option value="warning">Avisos</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-muted/50 transition-colors ${
                  !notification.read ? 'bg-blue-50/30' : ''
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-foreground">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                      )}
                      {getPriorityBadge(notification.priority)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(notification.timestamp)}
                      </span>
                      
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Marcar como Lida
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                        >
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma notificação encontrada</h3>
              <p className="text-muted-foreground">
                Não há notificações que correspondam aos filtros selecionados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Configurações de Notificação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notificações de Aulas</h4>
              <p className="text-sm text-muted-foreground">
                Receber alertas sobre agendamentos e cancelamentos
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configurar
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Notificações de Pagamento</h4>
              <p className="text-sm text-muted-foreground">
                Alertas sobre cobranças e confirmações
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configurar
            </Button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Mensagens do Trainer</h4>
              <p className="text-sm text-muted-foreground">
                Notificações sobre novos planos e mensagens
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configurar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
