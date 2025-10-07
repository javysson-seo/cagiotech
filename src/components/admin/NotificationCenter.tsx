import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Bell, Send, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const NotificationCenter: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetCompany, setTargetCompany] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: companies } = useQuery({
    queryKey: ['companies-list'],
    queryFn: async () => {
      const { data } = await supabase
        .from('companies')
        .select('id, name')
        .order('name');
      return data || [];
    },
  });

  const sendNotification = useMutation({
    mutationFn: async () => {
      if (!title || !message) {
        throw new Error('Título e mensagem são obrigatórios');
      }

      if (targetCompany === 'all') {
        // Enviar para todas as empresas
        const companyIds = companies?.map(c => c.id) || [];
        
        const notifications = companyIds.map(companyId => ({
          company_id: companyId,
          type: 'system',
          title,
          message,
          data: { source: 'admin' }
        }));

        const { error } = await supabase
          .from('notifications')
          .insert(notifications);

        if (error) throw error;
      } else {
        // Enviar para empresa específica
        const { error } = await supabase
          .from('notifications')
          .insert({
            company_id: targetCompany,
            type: 'system',
            title,
            message,
            data: { source: 'admin' }
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success('Notificação enviada com sucesso!');
      setTitle('');
      setMessage('');
      setTargetCompany('all');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: any) => {
      toast.error(`Erro ao enviar notificação: ${error.message}`);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-purple-600" />
          Centro de Notificações
        </CardTitle>
        <CardDescription>
          Enviar notificações para empresas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="target">Empresa Alvo</Label>
          <Select value={targetCompany} onValueChange={setTargetCompany}>
            <SelectTrigger id="target">
              <SelectValue placeholder="Selecionar empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Empresas</SelectItem>
              {companies?.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Título da notificação"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensagem</Label>
          <Textarea
            id="message"
            placeholder="Escreva a mensagem da notificação..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-800">
            {targetCompany === 'all' 
              ? `Esta notificação será enviada para todas as ${companies?.length || 0} empresas registadas.`
              : 'Esta notificação será enviada apenas para a empresa selecionada.'}
          </p>
        </div>

        <Button
          onClick={() => sendNotification.mutate()}
          disabled={sendNotification.isPending || !title || !message}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Send className="mr-2 h-4 w-4" />
          {sendNotification.isPending ? 'Enviando...' : 'Enviar Notificação'}
        </Button>
      </CardContent>
    </Card>
  );
};
