
import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { ClassList } from '@/components/classes/ClassList';
import { ClassForm } from '@/components/classes/ClassForm';
import { ClassCalendar } from '@/components/classes/ClassCalendar';
import { ModalitiesRoomsManagement } from '@/components/classes/ModalitiesRoomsManagement';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Calendar, List, Users, Settings } from 'lucide-react';
import { useClasses } from '@/hooks/useClasses';
import { useModalities } from '@/hooks/useModalities';

const ClassManagementContent: React.FC = () => {
  const { classes, loading, refetchClasses } = useClasses();
  const { modalities } = useModalities();
  const [activeTab, setActiveTab] = useState('list');
  const [showForm, setShowForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');

  const handleCreateClass = () => {
    setSelectedClass(null);
    setShowForm(true);
  };

  const handleEditClass = (classData: any) => {
    setSelectedClass(classData);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedClass(null);
    refetchClasses();
  };

  const todayClasses = classes.filter(c => c.date === new Date().toISOString().split('T')[0]);
  const totalCapacity = classes.reduce((sum, c) => sum + (c.max_capacity || 0), 0);
  const totalBooked = classes.reduce((sum, c) => sum + (c.current_bookings || 0), 0);
  const occupationRate = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Gestão de Aulas</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Gerir aulas, horários e modalidades
                </p>
              </div>
              <Button onClick={handleCreateClass} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                Nova Aula
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Aulas Hoje</p>
                      <p className="text-xl font-bold">{todayClasses.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Taxa Ocupação</p>
                      <p className="text-xl font-bold">{occupationRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <List className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Total Aulas</p>
                      <p className="text-xl font-bold">{classes.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Pesquisar aulas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={modalityFilter} onValueChange={setModalityFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Modalidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas Modalidades</SelectItem>
                      {modalities.filter(m => m.is_active).map(modality => (
                        <SelectItem key={modality.id} value={modality.id!}>
                          {modality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 h-auto">
                <TabsTrigger value="list" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <List className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Lista</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Calendar className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Calendário</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  <Settings className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Config</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="list" className="mt-4 space-y-4">
                <ClassList 
                  searchTerm={searchTerm}
                  modalityFilter={modalityFilter}
                  onEdit={handleEditClass}
                />
              </TabsContent>

              <TabsContent value="calendar" className="mt-4 space-y-4">
                <ClassCalendar onEdit={handleEditClass} />
              </TabsContent>

              <TabsContent value="settings" className="mt-4 space-y-4">
                <ModalitiesRoomsManagement />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-background rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ClassForm 
              classData={selectedClass}
              onClose={handleCloseForm}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export const ClassManagement: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <ClassManagementContent />
    </AreaThemeProvider>
  );
};
