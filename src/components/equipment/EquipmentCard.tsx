import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Equipment } from '@/hooks/useEquipment';
import { Wrench, Edit, Trash2, MapPin, Calendar, Euro, Package } from 'lucide-react';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: (equipment: Equipment) => void;
  onDelete: (id: string) => void;
  onScheduleMaintenance: (equipment: Equipment) => void;
}

export const EquipmentCard: React.FC<EquipmentCardProps> = ({
  equipment,
  onEdit,
  onDelete,
  onScheduleMaintenance,
}) => {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'good':
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case 'fair':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'poor':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
      case 'maintenance':
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case 'retired':
        return 'bg-red-500/10 text-red-700 dark:text-red-400';
      default:
        return 'bg-muted';
    }
  };

  const getConditionLabel = (condition: string) => {
    const labels: Record<string, string> = {
      excellent: 'Excelente',
      good: 'Boa',
      fair: 'Razoável',
      poor: 'Má',
    };
    return labels[condition] || condition;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Ativo',
      maintenance: 'Manutenção',
      retired: 'Retirado',
    };
    return labels[status] || status;
  };

  const isMaintenanceDue =
    equipment.next_maintenance &&
    new Date(equipment.next_maintenance) <= new Date();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">{equipment.name}</CardTitle>
            {equipment.category && (
              <p className="text-sm text-muted-foreground mt-1">
                {equipment.category}
              </p>
            )}
          </div>
          <Badge className={getStatusColor(equipment.status)}>
            {getStatusLabel(equipment.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Qtd:</span>
            <span className="font-medium">{equipment.quantity}</span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={getConditionColor(equipment.condition)}
            >
              {getConditionLabel(equipment.condition)}
            </Badge>
          </div>
        </div>

        {equipment.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="truncate">{equipment.location}</span>
          </div>
        )}

        {equipment.next_maintenance && (
          <div
            className={`flex items-center gap-2 text-sm ${
              isMaintenanceDue ? 'text-destructive font-medium' : 'text-muted-foreground'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span>
              Próxima manutenção:{' '}
              {format(new Date(equipment.next_maintenance), 'dd/MM/yyyy', {
                locale: pt,
              })}
            </span>
          </div>
        )}

        {equipment.purchase_price && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Euro className="h-4 w-4" />
            <span>
              €{equipment.purchase_price.toLocaleString('pt-PT', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        )}

        {equipment.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 pt-2 border-t">
            {equipment.description}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onEdit(equipment)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onScheduleMaintenance(equipment)}
            className={isMaintenanceDue ? 'border-destructive text-destructive' : ''}
          >
            <Wrench className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(equipment.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
