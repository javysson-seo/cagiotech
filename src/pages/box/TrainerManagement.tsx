
import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { TrainerList } from '@/components/trainers/TrainerList';
import { TrainerForm } from '@/components/trainers/TrainerForm';
import { TrainerProfile } from '@/components/trainers/TrainerProfile';
import { QuickRegisterModal } from '@/components/auth/QuickRegisterModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const TrainerManagementContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('list');

  // Stats para KPIs
  const stats = [
    {
      title: 'Total Trainers',
      value: '8',
      change: '+2',
      trend: 'up',
      icon: Users,
      description: 'vs mês anterior'
    },
    {
      title: 'Ativos',
      value: '6',
      change: '+1',
      trend: 'up',
      icon: UserCheck,
      description: 'trabalhando hoje'
    },
    {
      title: 'Em Férias',
      value: '2',
      change: '0',
      trend: 'neutral',
      icon: UserX,
      description: 'temporário'
    },
    {
      title: 'Performance',
      value: '92%',
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      description: 'satisfação média'
    }
  ];

  const handleEdit = (trainer: any) => {
    setSelectedTrainer(trainer);
    setShowForm(true);
  };

  const handleView = (trainer: any) => {
    setSelectedTrainer(trainer);
    setShowProfile(true);
  };

  const handleNewTrainer = () => {
    setSelectedTrainer(null);
    setShowForm(true);
  };

  const handleSave = () => {
    setShowForm(false);
    setSelectedTrainer(null);
  };

  const handleQuickRegisterSave = (data: any) => {
    console.log('Quick register trainer:', data);
    // Aqui você pode adicionar lógica para salvar o trainer rapidamente
    setShowQuickRegister(false);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedTrainer(null);
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
                <h1 className="text-3xl font-bold text-foreground">Gestão de Trainers</h1>
                <p className="text-muted-foreground">
                  Gerir treinadores e instrutores da sua BOX
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" onClick={() => setShowQuickRegister(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Registo Rápido
                </Button>
                <Button onClick={handleNewTrainer} className="bg-cagio-green hover:bg-cagio-green/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Trainer
                </Button>
              </div>
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
                        stat.trend === 'up' ? 'text-cagio-green' : 
                        stat.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                      }`}>
                        <span className="font-medium">{stat.change}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {stat.description}
                      </span>
                    </div>
                  </CardContent>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-cagio-green"></div>
                </Card>
              ))}
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Procurar por nome, email ou especialidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Estados</SelectItem>
                      <SelectItem value="active">
                        <div className="flex items-center">
                          <Badge variant="default" className="mr-2">Ativo</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="vacation">
                        <div className="flex items-center">
                          <Badge variant="secondary" className="mr-2">Em Férias</Badge>
                        </div>
                      </SelectItem>
                      <SelectItem value="absent">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">Ausente</Badge>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="list">Lista</TabsTrigger>
                <TabsTrigger value="grid">Grelha</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-6">
                <TrainerList
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  onEdit={handleEdit}
                  onView={handleView}
                />
              </TabsContent>

              <TabsContent value="grid" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Grid view would be implemented here */}
                  <Card className="text-center py-8">
                    <CardContent>
                      <p className="text-muted-foreground">Vista em grelha em desenvolvimento...</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-6">
                <Card className="text-center py-8">
                  <CardContent>
                    <p className="text-muted-foreground">Relatórios de performance em desenvolvimento...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Dialogs */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <TrainerForm
            trainer={selectedTrainer}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTrainer && (
            <TrainerProfile
              trainer={selectedTrainer}
              onEdit={() => {
                setShowProfile(false);
                setShowForm(true);
              }}
              onClose={() => setShowProfile(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <QuickRegisterModal
        isOpen={showQuickRegister}
        onClose={() => setShowQuickRegister(false)}
        onSave={handleQuickRegisterSave}
      />
    </div>
  );
};

export const TrainerManagement: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <TrainerManagementContent />
    </AreaThemeProvider>
  );
};
