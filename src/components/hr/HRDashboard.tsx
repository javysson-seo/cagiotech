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
import { useStaff } from '@/hooks/useStaff';

export const HRDashboard: React.FC = () => {
  const { staff, loading } = useStaff();
  
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

  const recentActivities = [
    {
      id: 1,
      type: 'contratacao',
      title: 'Novo Personal Trainer contratado',
      description: 'Ana Costa foi adicionada à equipa',
      time: 'Há 2 horas',
      status: 'success'
    },
    {
      id: 2,
      type: 'documento',
      title: 'Documentos pendentes',
      description: '3 contratos aguardam assinatura',
      time: 'Há 4 horas',
      status: 'warning'
    },
    {
      id: 3,
      type: 'ferias',
      title: 'Pedido de férias aprovado',
      description: 'Carlos Santos - 2 semanas em Agosto',
      time: 'Há 1 dia',
      status: 'info'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Reunião de equipa',
      date: '2024-02-15',
      time: '10:00',
      type: 'meeting'
    },
    {
      id: 2,
      title: 'Avaliação de performance - Pedro Silva',
      date: '2024-02-16',
      time: '14:30',
      type: 'evaluation'
    },
    {
      id: 3,
      title: 'Entrevista - Candidato Personal Trainer',
      date: '2024-02-17',
      time: '16:00',
      type: 'interview'
    }
  ];

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recursos Humanos</h1>
          <p className="text-muted-foreground">
            Gestão de pessoal e recursos humanos
          </p>
        </div>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          Relatórios
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
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
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                }`}>
                  <span className="font-medium">{stat.change}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {stat.description}
                </span>
              </div>
            </CardContent>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-green-600"></div>
          </Card>
        ))}
      </div>

      {/* Tabs Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="staff">Pessoal</TabsTrigger>
          <TabsTrigger value="payroll">Folha de Pagamento</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="schedule">Horários</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Atividades Recentes */}
            <Card>
              <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    {getStatusIcon(activity.status)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Próximos Eventos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximos Eventos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {event.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {event.date}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {event.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Gestão de Documentos
                </h3>
                <p className="text-muted-foreground mb-4">
                  Contratos, documentos pessoais e certificações
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Ver Documentos
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Gestão de Horários
                </h3>
                <p className="text-muted-foreground mb-4">
                  Turnos, férias e gestão de tempo de trabalho
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  Ver Horários
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};