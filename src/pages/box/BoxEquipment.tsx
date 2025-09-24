import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dumbbell, Plus, Search, Calendar, Wrench, Package, AlertTriangle } from 'lucide-react';

const BoxEquipmentContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingEquipment, setIsAddingEquipment] = useState(false);

  const equipment = [
    {
      id: 1,
      name: 'Halteres 20kg',
      category: 'Pesos',
      quantity: 4,
      condition: 'good',
      location: 'Área de Musculação',
      purchase_date: '2023-06-15',
      next_maintenance: '2024-06-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Esteira Profissional',
      category: 'Cardio',
      quantity: 1,
      condition: 'excellent',
      location: 'Área Cardio',
      purchase_date: '2023-03-10',
      next_maintenance: '2024-03-10',
      status: 'active'
    },
    {
      id: 3,
      name: 'Kettlebell 16kg',
      category: 'Funcional',
      quantity: 6,
      condition: 'good',
      location: 'Área Funcional',
      purchase_date: '2023-01-20',
      next_maintenance: '2024-07-20',
      status: 'maintenance'
    }
  ];

  const getConditionColor = (condition: string) => {
    switch(condition) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Material Deportivo</h1>
                <p className="text-muted-foreground">
                  Gestão de equipamentos e material desportivo
                </p>
              </div>
              <Dialog open={isAddingEquipment} onOpenChange={setIsAddingEquipment}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Equipamento
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Novo Equipamento</DialogTitle>
                    <DialogDescription>
                      Adicionar novo equipamento ao inventário
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Nome</Label>
                      <Input id="name" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">Categoria</Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecionar categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardio">Cardio</SelectItem>
                          <SelectItem value="weights">Pesos</SelectItem>
                          <SelectItem value="functional">Funcional</SelectItem>
                          <SelectItem value="accessories">Acessórios</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="quantity" className="text-right">Quantidade</Label>
                      <Input id="quantity" type="number" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="location" className="text-right">Localização</Label>
                      <Input id="location" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => setIsAddingEquipment(false)}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="inventory" className="space-y-4">
              <TabsList>
                <TabsTrigger value="inventory">
                  <Package className="h-4 w-4 mr-2" />
                  Inventário
                </TabsTrigger>
                <TabsTrigger value="maintenance">
                  <Wrench className="h-4 w-4 mr-2" />
                  Manutenção
                </TabsTrigger>
                <TabsTrigger value="reports">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Relatórios
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inventory">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Inventário de Equipamentos</CardTitle>
                        <CardDescription>
                          Lista completa de todos os equipamentos
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Pesquisar equipamentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8 w-64"
                          />
                        </div>
                        <Select>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="cardio">Cardio</SelectItem>
                            <SelectItem value="weights">Pesos</SelectItem>
                            <SelectItem value="functional">Funcional</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {equipment.map(item => (
                        <Card key={item.id} className="border">
                          <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                              <CardTitle className="text-lg">{item.name}</CardTitle>
                              <Badge className={getStatusColor(item.status)}>
                                {item.status === 'active' ? 'Ativo' : 
                                 item.status === 'maintenance' ? 'Manutenção' : 'Retirado'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.category}</p>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Quantidade:</span>
                              <span className="font-medium">{item.quantity}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Condição:</span>
                              <Badge className={getConditionColor(item.condition)} variant="outline">
                                {item.condition === 'excellent' ? 'Excelente' :
                                 item.condition === 'good' ? 'Boa' :
                                 item.condition === 'fair' ? 'Razoável' : 'Má'}
                              </Badge>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Localização:</span>
                              <span className="font-medium">{item.location}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Próxima manutenção:</span>
                              <span className="font-medium">{item.next_maintenance}</span>
                            </div>
                            <div className="flex space-x-2 pt-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                Editar
                              </Button>
                              <Button variant="outline" size="sm">
                                <Wrench className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="maintenance">
                <Card>
                  <CardHeader>
                    <CardTitle>Plano de Manutenção</CardTitle>
                    <CardDescription>
                      Equipamentos que precisam de manutenção
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {equipment.filter(item => item.status === 'maintenance' || new Date(item.next_maintenance) <= new Date()).map(item => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                Localização: {item.location}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="destructive">
                                <Calendar className="h-3 w-3 mr-1" />
                                {item.next_maintenance}
                              </Badge>
                              <Button size="sm">
                                <Wrench className="h-4 w-4 mr-2" />
                                Agendar
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reports">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Total de Equipamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{equipment.length}</div>
                      <p className="text-xs text-muted-foreground">equipamentos registados</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Em Manutenção</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-600">
                        {equipment.filter(e => e.status === 'maintenance').length}
                      </div>
                      <p className="text-xs text-muted-foreground">equipamentos</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Valor Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">€15.420</div>
                      <p className="text-xs text-muted-foreground">valor estimado</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export const BoxEquipment: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxEquipmentContent />
    </AreaThemeProvider>
  );
};