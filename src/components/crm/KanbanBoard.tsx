import React, { useState, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { KanbanColumn } from './KanbanColumn';
import { DealCard } from './DealCard';
import { useCRMStages } from '@/hooks/useCRMStages';
import { useCRMDeals } from '@/hooks/useCRMDeals';

interface KanbanBoardProps {
  onDealClick: (deal: any) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ onDealClick }) => {
  const { stages, loading: loadingStages } = useCRMStages();
  const { deals, updateDealStage, loading: loadingDeals } = useCRMDeals();
  const [activeDeal, setActiveDeal] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const dealsByStage = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    
    stages.forEach(stage => {
      grouped[stage.id] = deals.filter(deal => deal.stage_id === stage.id);
    });

    return grouped;
  }, [stages, deals]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const deal = deals.find(d => d.id === active.id);
    setActiveDeal(deal);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Optional: Add visual feedback during drag
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveDeal(null);
      return;
    }

    const dealId = active.id as string;
    const newStageId = over.id as string;

    // Check if dropped on a stage (not another deal)
    const isStage = stages.some(stage => stage.id === newStageId);
    
    if (isStage) {
      const deal = deals.find(d => d.id === dealId);
      if (deal && deal.stage_id !== newStageId) {
        await updateDealStage(dealId, newStageId);
      }
    }

    setActiveDeal(null);
  };

  const handleDragCancel = () => {
    setActiveDeal(null);
  };

  if (loadingStages || loadingDeals) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Carregando pipeline...</div>
      </div>
    );
  }

  if (stages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">Nenhum estágio configurado</p>
          <p className="text-sm text-muted-foreground">
            Configure os estágios do seu funil de vendas
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <KanbanColumn
            key={stage.id}
            stage={stage}
            deals={dealsByStage[stage.id] || []}
            onDealClick={onDealClick}
          />
        ))}
      </div>

      <DragOverlay>
        {activeDeal ? (
          <div className="w-80">
            <DealCard 
              deal={activeDeal} 
              onClick={() => {}} 
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
