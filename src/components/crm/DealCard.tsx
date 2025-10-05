import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Euro, Phone, Mail, Percent, GripVertical } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface DealCardProps {
  deal: {
    id: string;
    title: string;
    value?: number;
    probability: number;
    expected_close_date?: string;
    prospect?: {
      name: string;
      email?: string;
      phone?: string;
    };
    tags?: string[];
  };
  onClick: () => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: deal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className="cursor-pointer hover:shadow-md transition-shadow mb-3"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1 line-clamp-2">{deal.title}</h4>
            {deal.prospect && (
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {deal.prospect.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{deal.prospect.name}</span>
              </div>
            )}
          </div>
          <div 
            {...attributes} 
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          >
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div className="space-y-2">
          {deal.value && (
            <div className="flex items-center gap-1 text-sm">
              <Euro className="h-3 w-3 text-muted-foreground" />
              <span className="font-medium">
                {deal.value.toLocaleString('pt-PT', { 
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2 
                })}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Percent className="h-3 w-3" />
            <span>{deal.probability}% probabilidade</span>
          </div>

          {deal.expected_close_date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(deal.expected_close_date), 'dd MMM yyyy', { locale: pt })}
              </span>
            </div>
          )}

          {deal.prospect?.email && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{deal.prospect.email}</span>
            </div>
          )}

          {deal.prospect?.phone && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" />
              <span>{deal.prospect.phone}</span>
            </div>
          )}
        </div>

        {deal.tags && deal.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {deal.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
