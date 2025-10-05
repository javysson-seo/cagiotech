import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { useCompany } from '@/contexts/CompanyContext';
import { useEquipment } from '@/hooks/useEquipment';
import { EquipmentForm } from '@/components/equipment/EquipmentForm';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { EquipmentStats } from '@/components/equipment/EquipmentStats';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Search, Package, Wrench, BarChart3, Download, Upload } from 'lucide-react';
import { Equipment } from '@/hooks/useEquipment';
import { toast } from 'sonner';

const BoxEquipmentContent: React.FC = () => {
  const { currentCompany } = useCompany();
  const {
    equipment,
    isLoading,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    addDefaultEquipment,
  } = useEquipment(currentCompany?.id || '');

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [conditionFilter, setConditionFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | undefined>();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddNew = () => {
    setEditingEquipment(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (eq: Equipment) => {
    setEditingEquipment(eq);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: Partial<Equipment>) => {
    if (editingEquipment) {
      updateEquipment.mutate({ ...data, id: editingEquipment.id });
    } else {
      if (!data.name) {
        toast.error('Nome do equipamento é obrigatório');
        return;
      }
      createEquipment.mutate(data as Partial<Equipment> & { name: string });
    }
    setIsFormOpen(false);
    setEditingEquipment(undefined);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteEquipment.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const handleScheduleMaintenance = (eq: Equipment) => {
    // Abre o formulário de edição com foco na data de manutenção
    setEditingEquipment(eq);
    setIsFormOpen(true);
  };

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || eq.category === categoryFilter;

    const matchesStatus = statusFilter === 'all' || eq.status === statusFilter;

    const matchesCondition =
      conditionFilter === 'all' || eq.condition === conditionFilter;

    return matchesSearch && matchesCategory && matchesStatus && matchesCondition;
  });

  const categories = Array.from(new Set(equipment.map(eq => eq.category).filter(Boolean)));

  const maintenanceDue = equipment.filter(eq => {
    if (!eq.next_maintenance) return false;
    return new Date(eq.next_maintenance) <= new Date();
  });

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Material Desportivo</h1>
                <p className="text-muted-foreground">
                  Gestão completa de equipamentos e material desportivo
                </p>
              </div>
              <div className="flex gap-2">
                {equipment.length === 0 && (
                  <Button
                    variant="outline"
                    onClick={() => addDefaultEquipment.mutate()}
                    disabled={addDefaultEquipment.isPending}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {addDefaultEquipment.isPending ? 'A adicionar...' : 'Adicionar Equipamentos Padrão'}
                  </Button>
                )}
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Equipamento
                </Button>
              </div>
            </div>

            {/* Stats */}
            <EquipmentStats equipment={equipment} />

            {/* Main Content */}
            <Tabs defaultValue="inventory" className="space-y-4">
              <TabsList>
                <TabsTrigger value="inventory">
                  <Package className="h-4 w-4 mr-2" />
                  Inventário
                </TabsTrigger>
                <TabsTrigger value="maintenance">
                  <Wrench className="h-4 w-4 mr-2" />
                  Manutenção {maintenanceDue.length > 0 && `(${maintenanceDue.length})`}
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Análises
                </TabsTrigger>
              </TabsList>

              {/* Inventory Tab */}
              <TabsContent value="inventory" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                      <div>
                        <CardTitle>Inventário de Equipamentos</CardTitle>
                        <CardDescription>
                          {filteredEquipment.length} de {equipment.length} equipamentos
                        </CardDescription>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <div className="relative flex-1 min-w-[200px]">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Pesquisar equipamentos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                          />
                        </div>

                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            {categories.map(cat => (
                              <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="maintenance">Manutenção</SelectItem>
                            <SelectItem value="retired">Retirado</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select value={conditionFilter} onValueChange={setConditionFilter}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Condição" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="excellent">Excelente</SelectItem>
                            <SelectItem value="good">Boa</SelectItem>
                            <SelectItem value="fair">Razoável</SelectItem>
                            <SelectItem value="poor">Má</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">A carregar equipamentos...</p>
                      </div>
                    ) : filteredEquipment.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">
                          {equipment.length === 0
                            ? 'Nenhum equipamento registado'
                            : 'Nenhum equipamento encontrado com os filtros aplicados'}
                        </p>
                        {equipment.length === 0 && (
                          <Button onClick={() => addDefaultEquipment.mutate()}>
                            <Upload className="h-4 w-4 mr-2" />
                            Adicionar Equipamentos Padrão
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEquipment.map((eq) => (
                          <EquipmentCard
                            key={eq.id}
                            equipment={eq}
                            onEdit={handleEdit}
                            onDelete={setDeleteId}
                            onScheduleMaintenance={handleScheduleMaintenance}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Maintenance Tab */}
              <TabsContent value="maintenance">
                <Card>
                  <CardHeader>
                    <CardTitle>Plano de Manutenção</CardTitle>
                    <CardDescription>
                      Equipamentos que necessitam manutenção
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {maintenanceDue.length === 0 ? (
                      <div className="text-center py-12">
                        <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Não há equipamentos com manutenção pendente
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {maintenanceDue.map((eq) => (
                          <EquipmentCard
                            key={eq.id}
                            equipment={eq}
                            onEdit={handleEdit}
                            onDelete={setDeleteId}
                            onScheduleMaintenance={handleScheduleMaintenance}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Equipamentos por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {categories.map(cat => {
                          const count = equipment.filter(eq => eq.category === cat).length;
                          const percentage = (count / equipment.length) * 100;
                          return (
                            <div key={cat} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{cat}</span>
                                <span className="font-medium">{count}</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Estado dos Equipamentos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {['active', 'maintenance', 'retired'].map(status => {
                          const count = equipment.filter(eq => eq.status === status).length;
                          const percentage = equipment.length > 0 ? (count / equipment.length) * 100 : 0;
                          const labels: Record<string, string> = {
                            active: 'Ativo',
                            maintenance: 'Em Manutenção',
                            retired: 'Retirado',
                          };
                          return (
                            <div key={status} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{labels[status]}</span>
                                <span className="font-medium">{count}</span>
                              </div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>

      {/* Forms and Dialogs */}
      <EquipmentForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleSubmit}
        equipment={editingEquipment}
        isLoading={createEquipment.isPending || updateEquipment.isPending}
      />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja remover este equipamento? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
