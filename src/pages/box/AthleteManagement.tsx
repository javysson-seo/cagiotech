import React, { useState } from 'react';
import { Plus, Search, Download, UserCheck, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AthleteList } from '@/components/athletes/AthleteList';
import { AthleteFormModal } from '@/components/athletes/AthleteFormModal';
import { AthleteImportDialog } from '@/components/athletes/AthleteImportDialog';
import { AthleteDetailsModal } from '@/components/athletes/AthleteDetailsModal';
import { AthleteExportDialog } from '@/components/athletes/AthleteExportDialog';
import { QuickRegisterModal } from '@/components/auth/QuickRegisterModal';
import { ApprovalQueue } from '@/components/athletes/ApprovalQueue';
import { AdvancedFilters } from '@/components/athletes/AdvancedFilters';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { useAthletes } from '@/hooks/useAthletes';
import { Footer } from '@/components/Footer';


const AthleteManagementContent: React.FC = () => {
  const { athletes, loading, saveAthlete, deleteAthlete } = useAthletes();
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [advancedFilters, setAdvancedFilters] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleNewAthlete = () => {
    setEditingAthlete(null);
    setShowFormModal(true);
  };

  const handleEditAthlete = (athlete: any) => {
    setEditingAthlete(athlete);
    setShowFormModal(true);
    setShowDetailsModal(false);
  };

  const handleViewProfile = (athlete: any) => {
    setSelectedAthlete(athlete);
    setShowDetailsModal(true);
  };

  const handleDeleteAthlete = async (athlete: any) => {
    const success = await deleteAthlete(athlete.id);
    if (success) {
      setShowDetailsModal(false);
      setSelectedAthlete(null);
    }
  };

  const handleSaveAthlete = async (athleteData: any) => {
    console.log('Saving athlete:', athleteData);
    
    const success = await saveAthlete(athleteData);
    if (success) {
      setShowFormModal(false);
      setShowQuickRegister(false);
      setEditingAthlete(null);
      
      // Se foi criado um novo atleta, abrir modal de detalhes
      if (!athleteData.id && athletes.length > 0) {
        // O novo atleta será o primeiro na lista após o refresh
        setTimeout(() => {
          const newAthlete = athletes[0];
          setSelectedAthlete(newAthlete);
          setShowDetailsModal(true);
        }, 500);
      }
    }
  };

  const handleExport = () => {
    setShowExportDialog(true);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6 pb-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Gestão de Alunos / Atletas
              </h1>
              <p className="text-muted-foreground">
                Gerir membros, planos e documentos
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => setShowImportDialog(true)} className="hidden md:flex">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Importar Excel
              </Button>
              <Button variant="outline" onClick={handleExport} className="hidden md:flex">
                <Download className="h-4 w-4 mr-2" />
                Exportar XLSX
              </Button>
              <Button variant="outline" onClick={() => setShowQuickRegister(true)} className="hidden md:flex">
                <Plus className="h-4 w-4 mr-2" />
                Registo Rápido
              </Button>
              <Button onClick={handleNewAthlete} className="bg-cagio-green hover:bg-cagio-green-dark text-white">
                <Plus className="h-4 w-4 mr-2" />
                Novo Atleta
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="all">Todos os Atletas</TabsTrigger>
              <TabsTrigger value="pending" className="relative">
                Pendentes de Aprovação
                {athletes.filter(a => a.status === 'pending').length > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-orange-500 rounded-full">
                    {athletes.filter(a => a.status === 'pending').length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {/* Filtros */}
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
                      </select>
                      
                      <AdvancedFilters onFiltersChange={setAdvancedFilters} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Lista de Atletas */}
              {loading ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cagio-green mx-auto mb-4"></div>
                      <p className="text-muted-foreground">Carregando atletas...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <AthleteList
                  athletes={athletes}
                  searchTerm={searchTerm}
                  statusFilter={statusFilter}
                  onEdit={handleEditAthlete}
                  onView={handleViewProfile}
                />
              )}
            </TabsContent>

            <TabsContent value="pending">
              <ApprovalQueue />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />

      {/* Modais */}
      <AthleteFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingAthlete(null);
        }}
        athlete={editingAthlete}
        onSave={handleSaveAthlete}
      />

      <AthleteDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedAthlete(null);
        }}
        athlete={selectedAthlete}
        onEdit={() => handleEditAthlete(selectedAthlete)}
        onDelete={handleDeleteAthlete}
      />

      <AthleteExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        athletes={athletes}
      />

      <QuickRegisterModal
        isOpen={showQuickRegister}
        onClose={() => setShowQuickRegister(false)}
        onSave={handleSaveAthlete}
      />

      <AthleteImportDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImportComplete={() => {
          setShowImportDialog(false);
        }}
      />
    </div>
  );
};

export const AthleteManagement: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <AthleteManagementContent />
    </AreaThemeProvider>
  );
};