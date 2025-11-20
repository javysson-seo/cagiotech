import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export const AdminSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSetupAdmin = async () => {
    if (!user) {
      toast.error('Você precisa estar autenticado');
      return;
    }

    setLoading(true);

    try {
      // Verificar se já é admin
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', user.id)
        .eq('role', 'cagio_admin')
        .maybeSingle();

      if (existingRole) {
        toast.info('Você já é um administrador!');
        setSuccess(true);
        setTimeout(() => navigate('/admin/dashboard'), 2000);
        return;
      }

      // Inserir role de admin
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'cagio_admin'
        });

      if (error) throw error;

      setSuccess(true);
      toast.success('Acesso de administrador configurado com sucesso!');
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (error: any) {
      console.error('Erro ao configurar admin:', error);
      toast.error('Erro ao configurar acesso: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-cagio-green/5 to-background p-4">
      <Card className="w-full max-w-md border-cagio-green/20">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-cagio-green/10 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-cagio-green" />
          </div>
          <CardTitle className="text-2xl">Configuração de Administrador</CardTitle>
          <CardDescription>
            Configure o acesso de administrador da CagioTech
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!user ? (
            <div className="text-center space-y-4">
              <Lock className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                Você precisa estar autenticado para configurar o acesso de administrador
              </p>
              <Button onClick={() => navigate('/login')} className="w-full">
                Fazer Login
              </Button>
            </div>
          ) : success ? (
            <div className="text-center space-y-4">
              <CheckCircle className="h-12 w-12 text-cagio-green mx-auto" />
              <p className="font-medium text-cagio-green">
                Acesso configurado com sucesso!
              </p>
              <p className="text-sm text-muted-foreground">
                Redirecionando para o dashboard...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-cagio-green/5 border border-cagio-green/20 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Usuário Atual:</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-medium text-amber-900 mb-2">⚠️ Atenção!</p>
                <p className="text-xs text-amber-800">
                  Esta página permite configurar acesso de administrador. 
                  Apenas o dono da CagioTech deve ter acesso admin.
                </p>
              </div>

              <Button 
                onClick={handleSetupAdmin}
                disabled={loading}
                className="w-full bg-cagio-green hover:bg-cagio-green-dark"
              >
                {loading ? 'Configurando...' : 'Configurar como Administrador'}
              </Button>

              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
