import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const SetupTestUsers: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('🚀 Invoking setup-test-users function...');
      
      const { data, error: functionError } = await supabase.functions.invoke('setup-test-users', {
        body: {}
      });

      console.log('📦 Function response:', data);
      console.log('❌ Function error:', functionError);

      if (functionError) {
        console.error('Function invocation error:', functionError);
        throw new Error(`Function error: ${functionError.message}`);
      }

      if (data?.success) {
        setSuccess(true);
        console.log('✅ Users created:', data.users);
      } else {
        throw new Error(data?.error || data?.details || 'Unknown error');
      }
    } catch (err: any) {
      console.error('❌ Setup error:', err);
      setError(`Erro: ${err.message}. Verifique os logs da função no Supabase.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Configurar Usuários de Teste</CardTitle>
          <CardDescription>
            Crie automaticamente 4 usuários de teste para todas as áreas da aplicação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Usuários que serão criados:</h3>
            
            <div className="space-y-2">
              <div className="border rounded-lg p-3">
                <div className="font-medium">Admin</div>
                <div className="text-sm text-muted-foreground">Email: cagiotech@admin.com</div>
                <div className="text-sm text-muted-foreground">Senha: Cagiotech123/</div>
              </div>

              <div className="border rounded-lg p-3">
                <div className="font-medium">Company Owner (Box Owner)</div>
                <div className="text-sm text-muted-foreground">Email: cagiotech@company.com</div>
                <div className="text-sm text-muted-foreground">Senha: Cagiotech123/</div>
                <div className="text-xs text-muted-foreground mt-1">Company: Cagio Tech Test Company</div>
              </div>

              <div className="border rounded-lg p-3">
                <div className="font-medium">Student (Athlete)</div>
                <div className="text-sm text-muted-foreground">Email: cagiotech@student.com</div>
                <div className="text-sm text-muted-foreground">Senha: Cagiotech123/</div>
                <div className="text-xs text-muted-foreground mt-1">Vinculado à: Cagio Tech Test Company</div>
              </div>

              <div className="border rounded-lg p-3">
                <div className="font-medium">Personal Trainer</div>
                <div className="text-sm text-muted-foreground">Email: cagiotech@personal.com</div>
                <div className="text-sm text-muted-foreground">Senha: Cagiotech123/</div>
                <div className="text-xs text-muted-foreground mt-1">Vinculado à: Cagio Tech Test Company</div>
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-600 dark:text-green-400">
                Usuários de teste criados com sucesso! Você pode fazer login com qualquer um deles.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleSetup} 
            disabled={loading || success}
            className="w-full"
            size="lg"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {success ? 'Concluído' : 'Criar Usuários de Teste'}
          </Button>

          {success && (
            <div className="text-center">
              <Button variant="outline" asChild>
                <a href="/auth/login">Ir para Login</a>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
