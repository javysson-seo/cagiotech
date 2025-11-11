import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  UserPlus, 
  Clock, 
  TrendingUp, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  DollarSign
} from 'lucide-react';
import { StaffList } from './StaffList';
import { PayrollManagement } from './PayrollManagement';
import { TimeOffRequests } from './TimeOffRequests';
import { StaffEventsCalendar } from './StaffEventsCalendar';
import { useStaff } from '@/hooks/useStaff';
import { useHRActivities } from '@/hooks/useHRActivities';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const HRDashboard: React.FC = () => {
  const { staff, loading } = useStaff();
  const { activities, loading: activitiesLoading } = useHRActivities();
  
  // Calculate real KPIs from staff data
  const activeStaff = staff.filter(s => s.status === 'active').length;
  const thisMonthHires = staff.filter(s => {
    if (!s.hire_date) return false;
    const hireDate = new Date(s.hire_date);
    const now = new Date();
    return hireDate.getMonth() === now.getMonth() && hireDate.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      title: 'Total Funcionários',
      value: staff.length.toString(),
      change: `+${thisMonthHires}`,
      trend: 'up' as const,
      icon: Users,
      description: 'ativos'
    },
    {
      title: 'Funcionários Ativos',
      value: activeStaff.toString(),
      change: '+2',
      trend: 'up' as const,
      icon: CheckCircle,
      description: 'este mês'
    },
    {
      title: 'Novos Este Mês',
      value: thisMonthHires.toString(),
      change: `${thisMonthHires > 0 ? '+' : ''}${thisMonthHires}`,
      trend: 'up' as const,
      icon: UserPlus,
      description: 'contratados'
    },
    {
      title: 'Departamentos',
      value: new Set(staff.map(s => s.department)).size.toString(),
      change: '',
      trend: 'up' as const,
      icon: TrendingUp,
      description: 'diferentes'
    }
  ];

  // Get real recent activities
  const recentActivities = activities.slice(0, 5).map(activity => ({
    id: activity.id,
    type: activity.activity_type,
    title: activity.title,
    description: activity.description || '',
    time: format(new Date(activity.created_at), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR }),
    status: activity.activity_type.includes('approved') ? 'success' : 
            activity.activity_type.includes('rejected') ? 'warning' : 'info'
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold text-cagio-green">Recursos Humanos</h1>
          <p className="text-muted-foreground mt-1">
            Gestão completa de pessoal e recursos humanos
          </p>
        </div>
        <Button variant="outline" className="border-cagio-green text-cagio-green hover:bg-cagio-green-light">
          <FileText className="h-4 w-4 mr-2" />
          Relatórios
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-l-4 border-l-cagio-green hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-full bg-cagio-green-light">
                <stat.icon className="h-4 w-4 text-cagio-green" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-2">
                {stat.value}
              </div>
              <div className="flex items-center space-x-2">
                {stat.change && (
                  <div className={`flex items-center space-x-1 text-sm font-semibold ${
                    stat.trend === 'up' ? 'text-cagio-green' : 
                    stat.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    <span>{stat.change}</span>
                  </div>
                )}
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-cagio-green-light">
          <TabsTrigger value="overview" className="data-[state=active]:bg-cagio-green data-[state=active]:text-white">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="staff" className="data-[state=active]:bg-cagio-green data-[state=active]:text-white">
            Pessoal
          </TabsTrigger>
          <TabsTrigger value="payroll" className="data-[state=active]:bg-cagio-green data-[state=active]:text-white">
            Folha de Pagamento
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-cagio-green data-[state=active]:text-white">
            Documentos
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-cagio-green data-[state=active]:text-white">
            Horários
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Atividades Recentes */}
            <Card className="border-t-4 border-t-cagio-green">
              <CardHeader className="bg-cagio-green-light/30">
                <CardTitle className="text-cagio-green">Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {recentActivities.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Nenhuma atividade recente
                  </p>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-cagio-green-light/20 transition-colors">
                      {getStatusIcon(activity.status)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                          {activity.title}
                        </p>
                        {activity.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {activity.description}
                          </p>
                        )}
                        <p className="text-xs text-cagio-green font-medium mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Pedidos de Férias - Preview */}
            <Card className="border-t-4 border-t-cagio-green">
              <CardHeader className="bg-cagio-green-light/30">
                <CardTitle className="text-cagio-green">Gestão de Férias e Licenças</CardTitle>
              </CardHeader>
              <CardContent className="p-12">
                <div className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-cagio-green-light mb-4">
                    <Calendar className="h-12 w-12 text-cagio-green" />
                  </div>
                  <h3 className="text-xl font-bold text-cagio-green mb-2">
                    Pedidos de Férias e Licenças
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Gerencie pedidos de férias, licenças médicas e outras ausências
                  </p>
                  <Button 
                    className="bg-cagio-green hover:bg-cagio-green-dark text-white"
                    onClick={() => {
                      const scheduleTab = document.querySelector('[value="schedule"]');
                      if (scheduleTab) (scheduleTab as HTMLElement).click();
                    }}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Ver Pedidos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="staff">
          <StaffList />
        </TabsContent>

        <TabsContent value="payroll">
          <PayrollManagement />
        </TabsContent>

        <TabsContent value="documents">
          <Card className="border-t-4 border-t-cagio-green">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-cagio-green-light mb-4">
                  <FileText className="h-12 w-12 text-cagio-green" />
                </div>
                <h3 className="text-xl font-bold text-cagio-green mb-2">
                  Gestão de Documentos
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Contratos, documentos pessoais, certificações e arquivos importantes
                </p>
                <Button className="bg-cagio-green hover:bg-cagio-green-dark text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Documentos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <TimeOffRequests />
            <StaffEventsCalendar />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};