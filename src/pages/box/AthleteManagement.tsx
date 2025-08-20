
import React, { useState } from 'react';
import { Plus, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { AthleteList } from '@/components/athletes/AthleteList';
import { AthleteFormModal } from '@/components/athletes/AthleteFormModal';
import { AthleteDetailsModal } from '@/components/athletes/AthleteDetailsModal';
import { AthleteExportDialog } from '@/components/athletes/AthleteExportDialog';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { useAthletes, type Athlete } from '@/hooks/useAthletes';
import { toast } from 'sonner';

const AthleteManagementContent: React.FC = () => {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock company ID - em produção viria do contexto/auth
  const companyId = 'mock-company-id';
  const { athletes, loading, createAthlete, updateAthlete, deleteAthlete } = useAthletes(companyId);

  const handleNewAthlete = () => {
    setEditingAthlete(null);
    setShowFormModal(true);
  };

  const handleEditAthlete = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setShowFormModal(true);
    setShowDetailsModal(false);
  };

  const handleViewProfile = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setShowDetailsModal(true);
  };

  const handleDeleteAthlete = async (athlete: Athlete) => {
    await deleteAthlete(athlete.id);
  };

  const handleSaveAthlete = async (athleteData: any) => {
    console.log('Saving athlete:', athleteData);
    
    const formattedData = {
      name: athleteData.name,
      email: athleteData.email,
      phone: athleteData.phone,
      birth_date: athleteData.birthDate,
      gender: athleteData.gender,
      status: athleteData.status || 'active',
      company_id: companyId,
      emergency_contact_name: athleteData.emergencyContact,
      emergency_contact_phone: athleteData.emergencyPhone,
      medical_notes: athleteData.medicalConditions
    };
    
    try {
      if (editingAthlete) {
        // Editando atleta existente
        await updateAthlete(editingAthlete.id, formattedData);
      } else {
        // Criando novo atleta
        await createAthlete(formattedData);
      }
      
      // Verificar aniversário
      if (athleteData.birthDate) {
        const today = new Date();
        const birthDate = new Date(athleteData.birthDate);
        
        if (
          today.getMonth() === birthDate.getMonth() && 
          today.getDate() === birthDate.getDate()
        ) {
          const age = today.getFullYear() - birthDate.getFullYear();
          toast.success(`🎉 ${athleteData.name} está fazendo ${age} anos hoje!`);
        }
      }
      
      setShowFormModal(false);
      setEditingAthlete(null);
    } catch (error) {
      // Error já tratado no hook
    }
  };

  const handleExport = () => {
    setShowExportDialog(true);
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
                <Button variant="outline" onClick={handleExport} className="hidden md:flex">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar XLSX
                </Button>
                <Button onClick={handleNewAthlete} className="bg-[#bed700] hover:bg-[#a5c400] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Atleta
                </Button>
              </div>
            </div>

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

            {/* Lista de Atletas */}
            <AthleteList
              athletes={athletes}
              loading={loading}
              searchTerm={searchTerm}
              statusFilter={statusFilter}
              onEdit={handleEditAthlete}
              onView={handleViewProfile}
            />
          </div>
        </main>
      </div>

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
        onEdit={() => handleEditAthlete(selectedAthlete!)}
        onDelete={handleDeleteAthlete}
      />

      <AthleteExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        athletes={athletes}
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
