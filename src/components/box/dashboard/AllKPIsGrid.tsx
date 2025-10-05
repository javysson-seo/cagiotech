import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Euro, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Activity,
  Calendar,
  CheckCircle,
  Target,
  Percent,
  DollarSign,
  UserPlus,
  UserMinus,
  BarChart3,
  Clock
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: any;
  description?: string;
  progress?: number;
  badge?: string;
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  trend = 'neutral',
  icon: Icon, 
  description,
  progress,
  badge
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">
          {value}
        </div>
        {change && (
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center space-x-1 text-sm ${
              trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
            }`}>
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : trend === 'down' ? (
                <TrendingDown className="h-3 w-3" />
              ) : null}
              <span className="font-medium">{change}</span>
            </div>
            {badge && (
              <Badge variant="outline" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
        )}
        {progress !== undefined && (
          <div className="space-y-1">
            <Progress value={progress} className="h-2" />
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface AllKPIsGridProps {
  kpis: {
    revenue: number;
    revenueGrowth: number;
    expenses: number;
    profit: number;
    profitGrowth: number;
    profitMargin: number;
    mrr: number;
    arr: number;
    averageTicket: number;
    ltv: number;
    cac: number;
    ltvCacRatio: number;
    totalMembers: number;
    activeMembers: number;
    newMembers: number;
    memberGrowth: number;
    churnRate: number;
    retentionRate: number;
    canceledMembers: number;
    totalClasses: number;
    occupationRate: number;
    totalBookings: number;
    attendanceRate: number;
    checkIns: number;
    checkInGrowth: number;
    avgCheckInsPerMember: number;
  };
  isLoading?: boolean;
}

export const AllKPIsGrid: React.FC<AllKPIsGridProps> = ({ kpis, isLoading }) => {
  const formatCurrency = (value: number) => {
    return `€${value.toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPercentage = (value: number) => {
    return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return value.toFixed(0);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {Array.from({ length: 20 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Financial KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Euro className="h-5 w-5" />
          Métricas Financeiras
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <KPICard
            title="Receita Total"
            value={formatCurrency(kpis.revenue)}
            change={formatPercentage(kpis.revenueGrowth)}
            trend={kpis.revenueGrowth >= 0 ? 'up' : 'down'}
            icon={Euro}
            description="vs. período anterior"
            progress={Math.min(100, Math.abs(kpis.revenueGrowth) + 50)}
          />
          <KPICard
            title="Lucro Líquido"
            value={formatCurrency(kpis.profit)}
            change={formatPercentage(kpis.profitGrowth)}
            trend={kpis.profitGrowth >= 0 ? 'up' : 'down'}
            icon={DollarSign}
            description="receita - despesas"
          />
          <KPICard
            title="Margem de Lucro"
            value={`${kpis.profitMargin.toFixed(1)}%`}
            icon={Percent}
            description="lucro / receita"
            progress={kpis.profitMargin}
            badge={kpis.profitMargin > 20 ? 'Excelente' : kpis.profitMargin > 10 ? 'Bom' : 'Atenção'}
          />
          <KPICard
            title="MRR"
            value={formatCurrency(kpis.mrr)}
            icon={BarChart3}
            description="Receita Recorrente Mensal"
          />
          <KPICard
            title="ARR"
            value={formatCurrency(kpis.arr)}
            icon={BarChart3}
            description="Receita Recorrente Anual"
          />
          <KPICard
            title="Ticket Médio"
            value={formatCurrency(kpis.averageTicket)}
            icon={Euro}
            description="valor médio por pagamento"
          />
          <KPICard
            title="LTV"
            value={formatCurrency(kpis.ltv)}
            icon={Target}
            description="Lifetime Value"
          />
          <KPICard
            title="CAC"
            value={formatCurrency(kpis.cac)}
            icon={UserPlus}
            description="Custo de Aquisição"
          />
          <KPICard
            title="LTV / CAC"
            value={kpis.ltvCacRatio.toFixed(1)}
            icon={BarChart3}
            badge={kpis.ltvCacRatio > 3 ? 'Saudável' : 'Atenção'}
            description="ideal > 3"
          />
          <KPICard
            title="Despesas"
            value={formatCurrency(kpis.expenses)}
            icon={TrendingDown}
            description="custos operacionais"
          />
        </div>
      </div>

      {/* Member KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Métricas de Membros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <KPICard
            title="Membros Ativos"
            value={formatNumber(kpis.activeMembers)}
            change={formatPercentage(kpis.memberGrowth)}
            trend={kpis.memberGrowth >= 0 ? 'up' : 'down'}
            icon={Users}
            description="membros ativos"
          />
          <KPICard
            title="Novos Membros"
            value={formatNumber(kpis.newMembers)}
            icon={UserPlus}
            description="neste período"
            trend="up"
          />
          <KPICard
            title="Taxa de Churn"
            value={`${kpis.churnRate.toFixed(1)}%`}
            icon={UserMinus}
            badge={kpis.churnRate < 5 ? 'Excelente' : kpis.churnRate < 10 ? 'Bom' : 'Atenção'}
            description="cancelamentos"
            trend={kpis.churnRate > 10 ? 'down' : 'neutral'}
          />
          <KPICard
            title="Taxa de Retenção"
            value={`${kpis.retentionRate.toFixed(1)}%`}
            icon={Target}
            progress={kpis.retentionRate}
            description="membros retidos"
            badge={kpis.retentionRate > 90 ? 'Excelente' : 'Bom'}
          />
          <KPICard
            title="Cancelamentos"
            value={formatNumber(kpis.canceledMembers)}
            icon={UserMinus}
            description="neste período"
            trend="down"
          />
          <KPICard
            title="Total de Membros"
            value={formatNumber(kpis.totalMembers)}
            icon={Users}
            description="total cadastrados"
          />
        </div>
      </div>

      {/* Classes & Engagement KPIs */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Métricas de Aulas & Engajamento
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <KPICard
            title="Aulas Realizadas"
            value={formatNumber(kpis.totalClasses)}
            icon={Calendar}
            description="neste período"
          />
          <KPICard
            title="Taxa de Ocupação"
            value={`${kpis.occupationRate.toFixed(1)}%`}
            icon={Activity}
            progress={kpis.occupationRate}
            description="capacidade utilizada"
            badge={kpis.occupationRate > 80 ? 'Alto' : kpis.occupationRate > 60 ? 'Médio' : 'Baixo'}
          />
          <KPICard
            title="Total de Reservas"
            value={formatNumber(kpis.totalBookings)}
            icon={CheckCircle}
            description="reservas confirmadas"
          />
          <KPICard
            title="Taxa de Presença"
            value={`${kpis.attendanceRate.toFixed(1)}%`}
            icon={CheckCircle}
            progress={kpis.attendanceRate}
            description="comparecimento"
            badge={kpis.attendanceRate > 85 ? 'Excelente' : 'Bom'}
          />
          <KPICard
            title="Check-ins"
            value={formatNumber(kpis.checkIns)}
            change={formatPercentage(kpis.checkInGrowth)}
            trend={kpis.checkInGrowth >= 0 ? 'up' : 'down'}
            icon={Clock}
            description="check-ins realizados"
          />
          <KPICard
            title="Média Check-ins/Membro"
            value={kpis.avgCheckInsPerMember.toFixed(1)}
            icon={Activity}
            description="frequência média"
            badge={kpis.avgCheckInsPerMember > 10 ? 'Alto engajamento' : 'Normal'}
          />
        </div>
      </div>
    </div>
  );
};
