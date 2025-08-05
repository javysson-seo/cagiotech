
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RevenueChartProps {
  dateRange: string;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ dateRange }) => {
  // Dados simulados baseados no período
  const getChartData = () => {
    if (dateRange === '7') {
      return [
        { period: 'Seg', revenue: 8200, subscriptions: 145, growth: 2.1 },
        { period: 'Ter', revenue: 9100, subscriptions: 152, growth: 11.0 },
        { period: 'Qua', revenue: 8800, subscriptions: 148, growth: -3.3 },
        { period: 'Qui', revenue: 9500, subscriptions: 156, growth: 8.0 },
        { period: 'Sex', revenue: 10200, subscriptions: 164, growth: 7.4 },
        { period: 'Sáb', revenue: 11100, subscriptions: 172, growth: 8.8 },
        { period: 'Dom', revenue: 9800, subscriptions: 168, growth: -11.7 }
      ];
    }
    
    if (dateRange === '90') {
      return [
        { period: 'Jan', revenue: 235000, subscriptions: 2100, growth: 5.2 },
        { period: 'Fev', revenue: 258000, subscriptions: 2250, growth: 9.8 },
        { period: 'Mar', revenue: 284000, subscriptions: 2400, growth: 10.1 },
        { period: 'Abr', revenue: 298000, subscriptions: 2480, growth: 4.9 },
        { period: 'Mai', revenue: 315000, subscriptions: 2580, growth: 5.7 },
        { period: 'Jun', revenue: 342000, subscriptions: 2720, growth: 8.6 }
      ];
    }

    // Default 30 dias
    return [
      { period: 'Sem 1', revenue: 68000, subscriptions: 580, growth: 3.2 },
      { period: 'Sem 2', revenue: 72000, subscriptions: 620, growth: 5.9 },
      { period: 'Sem 3', revenue: 75000, subscriptions: 640, growth: 4.2 },
      { period: 'Sem 4', revenue: 82000, subscriptions: 690, growth: 9.3 }
    ];
  };

  const data = getChartData();

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-4 shadow-lg">
          <p className="font-medium text-foreground">{label}</p>
          <p className="text-sm text-blue-600">
            Receita: €{payload[0].value.toLocaleString()}
          </p>
          <p className="text-sm text-green-600">
            Subscrições: {payload[1]?.value || 0}
          </p>
          <p className="text-sm text-purple-600">
            Crescimento: {payload[2]?.value || 0}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="period" 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
            <Line
              type="monotone"
              dataKey="subscriptions"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">
            €{data.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Receita Total</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {data.reduce((acc, curr) => acc + curr.subscriptions, 0)}
          </p>
          <p className="text-sm text-muted-foreground">Subscrições</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            +{(data.reduce((acc, curr) => acc + curr.growth, 0) / data.length).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground">Crescimento Médio</p>
        </div>
      </div>
    </div>
  );
};
