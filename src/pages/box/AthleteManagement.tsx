
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
import { toast } from 'sonner';

const AthleteManagementContent: React.FC = () => {
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data dos atletas
  const [athletes, setAthletes] = useState([
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '+351 912 345 678',
      birthDate: '1990-03-15',
      gender: 'female',
      address: 'Rua das Flores, 123, Lisboa',
      plan: 'Premium',
      trainer: 'Carlos Santos',
      group: 'Crossfit Iniciantes',
      status: 'active',
      joinDate: '2023-06-15',
      monthlyFee: 80,
      emergencyContact: 'João Silva',
      emergencyPhone: '+351 913 456 789',
      medicalConditions: 'Alergia a frutos secos',
      goals: ['Perder 5kg', 'Aumentar força'],
      notes: 'Aluna muito dedicada',
      nutritionPreview: 'Dieta mediterrânica com foco em proteínas magras',
      profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
    },
    {
      id: 2,
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '+351 913 456 789',
      birthDate: '1985-07-22',
      gender: 'male',
      address: 'Avenida da Liberdade, 456, Porto',
      plan: 'Básico',
      trainer: 'Ana Costa',
      group: 'Musculação Avançada',
      status: 'active',
      joinDate: '2023-08-20',
      monthlyFee: 50,
      medicalConditions: '',
      goals: ['Ganhar massa muscular'],
      notes: 'Precisa de mais foco na dieta',
      nutritionPreview: '',
      profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao'
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '+351 914 567 890',
      birthDate: '1992-12-05',
      gender: 'female',
      address: 'Rua do Comércio, 789, Braga',
      plan: 'VIP',
      trainer: 'Pedro Silva',
      group: 'Funcional',
      status: 'frozen',
      joinDate: '2023-04-10',
      monthlyFee: 120,
      emergencyContact: 'Manuel Costa',
      emergencyPhone: '+351 915 678 901',
      medicalConditions: 'Lesão no joelho direito',
      goals: ['Reabilitação', 'Manter forma física'],
      notes: 'Em período de recuperação',
      nutritionPreview: 'Plano anti-inflamatório para recuperação',
      profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana'
    }
  ]);

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

  const handleDeleteAthlete = (athlete: any) => {
    setAthletes(prev => prev.filter(a => a.id !== athlete.id));
    toast.success(`Atleta ${athlete.name} foi excluído com sucesso.`);
  };

  const handleSaveAthlete = (athleteData: any) => {
    console.log('Saving athlete:', athleteData);
    
    if (editingAthlete) {
      // Editando atleta existente
      setAthletes(prev => prev.map(a => 
        a.id === editingAthlete.id ? { ...a, ...athleteData } : a
      ));
      toast.success(`Dados do atleta ${athleteData.name} atualizados com sucesso!`);
    } else {
      // Criando novo atleta
      const newAthlete = {
        ...athleteData,
        id: Date.now(), // ID temporário
      };
      setAthletes(prev => [...prev, newAthlete]);
      toast.success(`Atleta ${athleteData.name} cadastrado com sucesso!`);
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
                <Button onClick={handleNewAthlete} className="bg-green-600 hover:bg-green-700">
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
        onEdit={() => handleEditAthlete(selectedAthlete)}
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
