import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';

interface FinancialMetricsCardsProps {
  metrics: {
    currentRevenue: number;
    currentExpenses: number;
    currentProfit: number;
    revenueGrowth: number;
    expenseGrowth: number;
    profitGrowth: number;
    defaultRate: number;
    overdueCount: number;
  };
}

export const FinancialMetricsCards: React.FC<FinancialMetricsCardsProps> = ({ metrics }) => {
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-PT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatPercentage = (value: number) => {
    return value >= 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{formatCurrency(metrics.currentRevenue)}</div>
          <p className={`text-xs ${metrics.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(metrics.revenueGrowth)} vs mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesas</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{formatCurrency(metrics.currentExpenses)}</div>
          <p className={`text-xs ${metrics.expenseGrowth <= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(metrics.expenseGrowth)} vs mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">€{formatCurrency(metrics.currentProfit)}</div>
          <p className={`text-xs ${metrics.profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercentage(metrics.profitGrowth)} vs mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.defaultRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">{metrics.overdueCount} pagamentos em atraso</p>
        </CardContent>
      </Card>
    </div>
  );
};