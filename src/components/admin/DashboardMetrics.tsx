
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, TrendingUp, ArrowUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const DashboardMetrics: React.FC = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [companies, athletes, trainers] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact', head: true }),
        supabase.from('athletes').select('id', { count: 'exact', head: true }),
        supabase.from('trainers').select('id', { count: 'exact', head: true }),
      ]);
      return {
        companies: companies.count || 0,
        athletes: athletes.count || 0,
        trainers: trainers.count || 0,
        totalUsers: (athletes.count || 0) + (trainers.count || 0),
      };
    },
  });

  const metrics = [
    { title: 'Empresas', value: stats?.companies.toString() || '0', icon: Building2, description: 'registradas' },
    { title: 'Atletas', value: stats?.athletes.toString() || '0', icon: Users, description: 'no sistema' },
    { title: 'Treinadores', value: stats?.trainers.toString() || '0', icon: Users, description: 'ativos' },
    { title: 'Total Usuários', value: stats?.totalUsers.toString() || '0', icon: TrendingUp, description: 'no total' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground mb-1">{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
