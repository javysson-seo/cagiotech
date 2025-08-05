
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Upload, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { TrainerList } from '@/components/trainers/TrainerList';
import { TrainerForm } from '@/components/trainers/TrainerForm';
import { TrainerProfile } from '@/components/trainers/TrainerProfile';

export const TrainerManagement: React.FC = () => {
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleNewTrainer = () => {
    setSelectedTrainer(null);
    setShowForm(true);
  };

  const handleEditTrainer = (trainer: any) => {
    setSelectedTrainer(trainer);
    setShowForm(true);
  };

  const handleViewProfile = (trainer: any) => {
    setSelectedTrainer(trainer);
    setShowForm(false);
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
                <h1 className="text-3xl font-bold text-foreground">
                  Gestão de Personal Trainers
                </h1>
                <p className="text-muted-foreground">
                  Gerir trainers, especialidades e disponibilidade
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="hidden md:flex">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
                <Button variant="outline" className="hidden md:flex">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button onClick={handleNewTrainer} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Trainer
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Total Trainers</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 bg-green-600 rounded-full" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Ativos</p>
                      <p className="text-2xl font-bold">10</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 bg-orange-600 rounded-full" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Em Férias</p>
                      <p className="text-2xl font-bold">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <div className="h-4 w-4 bg-purple-600 rounded-full" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Avg. Rating</p>
                      <p className="text-2xl font-bold">4.8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pesquisar por nome, especialidade..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                    >
                      <option value="all">Todos os Status</option>
                      <option value="active">Ativo</option>
                      <option value="vacation">Em Férias</option>
                      <option value="absent">Ausente</option>
                    </select>
                    
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Mais Filtros
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trainers List */}
              <div className="lg:col-span-2">
                <TrainerList
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  onEdit={handleEditTrainer}
                  onView={handleViewProfile}
                />
              </div>

              {/* Side Panel */}
              <div className="lg:col-span-1">
                {selectedTrainer && !showForm ? (
                  <TrainerProfile
                    trainer={selectedTrainer}
                    onEdit={() => handleEditTrainer(selectedTrainer)}
                    onClose={() => setSelectedTrainer(null)}
                  />
                ) : showForm ? (
                  <TrainerForm
                    trainer={selectedTrainer}
                    onSave={() => {
                      setShowForm(false);
                      setSelectedTrainer(null);
                    }}
                    onCancel={() => {
                      setShowForm(false);
                      setSelectedTrainer(null);
                    }}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Seleção de Trainer</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        Selecione um trainer da lista para ver detalhes ou clique em "Novo Trainer" para cadastrar.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
