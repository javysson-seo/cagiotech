import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Clock, Mail, AlertCircle, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const PendingApproval = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logout realizado com sucesso');
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4">
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl">Aguardando Aprovação</CardTitle>
          <CardDescription>
            Seu cadastro está em análise
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Seu cadastro foi recebido e está sendo analisado pela academia. 
              Você receberá um email assim que for aprovado.
            </AlertDescription>
          </Alert>

          <div className="space-y-4 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4" />
              O que acontece agora?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
              <li>A academia irá revisar seus dados</li>
              <li>Você receberá um email de confirmação</li>
              <li>Após a aprovação, poderá acessar a plataforma normalmente</li>
            </ul>
          </div>

          <Alert className="bg-blue-500/10 border-blue-500/20">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              <strong>Dúvidas?</strong> Entre em contato diretamente com a academia para mais informações sobre seu cadastro.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
