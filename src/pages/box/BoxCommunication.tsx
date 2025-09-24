import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Send, Users, UserCheck, Calendar, Bell } from 'lucide-react';

const BoxCommunicationContent: React.FC = () => {
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const communications = [
    {
      id: 1,
      subject: 'Lembrete: Aula de CrossFit hoje às 18h',
      recipient: 'Todos os atletas',
      type: 'reminder',
      sent_at: '2024-01-15 14:30',
      status: 'sent'
    },
    {
      id: 2,
      subject: 'Nova modalidade: Yoga',
      recipient: 'Atletas do grupo Iniciantes',
      type: 'announcement',
      sent_at: '2024-01-14 10:15',
      status: 'sent'
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Comunicação</h1>
              <p className="text-muted-foreground">
                Gerir comunicações com atletas e equipa
              </p>
            </div>

            <Tabs defaultValue="send" className="space-y-4">
              <TabsList>
                <TabsTrigger value="send">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
                </TabsTrigger>
                <TabsTrigger value="history">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Histórico
                </TabsTrigger>
                <TabsTrigger value="templates">
                  <Bell className="h-4 w-4 mr-2" />
                  Modelos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="send">
                <Card>
                  <CardHeader>
                    <CardTitle>Nova Mensagem</CardTitle>
                    <CardDescription>
                      Enviar mensagem para atletas, treinadores ou grupos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Destinatário</label>
                        <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecionar destinatário" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Todos os atletas</SelectItem>
                            <SelectItem value="trainers">Todos os treinadores</SelectItem>
                            <SelectItem value="group-beginners">Grupo Iniciantes</SelectItem>
                            <SelectItem value="group-advanced">Grupo Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Tipo</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Tipo de mensagem" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="message">Mensagem</SelectItem>
                            <SelectItem value="announcement">Anúncio</SelectItem>
                            <SelectItem value="reminder">Lembrete</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Assunto</label>
                      <Input 
                        placeholder="Assunto da mensagem"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Mensagem</label>
                      <Textarea 
                        placeholder="Escreva a sua mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Guardar Rascunho</Button>
                      <Button>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Comunicações</CardTitle>
                    <CardDescription>
                      Todas as mensagens enviadas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {communications.map(comm => (
                        <div key={comm.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{comm.subject}</h4>
                              <p className="text-sm text-muted-foreground mt-1">
                                Para: {comm.recipient}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {comm.sent_at}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={comm.type === 'reminder' ? 'default' : 'secondary'}>
                                {comm.type === 'reminder' ? 'Lembrete' : 
                                 comm.type === 'announcement' ? 'Anúncio' : 'Mensagem'}
                              </Badge>
                              <Badge variant="outline">
                                {comm.status === 'sent' ? 'Enviado' : 'Rascunho'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Lembrete de Aula</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Modelo para lembrar atletas sobre aulas
                      </p>
                      <Button variant="outline" size="sm">Usar Modelo</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Nova Modalidade</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Anunciar novas modalidades ou serviços
                      </p>
                      <Button variant="outline" size="sm">Usar Modelo</Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Pagamento Pendente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Lembrete de pagamentos em atraso
                      </p>
                      <Button variant="outline" size="sm">Usar Modelo</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export const BoxCommunication: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxCommunicationContent />
    </AreaThemeProvider>
  );
};