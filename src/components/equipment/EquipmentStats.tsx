import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Equipment } from '@/hooks/useEquipment';
import {
  Package,
  Wrench,
  Euro,
  AlertTriangle,
  TrendingUp,
  Calendar,
} from 'lucide-react';

interface EquipmentStatsProps {
  equipment: Equipment[];
}

export const EquipmentStats: React.FC<EquipmentStatsProps> = ({ equipment }) => {
  const totalEquipment = equipment.length;
  
  const totalQuantity = equipment.reduce((sum, eq) => sum + eq.quantity, 0);
  
  const inMaintenance = equipment.filter(eq => eq.status === 'maintenance').length;
  
  const totalValue = equipment.reduce(
    (sum, eq) => sum + (eq.purchase_price || 0) * eq.quantity,
    0
  );

  const maintenanceDue = equipment.filter(eq => {
    if (!eq.next_maintenance) return false;
    return new Date(eq.next_maintenance) <= new Date();
  }).length;

  const poorCondition = equipment.filter(eq => eq.condition === 'poor').length;

  const avgValue =
    totalEquipment > 0 ? totalValue / totalEquipment : 0;

  const stats = [
    {
      title: 'Total de Equipamentos',
      value: totalEquipment,
      subtitle: `${totalQuantity} unidades`,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950/50',
    },
    {
      title: 'Em Manutenção',
      value: inMaintenance,
      subtitle: maintenanceDue > 0 ? `${maintenanceDue} atrasados` : 'Tudo em dia',
      icon: Wrench,
      color: maintenanceDue > 0 ? 'text-red-600' : 'text-yellow-600',
      bgColor: maintenanceDue > 0 ? 'bg-red-50 dark:bg-red-950/50' : 'bg-yellow-50 dark:bg-yellow-950/50',
    },
    {
      title: 'Valor Total Investido',
      value: `€${totalValue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`,
      subtitle: `Média: €${avgValue.toLocaleString('pt-PT', { minimumFractionDigits: 2 })}`,
      icon: Euro,
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-950/50',
    },
    {
      title: 'Necessita Atenção',
      value: poorCondition + maintenanceDue,
      subtitle: `${poorCondition} má condição`,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-950/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
