
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Activity, 
  Calendar, 
  Star, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

export const RecentActivity: React.FC = () => {
  // Mock data - em produção virá da API/Supabase
  const activities = [
    {
      id: 1,
      type: 'class_completed',
      title: 'Aula Concluída',
      description: 'CrossFit Morning com Carlos Santos',
      date: '2024-01-14T06:00:00',
      points: 50,
      rating: 5
    },
    {
      id: 2,
      type: 'booking_made',
      title: 'Reserva Feita',
      description: 'Yoga Flow para amanhã às 07:30',
      date: '2024-01-14T10:30:00',
      points: 10,
      rating: null
    },
    {
      id: 3,
      type: 'goal_achieved',
      title: 'Meta Alcançada',
      description: '10 aulas este mês - Objetivo cumprido!',
      date: '2024-01-13T15:00:00',
      points: 100,
      rating: null
    },
    {
      id: 4,
      type: 'class_completed',
      title: 'Aula Concluída',
      description: 'Functional Training com Pedro Silva',
      date: '2024-01-12T09:00:00',
      points: 50,
      rating: 4
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'class_completed': return <Activity className="h-4 w-4 text-green-600" />;
      case 'booking_made': return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'goal_achieved': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Activity className="h-5 w-5 mr-2" />
          Atividade Recente
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <div className="flex items-center space-x-2">
                    {activity.rating && (
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-muted-foreground">{activity.rating}</span>
                      </div>
                    )}
                    <Badge variant="outline" className="text-xs">
                      +{activity.points} pts
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {activity.description}
                </p>
                
                <p className="text-xs text-muted-foreground">
                  {format(parseISO(activity.date), "dd/MM 'às' HH:mm", { locale: pt })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
