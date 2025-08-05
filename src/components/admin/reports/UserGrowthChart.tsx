
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UserGrowthChartProps {
  dateRange: string;
}

export const UserGrowthChart: React.FC<UserGrowthChartProps> = ({ dateRange }) => {
  const getChartData = () => {
    if (dateRange === '7') {
      return [
        { period: 'Seg', newUsers: 12, activeUsers: 245 },
        { period: 'Ter', newUsers: 18, activeUsers: 268 },
        { period: 'Qua', newUsers: 15, activeUsers: 251 },
        { period: 'Qui', newUsers: 22, activeUsers: 289 },
        { period: 'Sex', newUsers: 28, activeUsers: 312 },
        { period: 'Sáb', newUsers: 35, activeUsers: 345 },
        { period: 'Dom', newUsers: 19, activeUsers: 298 }
      ];
    }
    
    return [
      { period: 'Sem 1', newUsers: 85, activeUsers: 1240 },
      { period: 'Sem 2', newUsers: 92, activeUsers: 1350 },
      { period: 'Sem 3', newUsers: 108, activeUsers: 1420 },
      { period: 'Sem 4', newUsers: 125, activeUsers: 1580 }
    ];
  };

  const data = getChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-blue-600">
            Novos: {payload[0].value}
          </p>
          <p className="text-sm text-green-600">
            Ativos: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="period" 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            className="text-xs"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="newUsers" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            name="Novos Utilizadores"
          />
          <Bar 
            dataKey="activeUsers" 
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
            name="Utilizadores Ativos"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
