
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  MapPin,
  Users,
  Euro,
  Star
} from 'lucide-react';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { ClassBookingList } from '@/components/bookings/ClassBookingList';
import { BookingCalendar } from '@/components/bookings/BookingCalendar';
import { BookingHistory } from '@/components/bookings/BookingHistory';

export const BookingManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [modalityFilter, setModalityFilter] = useState('all');

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <StudentHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Reservar Aulas
                </h1>
                <p className="text-muted-foreground">
                  Encontre e reserve as suas aulas favoritas
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Reservas Ativas</p>
                      <p className="text-2xl font-bold">3</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Próxima Aula</p>
                      <p className="text-2xl font-bold">2h 30m</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Euro className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-muted-foreground">Créditos</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="available">Aulas Disponíveis</TabsTrigger>
                <TabsTrigger value="calendar">Calendário</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>
              
              <TabsContent value="available" className="mt-6">
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
                        
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Mais Filtros
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <ClassBookingList
                    searchTerm={searchTerm}
                    modalityFilter={modalityFilter}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="calendar" className="mt-6">
                <BookingCalendar />
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <BookingHistory />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
