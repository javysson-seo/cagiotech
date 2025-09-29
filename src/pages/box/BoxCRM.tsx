
import React from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Target, 
  Plus, 
  Phone, 
  Mail, 
  BarChart3, 
  TrendingUp 
} from 'lucide-react';

const BoxCRMContent: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">CRM</h1>
              <p className="text-muted-foreground">
                Gestão de prospects e leads
              </p>
            </div>
            
            {/* CRM Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Prospects</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
                  <p className="text-xs text-muted-foreground">+15% este mês</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversões</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">Taxa: 18.1%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Follow-ups Hoje</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">5 pendentes</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa Sucesso</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">68%</div>
                  <p className="text-xs text-muted-foreground">+5% este mês</p>
                </CardContent>
              </Card>
            </div>

            {/* CRM Tabs */}
            <Tabs defaultValue="prospects" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="prospects">Prospects</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="activities">Atividades</TabsTrigger>
                <TabsTrigger value="reports">Relatórios</TabsTrigger>
              </TabsList>
              
              <TabsContent value="prospects" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Lista de Prospects</h3>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Novo Prospect
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      <div className="p-4 hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Ana Costa</h4>
                            <p className="text-sm text-muted-foreground">ana.costa@email.com</p>
                            <p className="text-sm text-muted-foreground">(11) 99999-9999</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="secondary">Novo</Badge>
                            <p className="text-sm text-muted-foreground mt-1">Fonte: Instagram</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Carlos Silva</h4>
                            <p className="text-sm text-muted-foreground">carlos.silva@email.com</p>
                            <p className="text-sm text-muted-foreground">(11) 88888-8888</p>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">Contato Feito</Badge>
                            <p className="text-sm text-muted-foreground mt-1">Fonte: Indicação</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Fernanda Oliveira</h4>
                            <p className="text-sm text-muted-foreground">fernanda.o@email.com</p>
                            <p className="text-sm text-muted-foreground">(11) 77777-7777</p>
                          </div>
                          <div className="text-right">
                            <Badge>Negociação</Badge>
                            <p className="text-sm text-muted-foreground mt-1">Fonte: Site</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pipeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Funil de Vendas</CardTitle>
                    <CardDescription>Acompanhe o progresso dos prospects</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="bg-blue-100 p-4 rounded-lg mb-2">
                          <h4 className="font-semibold">Novos</h4>
                          <p className="text-2xl font-bold text-blue-600">45</p>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white border rounded p-2 text-sm">Ana Costa</div>
                          <div className="bg-white border rounded p-2 text-sm">João Santos</div>
                          <div className="bg-white border rounded p-2 text-sm">Maria Lima</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-yellow-100 p-4 rounded-lg mb-2">
                          <h4 className="font-semibold">Contato</h4>
                          <p className="text-2xl font-bold text-yellow-600">28</p>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white border rounded p-2 text-sm">Carlos Silva</div>
                          <div className="bg-white border rounded p-2 text-sm">Rita Souza</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-orange-100 p-4 rounded-lg mb-2">
                          <h4 className="font-semibold">Negociação</h4>
                          <p className="text-2xl font-bold text-orange-600">15</p>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white border rounded p-2 text-sm">Fernanda Oliveira</div>
                          <div className="bg-white border rounded p-2 text-sm">Pedro Costa</div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="bg-green-100 p-4 rounded-lg mb-2">
                          <h4 className="font-semibold">Fechados</h4>
                          <p className="text-2xl font-bold text-green-600">23</p>
                        </div>
                        <div className="space-y-2">
                          <div className="bg-white border rounded p-2 text-sm">Laura Martins</div>
                          <div className="bg-white border rounded p-2 text-sm">André Silva</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="activities" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Atividades e Follow-ups</CardTitle>
                    <CardDescription>Gerencie suas tarefas e contatos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button className="w-full">
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Atividade
                      </Button>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-3 border rounded">
                          <Phone className="h-4 w-4 text-blue-500" />
                          <div className="flex-1">
                            <p className="font-medium">Ligar para Ana Costa</p>
                            <p className="text-sm text-muted-foreground">Hoje às 14:00</p>
                          </div>
                          <Badge variant="destructive">Urgente</Badge>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded">
                          <Mail className="h-4 w-4 text-green-500" />
                          <div className="flex-1">
                            <p className="font-medium">Email para Carlos Silva</p>
                            <p className="text-sm text-muted-foreground">Amanhã às 09:00</p>
                          </div>
                          <Badge variant="secondary">Agendado</Badge>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 border rounded">
                          <Calendar className="h-4 w-4 text-purple-500" />
                          <div className="flex-1">
                            <p className="font-medium">Reunião com Fernanda</p>
                            <p className="text-sm text-muted-foreground">Quinta-feira às 15:30</p>
                          </div>
                          <Badge>Confirmado</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="reports" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Relatórios de CRM</CardTitle>
                    <CardDescription>Análises e métricas de vendas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Button variant="outline" className="h-20 flex flex-col">
                        <BarChart3 className="h-6 w-6 mb-2" />
                        Conversão por Fonte
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <TrendingUp className="h-6 w-6 mb-2" />
                        Performance Mensal
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Target className="h-6 w-6 mb-2" />
                        Metas vs Realizados
                      </Button>
                      <Button variant="outline" className="h-20 flex flex-col">
                        <Users className="h-6 w-6 mb-2" />
                        Análise de Prospects
                      </Button>
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

export const BoxCRM: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxCRMContent />
    </AreaThemeProvider>
  );
};
