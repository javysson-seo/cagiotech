import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Calendar, MapPin, Users, Euro } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { useCompanyEvents } from '@/hooks/useCompanyEvents';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Events: React.FC = () => {
  const { currentCompany } = useCompany();
  const [searchTerm, setSearchTerm] = useState('');
  const { events, isLoading } = useCompanyEvents(currentCompany?.id || '');

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingEvents = events.filter(e => new Date(e.event_date) >= new Date()).length;
  const totalParticipants = events.reduce((acc, e) => acc + e.current_participants, 0);
  const activeEvents = events.filter(e => e.is_active).length;

  return (
    <div className="min-h-screen flex w-full">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col">
        <BoxHeader />
        
        <main className="flex-1 p-6 bg-gradient-to-br from-gray-50 via-white to-gray-100">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Eventos e Atividades</h1>
                <p className="text-muted-foreground">Organize eventos para seus alunos</p>
              </div>
              <Button style={{ backgroundColor: '#aeca12' }} className="text-white">
                <Plus className="mr-2 h-4 w-4" />
                Novo Evento
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(174, 202, 18, 0.1)' }}>
                    <Calendar className="h-6 w-6" style={{ color: '#aeca12' }} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Eventos</p>
                    <p className="text-2xl font-bold">{events.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Próximos</p>
                    <p className="text-2xl font-bold">{upcomingEvents}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-green-50">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Participantes</p>
                    <p className="text-2xl font-bold">{totalParticipants}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-purple-50">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ativos</p>
                    <p className="text-2xl font-bold">{activeEvents}</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {isLoading ? (
                <p className="text-center text-muted-foreground py-8">Carregando...</p>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Nenhum evento cadastrado</p>
                  <Button className="mt-4" style={{ backgroundColor: '#aeca12' }}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Evento
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEvents.map((event) => {
                    const isPast = new Date(event.event_date) < new Date();
                    
                    return (
                      <Card key={event.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-xl">{event.title}</h3>
                              <Badge variant={isPast ? 'secondary' : 'default'}>
                                {isPast ? 'Finalizado' : 'Próximo'}
                              </Badge>
                              {!event.is_active && (
                                <Badge variant="outline">Inativo</Badge>
                              )}
                            </div>

                            {event.description && (
                              <p className="text-muted-foreground mb-4">{event.description}</p>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>
                                  {format(new Date(event.event_date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </span>
                              </div>

                              {event.location && (
                                <div className="flex items-center gap-2 text-sm">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.location}</span>
                                </div>
                              )}

                              {event.max_participants && (
                                <div className="flex items-center gap-2 text-sm">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.current_participants}/{event.max_participants}</span>
                                </div>
                              )}

                              {event.price > 0 && (
                                <div className="flex items-center gap-2 text-sm font-bold" style={{ color: '#aeca12' }}>
                                  <Euro className="h-4 w-4" />
                                  <span>€{event.price.toFixed(2)}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 ml-4">
                            <Button variant="outline">Editar</Button>
                            <Button variant="outline">Inscrições</Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Events;