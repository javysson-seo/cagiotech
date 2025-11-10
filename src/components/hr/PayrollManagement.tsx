import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  Calendar, 
  FileText, 
  TrendingUp,
  Clock,
  Award
} from 'lucide-react';
import { PayrollConfigModal } from './PayrollConfigModal';
import { GeneratePayrollModal } from './GeneratePayrollModal';
import { useStaff } from '@/hooks/useStaff';
import { usePayroll } from '@/hooks/usePayroll';
import { useStaffPaymentConfig } from '@/hooks/useStaffPaymentConfig';
import { Loading } from '@/components/ui/loading';

export const PayrollManagement: React.FC = () => {
  const { staff } = useStaff();
  const { payrolls, loading: payrollsLoading, updatePayrollStatus } = usePayroll();
  const { configs } = useStaffPaymentConfig();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  // Calculate KPIs from real data
  const currentMonth = new Date().toISOString().slice(0, 7) + '-01';
  const currentMonthPayrolls = payrolls.filter(p => p.reference_month === currentMonth);
  
  const totalPayroll = currentMonthPayrolls.reduce((sum, p) => sum + p.gross_amount, 0);
  const pendingPayments = currentMonthPayrolls.filter(p => p.payment_status === 'pending').length;
  const averagePay = currentMonthPayrolls.length > 0 ? totalPayroll / currentMonthPayrolls.length : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Pago</Badge>;
      case 'pending':
        return <Badge variant="outline">Pendente</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
  };

  if (payrollsLoading) {
    return <Loading size="lg" text="Carregando folha de pagamento..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Folha de Pagamento</h2>
          <p className="text-muted-foreground">Gestão de salários e pagamentos</p>
        </div>
        <Button onClick={() => setShowGenerateModal(true)} className="gap-2">
          <FileText className="h-4 w-4" />
          Gerar Folha do Mês
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Folha Total</p>
                <h3 className="text-2xl font-bold">{formatCurrency(totalPayroll)}</h3>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Funcionários</p>
                <h3 className="text-2xl font-bold">{staff.length}</h3>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <h3 className="text-2xl font-bold">{pendingPayments}</h3>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Média/Pessoa</p>
                <h3 className="text-2xl font-bold">{formatCurrency(averagePay)}</h3>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList>
          <TabsTrigger value="current">Mês Atual</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Folha de {new Date().toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })}</CardTitle>
            </CardHeader>
            <CardContent>
              {currentMonthPayrolls.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground mb-4">Nenhuma folha gerada para este mês</p>
                  <Button onClick={() => setShowGenerateModal(true)}>
                    Gerar Folha do Mês
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentMonthPayrolls.map((payroll) => (
                    <div key={payroll.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{payroll.staff?.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {payroll.staff?.position}
                          {payroll.classes_taught && ` • ${payroll.classes_taught} aulas`}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          {payroll.hours_worked && (
                            <p className="text-sm text-muted-foreground">{payroll.hours_worked}h trabalhadas</p>
                          )}
                          <p className="font-medium">{formatCurrency(payroll.net_amount)}</p>
                        </div>
                        {getStatusBadge(payroll.payment_status)}
                        {payroll.payment_status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updatePayrollStatus(payroll.id!, 'paid')}
                          >
                            Marcar como Pago
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Folhas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Histórico de folhas de pagamento</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Pagamento por Funcionário</CardTitle>
            </CardHeader>
            <CardContent>
              {staff.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum funcionário cadastrado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {staff.map((member) => {
                    const config = configs.find(c => c.staff_id === member.id);
                    return (
                      <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {config ? (
                              <>
                                {config.payment_type === 'monthly_salary' && `€${config.base_amount} salário mensal`}
                                {config.payment_type === 'hourly' && `€${config.hourly_rate} por hora`}
                                {config.payment_type === 'per_class' && `€${config.per_class_rate} por aula`}
                                {config.payment_type === 'commission' && `${config.commission_percentage}% comissão`}
                                {config.payment_type === 'mixed' && `€${config.base_amount} + €${config.per_class_rate}/aula`}
                              </>
                            ) : (
                              'Sem configuração'
                            )}
                          </p>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedStaff(member);
                            setShowConfigModal(true);
                          }}
                        >
                          {config ? 'Editar' : 'Configurar'}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <PayrollConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        staff={selectedStaff}
      />

      <GeneratePayrollModal
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
      />
    </div>
  );
};
