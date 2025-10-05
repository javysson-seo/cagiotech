import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth, parseISO } from 'date-fns';

interface PeakHoursChartProps {
  companyId: string;
}

export const PeakHoursChart: React.FC<PeakHoursChartProps> = ({ companyId }) => {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['peak-hours', companyId],
    queryFn: async () => {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const { data: checkIns } = await supabase
        .from('athlete_check_ins')
        .select('check_in_time')
        .eq('company_id', companyId)
        .gte('check_in_time', format(monthStart, 'yyyy-MM-dd'))
        .lte('check_in_time', format(monthEnd, 'yyyy-MM-dd'));

      const hourMap = (checkIns || []).reduce((acc: Record<number, number>, checkIn) => {
        const hour = parseISO(checkIn.check_in_time).getHours();
        acc[hour] = (acc[hour] || 0) + 1;
        return acc;
      }, {});

      const hours = Array.from({ length: 24 }, (_, i) => i);
      return hours.map((hour) => ({
        hora: `${hour.toString().padStart(2, '0')}:00`,
        checkIns: hourMap[hour] || 0,
      }));
    },
    enabled: !!companyId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Horários de Pico</CardTitle>
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
        <CardTitle>Horários de Pico (Este Mês)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="hora" className="text-xs" angle={-45} textAnchor="end" height={80} />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="checkIns" fill="hsl(var(--primary))" name="Check-ins" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
