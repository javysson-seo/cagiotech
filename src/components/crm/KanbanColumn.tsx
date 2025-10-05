import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DealCard } from './DealCard';
import { Euro, TrendingUp } from 'lucide-react';

interface Deal {
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
}

interface KanbanColumnProps {
  stage: {
    id: string;
    name: string;
    color: string;
    is_won: boolean;
    is_lost: boolean;
  };
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  stage, 
  deals, 
  onDealClick 
}) => {
  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  const totalValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const averageProbability = deals.length > 0
    ? Math.round(deals.reduce((sum, deal) => sum + deal.probability, 0) / deals.length)
    : 0;

  return (
    <div className="flex-shrink-0 w-80">
      <Card className="h-full flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <CardTitle className="text-base">{stage.name}</CardTitle>
            </div>
            <Badge variant="secondary">{deals.length}</Badge>
          </div>
          
          {deals.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Euro className="h-3 w-3" />
                <span>
                  {totalValue.toLocaleString('pt-PT', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>{averageProbability}% média</span>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto" ref={setNodeRef}>
          <SortableContext 
            items={deals.map(d => d.id)} 
            strategy={verticalListSortingStrategy}
          >
            {deals.map((deal) => (
              <DealCard 
                key={deal.id} 
                deal={deal} 
                onClick={() => onDealClick(deal)}
              />
            ))}
          </SortableContext>

          {deals.length === 0 && (
            <div className="text-center py-8 text-sm text-muted-foreground">
              Nenhuma oportunidade neste estágio
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
