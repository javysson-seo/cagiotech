import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, eachMonthOfInterval, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface MemberGrowthChartProps {
  companyId: string;
}

export const MemberGrowthChart: React.FC<MemberGrowthChartProps> = ({ companyId }) => {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['member-growth', companyId],
    queryFn: async () => {
      const now = new Date();
      const last6Months = eachMonthOfInterval({
        start: subMonths(now, 5),
        end: now,
      });

      const monthlyData = await Promise.all(
        last6Months.map(async (month) => {
          const monthStart = startOfMonth(month);
          const monthEnd = endOfMonth(month);

          // Get athletes created in this month
          const { data: newAthletes } = await supabase
            .from('athletes')
            .select('id')
            .eq('company_id', companyId)
            .gte('created_at', format(monthStart, 'yyyy-MM-dd'))
            .lte('created_at', format(monthEnd, 'yyyy-MM-dd'));

          // Get total active athletes at end of month
          const { data: activeAthletes } = await supabase
            .from('athletes')
            .select('id')
            .eq('company_id', companyId)
            .eq('status', 'active')
            .lte('created_at', format(monthEnd, 'yyyy-MM-dd'));

          // Get canceled athletes in this month
          const { data: canceledAthletes } = await supabase
            .from('athletes')
            .select('id')
            .eq('company_id', companyId)
            .eq('status', 'inactive')
            .gte('updated_at', format(monthStart, 'yyyy-MM-dd'))
            .lte('updated_at', format(monthEnd, 'yyyy-MM-dd'));

          return {
            month: format(month, 'MMM', { locale: ptBR }),
            novos: newAthletes?.length || 0,
            ativos: activeAthletes?.length || 0,
            cancelados: canceledAthletes?.length || 0,
          };
        })
      );

      return monthlyData;
    },
    enabled: !!companyId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Membros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Membros (Últimos 6 Meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="ativos" stroke="hsl(var(--primary))" name="Ativos" strokeWidth={2} />
            <Line type="monotone" dataKey="novos" stroke="hsl(var(--chart-2))" name="Novos" strokeWidth={2} />
            <Line type="monotone" dataKey="cancelados" stroke="hsl(var(--destructive))" name="Cancelados" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
