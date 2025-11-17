import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle, XCircle, Clock, Mail, Phone } from 'lucide-react';
import { useAthletes } from '@/hooks/useAthletes';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const ApprovalQueue = () => {
  const { athletes, loading } = useAthletes();
  const { user } = useAuth();
  const [processing, setProcessing] = useState<string | null>(null);

  const pendingAthletes = athletes.filter(a => !a.is_approved || a.status === 'pending');

  const handleApprove = async (athleteId: string) => {
    setProcessing(athleteId);
    try {
      const { error } = await supabase
        .from('athletes')
        .update({
          is_approved: true,
          approved_at: new Date().toISOString(),
          approved_by: user?.id,
          status: 'active'
        })
        .eq('id', athleteId);

      if (error) throw error;
      toast.success('Atleta aprovado com sucesso!');
    } catch (error: any) {
      toast.error('Erro ao aprovar atleta');
      console.error(error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (athleteId: string) => {
    setProcessing(athleteId);
    try {
      const { error } = await supabase
        .from('athletes')
        .update({
          status: 'inactive',
          blocked_reason: 'Cadastro rejeitado pela administração'
        })
        .eq('id', athleteId);

      if (error) throw error;
      toast.success('Cadastro rejeitado');
    } catch (error: any) {
      toast.error('Erro ao rejeitar cadastro');
      console.error(error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (pendingAthletes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CheckCircle className="h-12 w-12 text-cagio-green mb-4" />
          <p className="text-muted-foreground">Não há cadastros pendentes de aprovação</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Cadastros Pendentes
            </CardTitle>
            <CardDescription>
              {pendingAthletes.length} {pendingAthletes.length === 1 ? 'cadastro aguardando' : 'cadastros aguardando'} aprovação
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-orange-500 border-orange-500">
            {pendingAthletes.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingAthletes.map((athlete) => (
          <div
            key={athlete.id}
            className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-4 flex-1">
              <Avatar className="h-12 w-12">
                <AvatarImage src={athlete.profile_photo} alt={athlete.name} />
                <AvatarFallback className="bg-orange-100 text-orange-700">
                  {athlete.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-medium">{athlete.name}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  {athlete.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {athlete.email}
                    </div>
                  )}
                  {athlete.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {athlete.phone}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cadastrado em: {(athlete as any).created_at ? new Date((athlete as any).created_at).toLocaleDateString('pt-PT') : 'Data não disponível'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(athlete.id)}
                disabled={processing === athlete.id}
                className="text-destructive hover:bg-destructive/10"
              >
                <XCircle className="h-4 w-4 mr-1" />
                Rejeitar
              </Button>
              <Button
                size="sm"
                onClick={() => handleApprove(athlete.id)}
                disabled={processing === athlete.id}
                className="bg-cagio-green hover:bg-cagio-green-dark"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Aprovar
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};