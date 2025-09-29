import React from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  AlertCircle, 
  BarChart3, 
  Plus, 
  FileText, 
  Download 
} from 'lucide-react';

const FinancialContent: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Financeiro</h1>
              <p className="text-muted-foreground">
                Gestão financeira e contabilidade
              </p>
            </div>
            
            {/* KPIs Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 45.231</div>
                  <p className="text-xs text-muted-foreground">+20.1% em relação ao mês anterior</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Despesas</CardTitle>
                  <TrendingDown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 23.150</div>
                  <p className="text-xs text-muted-foreground">+12.5% em relação ao mês anterior</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ 22.081</div>
                  <p className="text-xs text-muted-foreground">+15.2% em relação ao mês anterior</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Inadimplência</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2%</div>
                  <p className="text-xs text-muted-foreground">-2.1% em relação ao mês anterior</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Receitas e Despesas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full bg-muted/50 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-16 w-16 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Transações Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Mensalidade João Silva</p>
                        <p className="text-xs text-muted-foreground">Hoje</p>
                      </div>
                      <div className="text-sm font-medium text-green-600">+R$ 150,00</div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Aluguel Academia</p>
                        <p className="text-xs text-muted-foreground">Ontem</p>
                      </div>
                      <div className="text-sm font-medium text-red-600">-R$ 2.500,00</div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Mensalidade Maria Santos</p>
                        <p className="text-xs text-muted-foreground">Ontem</p>
                      </div>
                      <div className="text-sm font-medium text-green-600">+R$ 200,00</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Management Tabs */}
            <Tabs defaultValue="receivables" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="receivables">Recebíveis</TabsTrigger>
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
                <TabsTrigger value="config">Configurações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="receivables" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Contas a Receber</CardTitle>
                    <CardDescription>Gerencie mensalidades e pagamentos pendentes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">João Silva - Mensalidade Janeiro</p>
                          <p className="text-sm text-muted-foreground">Vencimento: 15/01/2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ 150,00</p>
                          <Badge variant="destructive">Vencido</Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Maria Santos - Mensalidade Janeiro</p>
                          <p className="text-sm text-muted-foreground">Vencimento: 20/01/2024</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">R$ 200,00</p>
                          <Badge variant="secondary">Pendente</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="expenses" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Controle de Despesas</CardTitle>
                    <CardDescription>Registre e acompanhe todas as despesas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Despesa
                      </Button>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span>Aluguel</span>
                          <span className="font-medium">R$ 2.500,00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span>Energia Elétrica</span>
                          <span className="font-medium">R$ 380,00</span>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded">
                          <span>Equipamentos</span>
                          <span className="font-medium">R$ 1.200,00</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Relatórios Financeiros</CardTitle>
                    <CardDescription>Gere relatórios detalhados</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col">
                        <FileText className="h-6 w-6 mb-2" />
                        Relatório Mensal
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Download className="h-6 w-6 mb-2" />
                        Fluxo de Caixa
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <TrendingUp className="h-6 w-6 mb-2" />
                        DRE
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <BarChart3 className="h-6 w-6 mb-2" />
                        Análise de Receitas
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="config" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações Financeiras</CardTitle>
                    <CardDescription>Configure parâmetros do módulo financeiro</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Dia de Vencimento Padrão</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o dia" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">Dia 5</SelectItem>
                            <SelectItem value="10">Dia 10</SelectItem>
                            <SelectItem value="15">Dia 15</SelectItem>
                            <SelectItem value="20">Dia 20</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Taxa de Juros (%)</Label>
                        <Input type="number" placeholder="2.0" />
                      </div>
                      
                      <Button>Salvar Configurações</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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