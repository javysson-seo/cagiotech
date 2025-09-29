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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  MessageSquare, 
  Send, 
  Users, 
  UserCheck, 
  Calendar, 
  Bell,
  Search,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreHorizontal,
  MessageCircle,
  Clock
} from 'lucide-react';

const BoxCommunicationContent: React.FC = () => {
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [selectedChat, setSelectedChat] = useState('general');
  const [chatMessage, setChatMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const chats = [
    {
      id: 'general',
      name: 'Geral',
      type: 'channel',
      lastMessage: 'João: Boa tarde pessoal!',
      time: '14:30',
      unread: 3,
      participants: 12
    },
    {
      id: 'trainers',
      name: 'Equipe de Instrutores',
      type: 'channel',
      lastMessage: 'Maria: Reunião amanhã às 9h',
      time: '13:45',
      unread: 1,
      participants: 5
    },
    {
      id: 'admin',
      name: 'Administração',
      type: 'channel',
      lastMessage: 'Carlos: Relatório financeiro pronto',
      time: '12:20',
      unread: 0,
      participants: 3
    },
    {
      id: 'maintenance',
      name: 'Manutenção',
      type: 'channel',
      lastMessage: 'Pedro: Equipamento da sala 2 ok',
      time: '11:15',
      unread: 0,
      participants: 4
    }
  ];

  const chatMessages = [
    {
      id: 1,
      sender: 'João Silva',
      avatar: 'JS',
      message: 'Pessoal, como estão as matrículas esta semana?',
      time: '14:20',
      isOwn: false
    },
    {
      id: 2,
      sender: 'Maria Santos',
      avatar: 'MS',
      message: 'Tivemos 5 novas matrículas nos últimos 3 dias!',
      time: '14:22',
      isOwn: false
    },
    {
      id: 3,
      sender: 'Você',
      avatar: 'EU',
      message: 'Excelente! Vamos manter esse ritmo.',
      time: '14:25',
      isOwn: true
    },
    {
      id: 4,
      sender: 'Carlos Lima',
      avatar: 'CL',
      message: 'O novo equipamento chegou hoje, vou instalar amanhã.',
      time: '14:28',
      isOwn: false
    },
    {
      id: 5,
      sender: 'João Silva',
      avatar: 'JS',
      message: 'Boa tarde pessoal! 👋',
      time: '14:30',
      isOwn: false
    }
  ];

  const sendChatMessage = () => {
    if (chatMessage.trim()) {
      console.log('Enviando mensagem:', chatMessage);
      setChatMessage('');
    }
  };

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

            <Tabs defaultValue="chat" className="space-y-4">
              <TabsList>
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Interno
                </TabsTrigger>
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

              <TabsContent value="chat" className="space-y-4">
                {/* Chat Interface */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-300px)]">
                  {/* Sidebar with Chats */}
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Conversas
                      </CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Buscar conversas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-1 p-4">
                          {chats.map((chat) => (
                            <div
                              key={chat.id}
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedChat === chat.id ? 'bg-primary/10' : 'hover:bg-muted/50'
                              }`}
                              onClick={() => setSelectedChat(chat.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <MessageCircle className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-sm">{chat.name}</h4>
                                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                                      {chat.lastMessage}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">{chat.time}</p>
                                  {chat.unread > 0 && (
                                    <Badge variant="destructive" className="text-xs mt-1">
                                      {chat.unread}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>

                  {/* Main Chat Area */}
                  <Card className="lg:col-span-3 flex flex-col">
                    {/* Chat Header */}
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <MessageCircle className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {chats.find(c => c.id === selectedChat)?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {chats.find(c => c.id === selectedChat)?.participants} membros
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Messages Area */}
                    <CardContent className="flex-1 p-0">
                      <ScrollArea className="h-[350px] p-4">
                        <div className="space-y-4">
                          {chatMessages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex gap-3 ${msg.isOwn ? 'flex-row-reverse' : ''}`}
                            >
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">{msg.avatar}</AvatarFallback>
                              </Avatar>
                              <div className={`flex flex-col ${msg.isOwn ? 'items-end' : ''}`}>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-medium">{msg.sender}</span>
                                  <span className="text-xs text-muted-foreground">{msg.time}</span>
                                </div>
                                <div
                                  className={`p-3 rounded-lg max-w-[70%] ${
                                    msg.isOwn
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm">{msg.message}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </CardContent>

                    {/* Message Input */}
                    <div className="p-4 border-t">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Smile className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 flex gap-2">
                          <Input
                            placeholder="Digite sua mensagem..."
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                            className="flex-1"
                          />
                          <Button onClick={sendChatMessage}>
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Quick Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Membros Online
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">João Silva</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Maria Santos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm">Carlos Lima (ausente)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Atividade Recente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <p><strong>14:30</strong> - João enviou mensagem</p>
                        <p><strong>14:22</strong> - Maria entrou no chat</p>
                        <p><strong>14:15</strong> - Carlos compartilhou arquivo</p>
                        <p><strong>14:10</strong> - Nova conversa criada</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Estatísticas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Total de membros:</span>
                          <span className="font-medium">15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Online agora:</span>
                          <span className="font-medium text-green-600">8</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mensagens hoje:</span>
                          <span className="font-medium">47</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

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