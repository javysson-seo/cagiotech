
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { MessageSquare, Mail, Phone, Send, Users, Calendar } from 'lucide-react';

export const CommunicationCenter: React.FC = () => {
  const [message, setMessage] = useState('');
  const [selectedChannel, setSelectedChannel] = useState('whatsapp');

  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Centro de Comunicação</h1>
              <p className="text-muted-foreground">Gerir comunicações com atletas e staff</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">WhatsApp</CardTitle>
                  <MessageSquare className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">142</div>
                  <p className="text-xs text-muted-foreground">Contactos ativos</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Email</CardTitle>
                  <Mail className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98%</div>
                  <p className="text-xs text-muted-foreground">Taxa de entrega</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">SMS</CardTitle>
                  <Phone className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€0,05</div>
                  <p className="text-xs text-muted-foreground">Por mensagem</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Campanhas</CardTitle>
                  <Calendar className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Ativas este mês</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="compose" className="space-y-6">
              <TabsList>
                <TabsTrigger value="compose">Nova Mensagem</TabsTrigger>
                <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
                <TabsTrigger value="templates">Modelos</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
              </TabsList>

              <TabsContent value="compose">
                <Card>
                  <CardHeader>
                    <CardTitle>Enviar Nova Mensagem</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Channel Selection */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Canal</label>
                      <div className="grid grid-cols-3 gap-3">
                        <Button
                          variant={selectedChannel === 'whatsapp' ? 'default' : 'outline'}
                          onClick={() => setSelectedChannel('whatsapp')}
                          className="flex items-center space-x-2"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>WhatsApp</span>
                        </Button>
                        <Button
                          variant={selectedChannel === 'email' ? 'default' : 'outline'}
                          onClick={() => setSelectedChannel('email')}
                          className="flex items-center space-x-2"
                        >
                          <Mail className="h-4 w-4" />
                          <span>Email</span>
                        </Button>
                        <Button
                          variant={selectedChannel === 'sms' ? 'default' : 'outline'}
                          onClick={() => setSelectedChannel('sms')}
                          className="flex items-center space-x-2"
                        >
                          <Phone className="h-4 w-4" />
                          <span>SMS</span>
                        </Button>
                      </div>
                    </div>

                    {/* Recipients */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Destinatários</label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Todos os Atletas (142)
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Users className="h-4 w-4 mr-2" />
                          Apenas Trainers (8)
                        </Button>
                      </div>
                    </div>

                    {/* Subject (for email) */}
                    {selectedChannel === 'email' && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Assunto</label>
                        <Input placeholder="Assunto do email..." />
                      </div>
                    )}

                    {/* Message */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Mensagem</label>
                      <Textarea
                        placeholder={`Escreva a sua mensagem para ${selectedChannel}...`}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground">
                        {message.length} / {selectedChannel === 'sms' ? '160' : '1000'} caracteres
                      </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <Button variant="outline">Guardar Rascunho</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Agora
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="campaigns">
                <Card>
                  <CardHeader>
                    <CardTitle>Campanhas Ativas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium">Lembrete de Aulas</h3>
                        <p className="text-sm text-muted-foreground">
                          Lembretes automáticos 1h antes das aulas
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm">WhatsApp • Diário</span>
                          <Button size="sm" variant="outline">Editar</Button>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium">Renovação de Planos</h3>
                        <p className="text-sm text-muted-foreground">
                          Aviso de renovação 7 dias antes do vencimento
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm">Email • Automático</span>
                          <Button size="sm" variant="outline">Editar</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="templates">
                <Card>
                  <CardHeader>
                    <CardTitle>Modelos de Mensagem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h3 className="font-medium">Boas-vindas</h3>
                        <p className="text-sm text-muted-foreground">
                          Olá {'{nome}'}, bem-vindo à nossa BOX! 💪
                        </p>
                        <Button size="sm" variant="outline" className="mt-2">
                          Usar Modelo
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Comunicações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Histórico de mensagens enviadas nos últimos 30 dias
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
