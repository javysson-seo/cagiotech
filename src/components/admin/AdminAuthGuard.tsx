import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        // Verifica se o usuário tem a role cagio_admin
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'cagio_admin')
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('Error in admin check:', error);
        setIsAdmin(false);
      } finally {
        setChecking(false);
      }
    };

    if (!isLoading) {
      checkAdminStatus();
    }
  }, [user, isLoading]);

  // Mostrar loading enquanto verifica
  if (isLoading || checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Card className="w-[400px]">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 text-cagio-green animate-pulse" />
            </div>
            <CardTitle className="text-center">Verificando Acesso</CardTitle>
            <CardDescription className="text-center">
              A validar as suas credenciais de administrador...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Redirecionar se não estiver autenticado
  if (!user) {
    navigate('/login');
    return null;
  }

  // Mostrar erro se não for admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <Card className="w-[500px] border-destructive">
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-center text-destructive">
              Acesso Negado
            </CardTitle>
            <CardDescription className="text-center">
              Você não tem permissões de administrador para acessar esta área.
              Esta tentativa de acesso foi registrada.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/box/dashboard')}
            >
              Voltar ao Dashboard
            </Button>
            <Button
              variant="default"
              onClick={() => navigate('/')}
            >
              Ir para Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Se for admin, renderizar children
  return <>{children}</>;
};