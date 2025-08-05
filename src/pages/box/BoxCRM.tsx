
import React, { useState } from 'react';
import { Plus, Search, Filter, Phone, Mail, Calendar, User, TrendingUp, AlertCircle, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  status: 'novo' | 'contactado' | 'interessado' | 'convertido' | 'perdido';
  createdAt: string;
  lastContact: string;
  notes: string;
  score: number;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  joinDate: string;
  lastVisit: string;
  totalSpent: number;
  lifetimeValue: number;
}

export const BoxCRM: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('leads');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  // Mock data - em produção virá do Supabase
  const leads: Lead[] = [
    {
      id: '1',
      name: 'Ana Silva',
      email: 'ana@email.com',
      phone: '+351 912 345 678',
      source: 'Website',
      status: 'novo',
      createdAt: '2024-01-15',
      lastContact: '2024-01-15',
      notes: 'Interessada em CrossFit para iniciantes',
      score: 85
    },
    {
      id: '2',
      name: 'Pedro Santos',
      email: 'pedro@email.com',
      phone: '+351 912 345 679',
      source: 'Instagram',
      status: 'contactado',
      createdAt: '2024-01-14',
      lastContact: '2024-01-16',
      notes: 'Já praticou CrossFit. Quer experimentar aula',
      score: 92
    },
    {
      id: '3',
      name: 'Maria Costa',
      email: 'maria@email.com',
      phone: '+351 912 345 680',
      source: 'Referência',
      status: 'interessado',
      createdAt: '2024-01-13',
      lastContact: '2024-01-17',
      notes: 'Amiga da Ana. Quer começar junto',
      score: 78
    }
  ];

  const customers: Customer[] = [
    {
      id: '1',
      name: 'João Ferreira',
      email: 'joao@email.com',
      phone: '+351 912 345 681',
      plan: 'Premium Mensal',
      status: 'ativo',
      joinDate: '2023-06-15',
      lastVisit: '2024-01-18',
      totalSpent: 480,
      lifetimeValue: 720
    },
    {
      id: '2',
      name: 'Sofia Oliveira',
      email: 'sofia@email.com',
      phone: '+351 912 345 682',
      plan: 'Basic Anual',
      status: 'ativo',
      joinDate: '2023-08-20',
      lastVisit: '2024-01-17',
      totalSpent: 360,
      lifetimeValue: 540
    }
  ];

  const getStatusBadge = (status: string, type: 'lead' | 'customer') => {
    if (type === 'lead') {
      switch (status) {
        case 'novo': return <Badge className="bg-blue-100 text-blue-800">Novo</Badge>;
        case 'contactado': return <Badge className="bg-orange-100 text-orange-800">Contactado</Badge>;
        case 'interessado': return <Badge className="bg-purple-100 text-purple-800">Interessado</Badge>;
        case 'convertido': return <Badge className="bg-green-100 text-green-800">Convertido</Badge>;
        case 'perdido': return <Badge className="bg-red-100 text-red-800">Perdido</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
      }
    } else {
      switch (status) {
        case 'ativo': return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
        case 'inativo': return <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>;
        case 'suspenso': return <Badge className="bg-red-100 text-red-800">Suspenso</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
      }
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">CRM - Gestão de Relacionamentos</h1>
                <p className="text-muted-foreground">Gerir leads, clientes e oportunidades de negócio</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Lead
                </Button>
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Leads</CardTitle>
                  <User className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">47</div>
                  <p className="text-xs text-green-600 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% vs mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Taxa Conversão</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23.5%</div>
                  <p className="text-xs text-green-600">+2.1% vs mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Receita Prevista</CardTitle>
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€8,420</div>
                  <p className="text-xs text-purple-600">Pipeline atual</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Seguimento Pendente</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-orange-600">Requer atenção</p>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Pesquisar por nome, email ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="leads">Leads ({leads.length})</TabsTrigger>
                <TabsTrigger value="customers">Clientes ({customers.length})</TabsTrigger>
                <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
                <TabsTrigger value="analytics">Análises</TabsTrigger>
              </TabsList>

              <TabsContent value="leads" className="space-y-4">
                <div className="grid gap-4">
                  {leads.filter(lead => 
                    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((lead) => (
                    <Card key={lead.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-blue-600" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{lead.name}</h3>
                                {getStatusBadge(lead.status, 'lead')}
                                <div className={`text-sm font-medium ${getScoreColor(lead.score)}`}>
                                  Score: {lead.score}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {lead.email}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {lead.phone}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Último contacto: {lead.lastContact}
                                </div>
                              </div>
                              
                              <p className="text-sm">{lead.notes}</p>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Ligar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="mr-2 h-4 w-4" />
                                Enviar Email
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="customers" className="space-y-4">
                <div className="grid gap-4">
                  {customers.filter(customer => 
                    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
                  ).map((customer) => (
                    <Card key={customer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-green-600" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold">{customer.name}</h3>
                                {getStatusBadge(customer.status, 'customer')}
                                <Badge variant="outline">{customer.plan}</Badge>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                                <div className="flex items-center">
                                  <Mail className="h-3 w-3 mr-1" />
                                  {customer.email}
                                </div>
                                <div className="flex items-center">
                                  <Phone className="h-3 w-3 mr-1" />
                                  {customer.phone}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Cliente desde: {customer.joinDate}
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-4 text-sm">
                                <span>Total Gasto: <strong>€{customer.totalSpent}</strong></span>
                                <span>LTV: <strong>€{customer.lifetimeValue}</strong></span>
                                <span>Última Visita: {customer.lastVisit}</span>
                              </div>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedCustomer(customer)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Perfil
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" />
                                Contactar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pipeline" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {['Novo', 'Contactado', 'Interessado', 'Proposta', 'Convertido'].map((stage, index) => (
                    <Card key={stage}>
                      <CardHeader>
                        <CardTitle className="text-sm flex items-center justify-between">
                          {stage}
                          <Badge variant="outline">{Math.floor(Math.random() * 10) + 1}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => (
                          <div key={i} className="p-2 bg-muted rounded text-sm">
                            <div className="font-medium">Lead {i + 1}</div>
                            <div className="text-xs text-muted-foreground">€{Math.floor(Math.random() * 500) + 100}/mês</div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Origem dos Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Website</span>
                          <span className="font-medium">45%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Instagram</span>
                          <span className="font-medium">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Referências</span>
                          <span className="font-medium">25%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Mensal</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Leads Gerados</span>
                          <span className="font-medium">47</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contactados</span>
                          <span className="font-medium">35</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Convertidos</span>
                          <span className="font-medium">11</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Lead - {selectedLead?.name}</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Origem</label>
                  <p className="text-sm text-muted-foreground">{selectedLead.source}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Score</label>
                  <p className={`text-sm font-medium ${getScoreColor(selectedLead.score)}`}>
                    {selectedLead.score}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notas</label>
                <p className="text-sm text-muted-foreground mt-1">{selectedLead.notes}</p>
              </div>
              <div className="flex space-x-2">
                <Button size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Ligar
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
                <Button size="sm" variant="outline">
                  Agendar Seguimento
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
