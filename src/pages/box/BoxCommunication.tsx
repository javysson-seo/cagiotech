import React, { useState } from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Bell, Lightbulb, Send, Plus } from 'lucide-react';
import { useCompany } from '@/contexts/CompanyContext';
import { supabase } from '@/integrations/supabase/client';
import { useCompanyMessages } from '@/hooks/useCompanyMessages';
import { useNotifications } from '@/hooks/useNotifications';
import { usePlatformSuggestions } from '@/hooks/usePlatformSuggestions';
import { useAthletes } from '@/hooks/useAthletes';
import { useTrainers } from '@/hooks/useTrainers';
import { useStaff } from '@/hooks/useStaff';
import { ChatMessages } from '@/components/communication/ChatMessages';
import { ChatInput } from '@/components/communication/ChatInput';
import { NotificationsList } from '@/components/communication/NotificationsList';
import { SuggestionCard } from '@/components/communication/SuggestionCard';
import { useAuth } from '@/hooks/useAuth';

const BoxCommunicationContent: React.FC = () => {
  const { currentCompany } = useCompany();
  const { user } = useAuth();
  const [selectedRecipient, setSelectedRecipient] = useState<string>('_all');
  const [notificationDialog, setNotificationDialog] = useState(false);
  const [suggestionDialog, setSuggestionDialog] = useState(false);

  // Convert "_all" to empty string for the hook
  const recipientForMessages = selectedRecipient === '_all' ? '' : selectedRecipient;

  const { messages, sendMessage } = useCompanyMessages(currentCompany?.id || '', recipientForMessages);
  const { notifications, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const { suggestions, createSuggestion, vote } = usePlatformSuggestions(currentCompany?.id);
  const { athletes } = useAthletes();
  const { trainers } = useTrainers();
  const { staff } = useStaff();

  const handleSendMessage = (message: string) => {
    sendMessage({
      message,
      recipientId: selectedRecipient === '_all' ? undefined : selectedRecipient,
    });
  };

  const handleCreateNotification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      const { error } = await supabase
        .from('company_notifications')
        .insert({
          company_id: currentCompany?.id,
          title: formData.get('title') as string,
          message: formData.get('message') as string,
          is_urgent: formData.get('urgent') === 'on',
          created_by: user?.id,
        });

      if (error) throw error;
      
      setNotificationDialog(false);
      e.currentTarget.reset();
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleCreateSuggestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createSuggestion({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
    });
    setSuggestionDialog(false);
    e.currentTarget.reset();
  };

  // Combine all recipients
  const allRecipients = [
    ...athletes.map(a => ({ id: a.id, name: a.name, type: 'Atleta' })),
    ...trainers.map(t => ({ id: t.user_id || t.id, name: t.name, type: 'Treinador' })),
    ...staff.map(s => ({ id: s.user_id || s.id, name: s.name, type: 'Colaborador' })),
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-full mx-auto p-6 space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Comunicação</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Chat, notificações e sugestões de melhorias
              </p>
            </div>

            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat Interno
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="h-4 w-4 mr-2" />
                  Notificações
                </TabsTrigger>
                <TabsTrigger value="suggestions">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Sugestões
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Chat Interno</CardTitle>
                        <CardDescription>
                          Converse com colaboradores e atletas
                        </CardDescription>
                      </div>
                      <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                        <SelectTrigger className="w-[250px] z-50 bg-popover">
                          <SelectValue placeholder="Todos (Geral)" />
                        </SelectTrigger>
                        <SelectContent className="z-50 bg-popover">
                          <SelectItem value="_all">Todos (Geral)</SelectItem>
                          {allRecipients.map(recipient => (
                            <SelectItem key={recipient.id} value={recipient.id}>
                              {recipient.name} ({recipient.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="h-[500px] overflow-y-auto border rounded-lg p-4">
                      <ChatMessages messages={messages} currentUserId={user?.id} />
                    </div>
                    <ChatInput
                      onSend={handleSendMessage}
                      placeholder={
                        selectedRecipient === '_all'
                          ? 'Mensagem para todos...'
                          : 'Mensagem direta...'
                      }
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <div className="flex justify-end">
                  <Dialog open={notificationDialog} onOpenChange={setNotificationDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Notificação
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleCreateNotification}>
                        <DialogHeader>
                          <DialogTitle>Nova Notificação</DialogTitle>
                          <DialogDescription>
                            Envie uma notificação para todos os membros
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="message">Mensagem</Label>
                            <Textarea id="message" name="message" required className="min-h-[100px]" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch id="urgent" name="urgent" />
                            <Label htmlFor="urgent">Marcar como urgente</Label>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">
                            <Send className="h-4 w-4 mr-2" />
                            Enviar
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <NotificationsList 
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  onDelete={deleteNotification}
                />
              </TabsContent>

              <TabsContent value="suggestions" className="space-y-4">
                <div className="flex justify-end">
                  <Dialog open={suggestionDialog} onOpenChange={setSuggestionDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Sugestão
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <form onSubmit={handleCreateSuggestion}>
                        <DialogHeader>
                          <DialogTitle>Sugerir Melhoria</DialogTitle>
                          <DialogDescription>
                            Sugira uma melhoria para a plataforma
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Título</Label>
                            <Input id="title" name="title" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea id="description" name="description" required className="min-h-[150px]" />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">Enviar Sugestão</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {suggestions.map(suggestion => (
                    <SuggestionCard
                      key={suggestion.id}
                      suggestion={suggestion}
                      onVote={(suggestionId, voteType) => vote({ suggestionId, voteType })}
                      canVote={suggestion.status === 'approved'}
                    />
                  ))}
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