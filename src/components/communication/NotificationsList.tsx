import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bell, AlertTriangle } from 'lucide-react';
import { CompanyNotification } from '@/hooks/useCompanyNotifications';

interface NotificationsListProps {
  notifications: CompanyNotification[];
}

export const NotificationsList: React.FC<NotificationsListProps> = ({ notifications }) => {
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
      {notifications.map((notification) => (
        <Alert key={notification.id} variant={notification.is_urgent ? 'destructive' : 'default'}>
          {notification.is_urgent && <AlertTriangle className="h-4 w-4" />}
          <AlertTitle className="flex items-center gap-2">
            {notification.title}
            {notification.is_urgent && (
              <Badge variant="destructive" className="ml-auto">Urgente</Badge>
            )}
          </AlertTitle>
          <AlertDescription className="mt-2">
            <p className="whitespace-pre-wrap">{notification.message}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Por: {notification.creator?.name}</span>
              <span>•</span>
              <span>{format(new Date(notification.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
            </div>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};