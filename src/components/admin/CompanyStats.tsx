import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Building2, Users, TrendingUp, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export const CompanyStats: React.FC = () => {
  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies-with-stats'],
    queryFn: async () => {
      const { data: companiesData } = await supabase
        .from('companies')
        .select('id, name, city, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      if (!companiesData) return [];

      const companiesWithStats = await Promise.all(
        companiesData.map(async (company) => {
          const [athletes, payments, trainers] = await Promise.all([
            supabase
              .from('athletes')
              .select('id', { count: 'exact', head: true })
              .eq('company_id', company.id),
            supabase
              .from('athlete_payments')
              .select('amount')
              .eq('company_id', company.id)
              .eq('status', 'paid')
              .gte('paid_date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
            supabase
              .from('trainers')
              .select('id', { count: 'exact', head: true })
              .eq('company_id', company.id),
          ]);

          const revenue = payments.data?.reduce((sum, p) => sum + Number(p.amount || 0), 0) || 0;

          return {
            ...company,
            athleteCount: athletes.count || 0,
            trainerCount: trainers.count || 0,
            revenue,
          };
        })
      );

      return companiesWithStats;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Empresas - Estatísticas</CardTitle>
          <CardDescription>Carregando dados...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-cagio-green" />
          Empresas - Estatísticas Detalhadas
        </CardTitle>
        <CardDescription>
          Visão geral do desempenho de cada empresa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {companies?.map((company) => (
              <div
                key={company.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-background to-cagio-green/5 border-cagio-green/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">{company.name}</h3>
                    <p className="text-sm text-muted-foreground">{company.city || 'Localização não definida'}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Registado em {new Date(company.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-cagio-green/10 text-foreground border-cagio-green/30">
                    Ativo
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-card rounded border">
                    <div className="p-2 bg-cagio-green/10 rounded">
                      <Users className="h-4 w-4 text-cagio-green" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Atletas</p>
                      <p className="text-lg font-bold text-cagio-green">{company.athleteCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-card rounded border">
                    <div className="p-2 bg-cagio-green/10 rounded">
                      <TrendingUp className="h-4 w-4 text-cagio-green" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Trainers</p>
                      <p className="text-lg font-bold text-cagio-green">{company.trainerCount}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-card rounded border">
                    <div className="p-2 bg-cagio-green/10 rounded">
                      <DollarSign className="h-4 w-4 text-cagio-green" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">30d</p>
                      <p className="text-lg font-bold text-cagio-green">€{company.revenue.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
