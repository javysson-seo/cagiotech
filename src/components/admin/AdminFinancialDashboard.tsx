import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminFinancial } from '@/hooks/useAdminFinancial';
import { DollarSign, TrendingUp, Building2, Clock } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

export const AdminFinancialDashboard = () => {
  const { metrics, isLoading } = useAdminFinancial();

  if (isLoading) {
    return <div className="text-center py-8">A carregar métricas financeiras...</div>;
  }

  const cards = [
    {
      title: 'MRR Total',
      value: metrics?.mrr || 0,
      icon: DollarSign,
      prefix: '€',
      description: 'Receita Mensal Recorrente',
      color: 'text-cagio-green',
      bgColor: 'bg-cagio-green-light',
    },
    {
      title: 'ARR Total',
      value: metrics?.arr || 0,
      icon: TrendingUp,
      prefix: '€',
      description: 'Receita Anual Recorrente',
      color: 'text-cagio-green',
      bgColor: 'bg-cagio-green-light',
    },
    {
      title: 'Total de Empresas',
      value: metrics?.totalCompanies || 0,
      icon: Building2,
      description: 'Empresas registradas',
      color: 'text-cagio-green',
      bgColor: 'bg-cagio-green-light',
    },
    {
      title: 'Subscrições Ativas',
      value: metrics?.activeSubscriptions || 0,
      icon: CheckCircle,
      description: 'Empresas com subscrição ativa',
      color: 'text-cagio-green',
      bgColor: 'bg-cagio-green-light',
    },
    {
      title: 'Novas Este Mês',
      value: metrics?.newCompanies || 0,
      icon: TrendingUp,
      description: 'Empresas cadastradas este mês',
      color: 'text-cagio-green',
      bgColor: 'bg-cagio-green-light',
    },
    {
      title: 'Aprovações Pendentes',
      value: metrics?.pendingApprovals || 0,
      icon: Clock,
      description: 'Aguardando aprovação',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title} className="border-cagio-green/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {card.prefix}
              <AnimatedCounter end={card.value} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const CheckCircle = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);