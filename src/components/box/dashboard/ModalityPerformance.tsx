import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface ModalityPerformanceProps {
  companyId: string;
}

export const ModalityPerformance: React.FC<ModalityPerformanceProps> = ({ companyId }) => {
  const { data: chartData = [], isLoading } = useQuery({
    queryKey: ['modality-performance', companyId],
    queryFn: async () => {
      const now = new Date();
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);

      const { data: classes } = await supabase
        .from('classes')
        .select(`
          *,
          modalities(name),
          class_bookings(*),
          class_check_ins(*)
        `)
        .eq('company_id', companyId)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'));

      const modalityMap = (classes || []).reduce((acc: Record<string, any>, cls: any) => {
        const modalityName = cls.modalities?.name || 'Sem modalidade';
        if (!acc[modalityName]) {
          acc[modalityName] = {
            name: modalityName,
            aulas: 0,
            reservas: 0,
            checkIns: 0,
            capacidade: 0,
          };
        }
        acc[modalityName].aulas += 1;
        acc[modalityName].reservas += cls.class_bookings?.length || 0;
        acc[modalityName].checkIns += cls.class_check_ins?.length || 0;
        acc[modalityName].capacidade += cls.max_capacity;
        return acc;
      }, {});

      return Object.values(modalityMap).map((m: any) => ({
        ...m,
        ocupação: m.capacidade > 0 ? Math.round((m.reservas / m.capacidade) * 100) : 0,
      }));
    },
    enabled: !!companyId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance de Modalidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse bg-muted rounded"></div>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance de Modalidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            Nenhuma aula registrada este mês
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance de Modalidades (Este Mês)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis type="number" className="text-xs" />
            <YAxis dataKey="name" type="category" className="text-xs" width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="reservas" fill="hsl(var(--chart-1))" name="Reservas" />
            <Bar dataKey="checkIns" fill="hsl(var(--chart-2))" name="Check-ins" />
            <Line dataKey="ocupação" stroke="hsl(var(--primary))" strokeWidth={2} name="Ocupação %" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
