import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2, AlertCircle, Building2, GraduationCap, Dumbbell } from 'lucide-react';
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
            Crie automaticamente 3 usuários de teste para todas as áreas da aplicação
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Usuários que serão criados:</h3>
            
            <div className="space-y-2">
              <div className="border rounded-lg p-4 bg-primary/5">
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div className="font-medium">Company Owner (Área da Empresa)</div>
                </div>
                <div className="mt-2 ml-8 space-y-1">
                  <div className="text-sm text-muted-foreground">Email: <code className="bg-muted px-1 rounded">company@cagiotech.com</code></div>
                  <div className="text-sm text-muted-foreground">Senha: <code className="bg-muted px-1 rounded">123456</code></div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-blue-500/5">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <div className="font-medium">Aluno (Área do Atleta)</div>
                </div>
                <div className="mt-2 ml-8 space-y-1">
                  <div className="text-sm text-muted-foreground">Email: <code className="bg-muted px-1 rounded">aluno@cagiotech.com</code></div>
                  <div className="text-sm text-muted-foreground">Senha: <code className="bg-muted px-1 rounded">123456</code></div>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-orange-500/5">
                <div className="flex items-center gap-3">
                  <Dumbbell className="h-5 w-5 text-orange-500" />
                  <div className="font-medium">Trainer (Área do Treinador)</div>
                </div>
                <div className="mt-2 ml-8 space-y-1">
                  <div className="text-sm text-muted-foreground">Email: <code className="bg-muted px-1 rounded">staff@cagiotech.com</code></div>
                  <div className="text-sm text-muted-foreground">Senha: <code className="bg-muted px-1 rounded">123456</code></div>
                </div>
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
