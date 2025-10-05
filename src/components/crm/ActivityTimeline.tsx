import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Calendar, FileText, CheckSquare, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface Activity {
  id: string;
  activity_type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'stage_change';
  title: string;
  description?: string;
  created_at: string;
  completed_at?: string;
  status: string;
}

interface ActivityTimelineProps {
  activities: Activity[];
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'call': return Phone;
    case 'email': return Mail;
    case 'meeting': return Calendar;
    case 'note': return FileText;
    case 'task': return CheckSquare;
    case 'stage_change': return TrendingUp;
    default: return FileText;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'call': return 'text-blue-500';
    case 'email': return 'text-purple-500';
    case 'meeting': return 'text-green-500';
    case 'note': return 'text-gray-500';
    case 'task': return 'text-orange-500';
    case 'stage_change': return 'text-primary';
    default: return 'text-gray-500';
  }
};

const getActivityLabel = (type: string) => {
  switch (type) {
    case 'call': return 'Chamada';
    case 'email': return 'Email';
    case 'meeting': return 'Reunião';
    case 'note': return 'Nota';
    case 'task': return 'Tarefa';
    case 'stage_change': return 'Mudança de Estágio';
    default: return type;
  }
};

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-muted-foreground">
        Nenhuma atividade registrada
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.activity_type);
        const iconColor = getActivityColor(activity.activity_type);
        
        return (
          <div key={activity.id} className="relative pl-8">
            {index < activities.length - 1 && (
              <div className="absolute left-2.5 top-8 bottom-0 w-px bg-border" />
            )}
            
            <div className={`absolute left-0 top-1 p-1 rounded-full bg-background border-2 ${iconColor}`}>
              <Icon className="h-3 w-3" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm">{activity.title}</h4>
                <Badge variant="outline" className="text-xs">
                  {getActivityLabel(activity.activity_type)}
                </Badge>
              </div>

              {activity.description && (
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
              )}

              <p className="text-xs text-muted-foreground">
                {format(new Date(activity.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: pt })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
