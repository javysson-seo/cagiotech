import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, eachDayOfInterval, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CheckInsChartProps {
  companyId: string;
}

export const CheckInsChart: React.FC<CheckInsChartProps> = ({ companyId }) => {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['checkins-chart', companyId],
    queryFn: async () => {
      const now = new Date();
      const last30Days = eachDayOfInterval({
        start: subDays(now, 29),
        end: now,
      });

      const dailyData = await Promise.all(
        last30Days.map(async (day) => {
          const { data: morningCheckIns } = await supabase
            .from('athlete_check_ins')
            .select('id')
            .eq('company_id', companyId)
            .gte('check_in_time', format(day, 'yyyy-MM-dd') + ' 00:00:00')
            .lt('check_in_time', format(day, 'yyyy-MM-dd') + ' 12:00:00');

          const { data: afternoonCheckIns } = await supabase
            .from('athlete_check_ins')
            .select('id')
            .eq('company_id', companyId)
            .gte('check_in_time', format(day, 'yyyy-MM-dd') + ' 12:00:00')
            .lt('check_in_time', format(day, 'yyyy-MM-dd') + ' 18:00:00');

          const { data: eveningCheckIns } = await supabase
            .from('athlete_check_ins')
            .select('id')
            .eq('company_id', companyId)
            .gte('check_in_time', format(day, 'yyyy-MM-dd') + ' 18:00:00')
            .lt('check_in_time', format(day, 'yyyy-MM-dd') + ' 23:59:59');

          return {
            date: format(day, 'dd/MM', { locale: ptBR }),
            manhã: morningCheckIns?.length || 0,
            tarde: afternoonCheckIns?.length || 0,
            noite: eveningCheckIns?.length || 0,
            total: (morningCheckIns?.length || 0) + (afternoonCheckIns?.length || 0) + (eveningCheckIns?.length || 0),
          };
        })
      );

      return dailyData;
    },
    enabled: !!companyId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check-ins por Período</CardTitle>
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
        <CardTitle>Check-ins por Período do Dia (Últimos 30 Dias)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Area type="monotone" dataKey="manhã" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" name="Manhã" />
            <Area type="monotone" dataKey="tarde" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" name="Tarde" />
            <Area type="monotone" dataKey="noite" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" name="Noite" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
