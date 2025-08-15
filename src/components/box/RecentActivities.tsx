
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  UserPlus, 
  Calendar, 
  CreditCard, 
  MessageSquare, 
  TrendingUp,
  Clock
} from 'lucide-react';

export const RecentActivities: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'new_member',
      title: 'Novo membro registado',
      description: 'João Silva aderiu ao plano mensal',
      time: '5 min atrás',
      icon: UserPlus,
      color: 'text-green-600',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao'
    },
    {
      id: 2,
      type: 'class_booking',
      title: 'Aula reservada',
      description: 'CrossFit das 18:00 - 15 participantes',
      time: '12 min atrás',
      icon: Calendar,
      color: 'text-blue-600',
      avatar: null
    },
    {
      id: 3,
      type: 'payment',
      title: 'Pagamento recebido',
      description: 'Maria Santos pagou mensalidade (€45)',
      time: '25 min atrás',
      icon: CreditCard,
      color: 'text-green-600',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
    },
    {
      id: 4,
      type: 'message',
      title: 'Nova mensagem',
      description: 'Pedro Costa enviou feedback sobre aula',
      time: '1h atrás',
      icon: MessageSquare,
      color: 'text-purple-600',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro'
    },
    {
      id: 5,
      type: 'milestone',
      title: 'Meta atingida',
      description: '150 membros ativos este mês',
      time: '2h atrás',
      icon: TrendingUp,
      color: 'text-cagio-green',
      avatar: null
    }
  ];

  const getActivityBadge = (type: string) => {
    const badgeConfig = {
      new_member: { label: 'Novo', variant: 'default' as const },
      class_booking: { label: 'Reserva', variant: 'secondary' as const },
      payment: { label: 'Pagamento', variant: 'default' as const },
      message: { label: 'Mensagem', variant: 'outline' as const },
      milestone: { label: 'Meta', variant: 'secondary' as const }
    };
    
    return badgeConfig[type as keyof typeof badgeConfig] || badgeConfig.new_member;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const badge = getActivityBadge(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                {activity.avatar ? (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={activity.avatar} />
                    <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                      {activity.description.split(' ')[0].slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className={`p-2 rounded-full bg-accent ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-sm text-foreground">
                      {activity.title}
                    </p>
                    <Badge variant={badge.variant} className="text-xs">
                      {badge.label}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
