
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Euro, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Plus,
  Download
} from 'lucide-react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';

const FinancialContent: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  const financialStats = [
    {
      title: 'Receita Mês',
      value: '€8,450',
      change: '+15%',
      trend: 'up',
      icon: Euro,
      description: 'vs mês anterior'
    },
    {
      title: 'Despesas',
      value: '€3,200',
      change: '+5%',
      trend: 'up',
      icon: TrendingDown,
      description: 'vs mês anterior'
    },
    {
      title: 'Lucro Líquido',
      value: '€5,250',
      change: '+22%',
      trend: 'up',
      icon: TrendingUp,
      description: 'vs mês anterior'
    },
    {
      title: 'A Receber',
      value: '€1,230',
      change: '8 pendentes',
      trend: 'neutral',
      icon: CreditCard,
      description: 'pagamentos'
    }
  ];

  const recentPayments = [
    { name: 'João Silva', amount: '€45', status: 'paid', date: 'Hoje' },
    { name: 'Maria Santos', amount: '€60', status: 'pending', date: 'Ontem' },
    { name: 'Pedro Costa', amount: '€45', status: 'overdue', date: '3 dias' },
    { name: 'Ana Rodrigues', amount: '€50', status: 'paid', date: 'Hoje' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-[#bed700] text-black';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'overdue': return 'Atrasado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col">
        <BoxHeader />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
                <p className="text-muted-foreground mt-1">
                  Gestão financeira da sua BOX
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Relatório
                </Button>
                <Button className="bg-[#bed700] hover:bg-[#a5c400] text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Transação
                </Button>
              </div>
            </div>

            {/* Dashboard Financeiro - 4 cards conforme PRD */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {financialStats.map((stat) => (
                <Card key={stat.title} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground mb-1">
                      {stat.value}
                    </div>
                    <div className="flex items-center space-x-2">
                      {stat.trend !== 'neutral' && (
                        <div className={`flex items-center space-x-1 text-sm ${
                          stat.trend === 'up' ? 'text-[#bed700]' : 'text-red-600'
                        }`}>
                          {stat.trend === 'up' ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          <span className="font-medium">{stat.change}</span>
                        </div>
                      )}
                      {stat.trend === 'neutral' && (
                        <span className="text-sm font-medium text-orange-600">{stat.change}</span>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {stat.description}
                      </span>
                    </div>
                  </CardContent>
                  <div className={`absolute bottom-0 left-0 w-full h-1 ${
                    stat.trend === 'up' ? 'bg-[#bed700]' : 
                    stat.trend === 'down' ? 'bg-red-500' : 'bg-orange-500'
                  }`}></div>
                </Card>
              ))}
            </div>

            {/* Seções Principais */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pagamentos Recentes */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Pagamentos Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentPayments.map((payment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-[#bed700]/20 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-[#bed700]" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{payment.name}</p>
                            <p className="text-sm text-muted-foreground">{payment.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold text-foreground">{payment.amount}</span>
                          <Badge className={getStatusColor(payment.status)}>
                            {getStatusText(payment.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ações Rápidas Financeiras */}
              <Card>
                <CardHeader>
                  <CardTitle>Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-[#bed700]/10 hover:bg-[#bed700]/20 text-foreground border-0">
                    <CreditCard className="h-4 w-4 mr-2 text-[#bed700]" />
                    Lançar Receita
                  </Button>
                  <Button className="w-full justify-start bg-red-50 hover:bg-red-100 text-foreground border-0">
                    <TrendingDown className="h-4 w-4 mr-2 text-red-600" />
                    Lançar Despesa
                  </Button>
                  <Button className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-foreground border-0">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    Gerir Mensalidades
                  </Button>
                  <Button className="w-full justify-start bg-orange-50 hover:bg-orange-100 text-foreground border-0">
                    <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                    Agendar Pagamento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export const Financial: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <FinancialContent />
    </AreaThemeProvider>
  );
};
