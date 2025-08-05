
import React, { useState } from 'react';
import { Plus, Search, Filter, Calendar, Clock, Users, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { ClassCalendar } from '@/components/classes/ClassCalendar';
import { ClassList } from '@/components/classes/ClassList';
import { ClassForm } from '@/components/classes/ClassForm';
import { ModalityManagement } from '@/components/classes/ModalityManagement';

export const ClassManagement: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('today');

  const handleNewClass = () => {
    setSelectedClass(null);
    setShowForm(true);
  };

  const handleEditClass = (classData: any) => {
    setSelectedClass(classData);
    setShowForm(true);
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
                  Gestão de Aulas & Serviços
                </h1>
                <p className="text-muted-foreground">
                  Gerir horários, modalidades e reservas
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" className="hidden md:flex">
                  <Calendar className="h-4 w-4 mr-2" />
                  Exportar Agenda
                </Button>
                <Button onClick={handleNewClass} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Aula
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Aulas Hoje</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Reservas</p>
                      <p className="text-2xl font-bold">156</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Ocupação</p>
                      <p className="text-2xl font-bold">82%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <MapPin className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Modalidades</p>
                      <p className="text-2xl font-bold">6</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
                <TabsTrigger value="classes">Lista de Aulas</TabsTrigger>
                <TabsTrigger value="modalities">Modalidades</TabsTrigger>
                <TabsTrigger value="bookings">Reservas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="calendar" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-3">
                    <ClassCalendar
                      onEditClass={handleEditClass}
                      onNewClass={handleNewClass}
                    />
                  </div>
                  
                  <div className="lg:col-span-1">
                    {showForm ? (
                      <ClassForm
                        classData={selectedClass}
                        onSave={() => {
                          setShowForm(false);
                          setSelectedClass(null);
                        }}
                        onCancel={() => {
                          setShowForm(false);
                          setSelectedClass(null);
                        }}
                      />
                    ) : (
                      <Card>
                        <CardHeader>
                          <CardTitle>Próximas Aulas</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">CrossFit</p>
                                <p className="text-sm text-muted-foreground">06:00 - 07:00</p>
                                <p className="text-sm text-muted-foreground">Carlos Santos</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">12/20</p>
                                <p className="text-xs text-muted-foreground">vagas</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Yoga</p>
                                <p className="text-sm text-muted-foreground">07:30 - 08:30</p>
                                <p className="text-sm text-muted-foreground">Ana Costa</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">8/15</p>
                                <p className="text-xs text-muted-foreground">vagas</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="classes" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          placeholder="Pesquisar por modalidade, trainer..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      
                      <div className="flex gap-3">
                        <select
                          value={modalityFilter}
                          onChange={(e) => setModalityFilter(e.target.value)}
                          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="all">Todas Modalidades</option>
                          <option value="crossfit">CrossFit</option>
                          <option value="yoga">Yoga</option>
                          <option value="functional">Funcional</option>
                          <option value="pilates">Pilates</option>
                        </select>
                        
                        <select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                          <option value="today">Hoje</option>
                          <option value="week">Esta Semana</option>
                          <option value="month">Este Mês</option>
                        </select>
                        
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Mais Filtros
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <ClassList
                    searchTerm={searchTerm}
                    modalityFilter={modalityFilter}
                    dateFilter={dateFilter}
                    onEdit={handleEditClass}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="modalities" className="mt-6">
                <ModalityManagement />
              </TabsContent>
              
              <TabsContent value="bookings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestão de Reservas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Sistema de reservas em desenvolvimento...
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
