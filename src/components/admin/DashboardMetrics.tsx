import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, TrendingUp, DollarSign, Activity, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const DashboardMetrics: React.FC = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [companies, athletes, trainers, payments, checkIns, subscriptions] = await Promise.all([
        supabase.from('companies').select('id', { count: 'exact', head: true }),
        supabase.from('athletes').select('id', { count: 'exact', head: true }),
        supabase.from('trainers').select('id', { count: 'exact', head: true }),
        supabase.from('athlete_payments')
          .select('amount, status')
          .eq('status', 'paid')
          .gte('paid_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('athlete_check_ins')
          .select('id', { count: 'exact', head: true })
          .gte('check_in_time', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('athlete_subscriptions')
          .select('id, status', { count: 'exact', head: true })
          .eq('status', 'active'),
      ]);

      const totalRevenue = payments.data?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

      return {
        companies: companies.count || 0,
        athletes: athletes.count || 0,
        trainers: trainers.count || 0,
        totalUsers: (athletes.count || 0) + (trainers.count || 0),
        revenue: totalRevenue,
        checkIns: checkIns.count || 0,
        activeSubscriptions: subscriptions.count || 0,
      };
    },
  });

  const metrics = [
    { 
      title: 'Total de Empresas', 
      value: stats?.companies.toString() || '0', 
      icon: Building2, 
      description: 'boxes registadas',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'Total de Atletas', 
      value: stats?.athletes.toString() || '0', 
      icon: Users, 
      description: 'atletas no sistema',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Treinadores Ativos', 
      value: stats?.trainers.toString() || '0', 
      icon: UserCheck, 
      description: 'treinadores',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Receita (30 dias)', 
      value: `€${stats?.revenue.toFixed(2) || '0.00'}`, 
      icon: DollarSign, 
      description: 'receita total',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      title: 'Check-ins (30 dias)', 
      value: stats?.checkIns.toString() || '0', 
      icon: Activity, 
      description: 'check-ins realizados',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    { 
      title: 'Subscrições Ativas', 
      value: stats?.activeSubscriptions.toString() || '0', 
      icon: CheckCircle, 
      description: 'subscrições ativas',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <Card key={metric.title} className="hover:shadow-lg transition-shadow border-l-4" style={{ borderLeftColor: metric.color.replace('text-', '') }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-1 ${metric.color}`}>{metric.value}</div>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
