
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Cake, Gift, X } from 'lucide-react';
import { toast } from 'sonner';

interface BirthdayNotification {
  id: string;
  athleteId: string;
  athleteName: string;
  athletePhoto?: string;
  age: number;
  birthDate: string;
  createdAt: string;
  isRead: boolean;
}

interface BirthdayNotificationsProps {
  athletes: any[];
}

export const BirthdayNotifications: React.FC<BirthdayNotificationsProps> = ({ athletes }) => {
  const [notifications, setNotifications] = useState<BirthdayNotification[]>([]);

  useEffect(() => {
    checkBirthdays();
  }, [athletes]);

  const checkBirthdays = () => {
    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDate = today.getDate();

    const birthdayAthletes = athletes.filter(athlete => {
      if (!athlete.birthDate) return false;
      
      const birthDate = new Date(athlete.birthDate);
      return (
        birthDate.getMonth() === todayMonth &&
        birthDate.getDate() === todayDate
      );
    });

    const newNotifications: BirthdayNotification[] = birthdayAthletes.map(athlete => {
      const birthDate = new Date(athlete.birthDate);
      const age = today.getFullYear() - birthDate.getFullYear();
      
      return {
        id: `birthday-${athlete.id}-${today.toDateString()}`,
        athleteId: athlete.id,
        athleteName: athlete.name,
        athletePhoto: athlete.profilePhoto,
        age,
        birthDate: athlete.birthDate,
        createdAt: new Date().toISOString(),
        isRead: false
      };
    });

    // Verificar se já existem notificações para hoje
    const existingNotificationIds = notifications.map(n => n.id);
    const filteredNewNotifications = newNotifications.filter(n => 
      !existingNotificationIds.includes(n.id)
    );

    if (filteredNewNotifications.length > 0) {
      setNotifications(prev => [...prev, ...filteredNewNotifications]);
      
      // Mostrar toast para cada aniversariante
      filteredNewNotifications.forEach(notification => {
        toast.success(`🎉 ${notification.athleteName} está fazendo ${notification.age} anos hoje!`, {
          duration: 5000,
          action: {
            label: "Visualizar",
            onClick: () => console.log('View athlete:', notification.athleteId)
          }
        });
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const todayNotifications = notifications.filter(n => {
    const notificationDate = new Date(n.createdAt);
    const today = new Date();
    return (
      notificationDate.getDate() === today.getDate() &&
      notificationDate.getMonth() === today.getMonth() &&
      notificationDate.getFullYear() === today.getFullYear()
    );
  });

  if (todayNotifications.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-orange-800">
          <Cake className="h-5 w-5 mr-2" />
          Aniversários de Hoje
          {unreadNotifications.length > 0 && (
            <Badge variant="default" className="ml-2 bg-orange-600">
              {unreadNotifications.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {todayNotifications.map(notification => (
          <div
            key={notification.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              notification.isRead
                ? 'bg-white border-gray-200'
                : 'bg-orange-100 border-orange-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={notification.athletePhoto} alt={notification.athleteName} />
                <AvatarFallback className="bg-orange-200 text-orange-800">
                  <Gift className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              
              <div>
                <p className="font-medium text-gray-900">
                  {notification.athleteName}
                </p>
                <p className="text-sm text-gray-600">
                  🎂 Fazendo {notification.age} anos hoje!
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!notification.isRead && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                  className="text-orange-700 border-orange-300 hover:bg-orange-100"
                >
                  Marcar como lida
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
