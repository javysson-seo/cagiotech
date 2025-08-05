
import React, { useState } from 'react';
import { Plus, Search, Filter, Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { AthleteList } from '@/components/athletes/AthleteList';
import { AthleteForm } from '@/components/athletes/AthleteForm';
import { AthleteProfile } from '@/components/athletes/AthleteProfile';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

export const AthleteManagement: React.FC = () => {
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleNewAthlete = () => {
    setSelectedAthlete(null);
    setShowForm(true);
  };

  const handleEditAthlete = (athlete: any) => {
    setSelectedAthlete(athlete);
    setShowForm(true);
  };

  const handleViewProfile = (athlete: any) => {
    setSelectedAthlete(athlete);
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
                  Gestão de Atletas
                </h1>
                <p className="text-muted-foreground">
                  Gerir membros, planos e documentos
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="hidden md:flex">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar Excel
                </Button>
                <Button variant="outline" className="hidden md:flex">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button onClick={handleNewAthlete} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Atleta
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Pesquisar por nome, email ou telefone..."
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
                      <option value="inactive">Inativo</option>
                      <option value="frozen">Congelado</option>
                      <option value="pending">Pendente</option>
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
              {/* Athletes List */}
              <div className="lg:col-span-2">
                <AthleteList
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  onEdit={handleEditAthlete}
                  onView={handleViewProfile}
                />
              </div>

              {/* Side Panel */}
              <div className="lg:col-span-1">
                {selectedAthlete && !showForm ? (
                  <AthleteProfile
                    athlete={selectedAthlete}
                    onEdit={() => handleEditAthlete(selectedAthlete)}
                    onClose={() => setSelectedAthlete(null)}
                  />
                ) : showForm ? (
                  <AthleteForm
                    athlete={selectedAthlete}
                    onSave={() => {
                      setShowForm(false);
                      setSelectedAthlete(null);
                    }}
                    onCancel={() => {
                      setShowForm(false);
                      setSelectedAthlete(null);
                    }}
                  />
                ) : (
                  <Card>
                    <CardHeader>
                      <CardTitle>Seleção de Atleta</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center py-8">
                      <p className="text-muted-foreground">
                        Selecione um atleta da lista para ver detalhes ou clique em "Novo Atleta" para cadastrar.
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
