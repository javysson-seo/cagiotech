import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, AlertTriangle, Check, Trash2, Filter, CheckCheck } from 'lucide-react';
import { Notification } from '@/hooks/useNotifications';

interface NotificationsListProps {
  notifications: Notification[];
  onMarkAsRead?: (notificationId: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (notificationId: string) => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ 
  notifications, 
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete 
}) => {
  const [filter, setFilter] = useState<'all' | 'unread' | 'urgent'>('all');

  const unreadNotifications = notifications.filter(n => !n.is_read);
  const urgentNotifications = notifications.filter(n => n.is_urgent && !n.is_read);
  
  const filteredNotifications = 
    filter === 'unread' ? unreadNotifications :
    filter === 'urgent' ? urgentNotifications :
    notifications;

  if (notifications.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Nenhuma notificação ainda</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <div className="flex items-center gap-4">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="w-full">
            <TabsList>
              <TabsTrigger value="all" className="gap-2">
                <Bell className="h-4 w-4" />
                Todas
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-1">{notifications.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" className="gap-2">
                <Filter className="h-4 w-4" />
                Não lidas
                {unreadNotifications.length > 0 && (
                  <Badge variant="default" className="ml-1">{unreadNotifications.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="urgent" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Urgentes
                {urgentNotifications.length > 0 && (
                  <Badge variant="destructive" className="ml-1">{urgentNotifications.length}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {unreadNotifications.length > 0 && onMarkAllAsRead && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onMarkAllAsRead}
          >
            <CheckCheck className="h-4 w-4 mr-2" />
            Marcar todas como lidas
          </Button>
        )}
      </div>

      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>
              {filter === 'unread' && 'Nenhuma notificação não lida'}
              {filter === 'urgent' && 'Nenhuma notificação urgente'}
              {filter === 'all' && 'Nenhuma notificação'}
            </p>
          </CardContent>
        </Card>
      ) : (
        filteredNotifications.map((notification) => (
        <Alert 
          key={notification.id} 
          variant={notification.is_urgent ? 'destructive' : 'default'}
          className={notification.is_read ? 'opacity-60' : ''}
        >
          {notification.is_urgent && <AlertTriangle className="h-4 w-4" />}
          <AlertTitle className="flex items-center gap-2">
            {notification.title}
            <div className="ml-auto flex items-center gap-2">
              {!notification.is_read && (
                <Badge variant="default" className="bg-primary">Nova</Badge>
              )}
              {notification.is_urgent && (
                <Badge variant="destructive">Urgente</Badge>
              )}
            </div>
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="whitespace-pre-wrap">{notification.message}</p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{format(new Date(notification.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
              </div>
              <div className="flex items-center gap-2">
                {!notification.is_read && onMarkAsRead && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Marcar como lida
                  </Button>
                )}
                {onDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir notificação?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta ação não pode ser desfeita. A notificação será permanentemente excluída.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => onDelete(notification.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Excluir
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </AlertDescription>
        </Alert>
        ))
      )}
    </div>
  );
};