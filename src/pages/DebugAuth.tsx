import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const DebugAuth = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user) {
        const { data } = await supabase
          .from('user_roles')
          .select(`
            role, 
            company_id,
            companies (
              id,
              slug,
              name
            )
          `)
          .eq('user_id', session.user.id);
        
        setUserRoles(data || []);
      }
      setLoading(false);
    };

    fetchData();
  }, [session]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Debug de Autenticação</CardTitle>
            <CardDescription>Informações do usuário atual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Status:</h3>
              <p>{session ? '✅ Autenticado' : '❌ Não autenticado'}</p>
            </div>

            {user && (
              <div>
                <h3 className="font-semibold mb-2">Usuário (do Context):</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}

            {session && (
              <div>
                <h3 className="font-semibold mb-2">Session:</h3>
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify({ 
                    user_id: session.user.id,
                    email: session.user.email 
                  }, null, 2)}
                </pre>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Roles do Banco:</h3>
              {loading ? (
                <p>Carregando...</p>
              ) : userRoles.length > 0 ? (
                <pre className="bg-muted p-4 rounded-lg overflow-auto">
                  {JSON.stringify(userRoles, null, 2)}
                </pre>
              ) : (
                <p className="text-destructive">❌ Nenhuma role encontrada no banco de dados!</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button onClick={() => navigate('/auth/login')}>
                Ir para Login
              </Button>
              <Button onClick={() => navigate('/setup-test-users')}>
                Setup Usuários de Teste
              </Button>
              {session && (
                <Button 
                  variant="destructive" 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = '/auth/login';
                  }}
                >
                  Logout
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
