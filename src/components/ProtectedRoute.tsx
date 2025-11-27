
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/loading';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
  requireApproval?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  redirectTo = '/auth/login',
  requireApproval = true
}) => {
  const { user, isLoading, logout } = useAuth();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loading size="lg" text="Verificando autenticação..." />
      </div>
    );
  }

  // Not authenticated
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check approval status - box_owner and box_admin don't need approval OR if explicitly not required
  if (requireApproval && !user.isApproved && user.role !== 'box_owner' && user.role !== 'box_admin' && user.role !== 'cagio_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Conta Pendente de Aprovação
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sua conta está aguardando aprovação do administrador. 
                  Você receberá um email quando for aprovada.
                </p>
              </div>

              <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Função:</strong> {user.role}</p>
                {user.boxName && <p><strong>BOX:</strong> {user.boxName}</p>}
              </div>

              <Button variant="outline" onClick={logout} className="w-full">
                Fazer Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check role permissions
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Acesso Negado
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Você não tem permissão para acessar esta área.
                </p>
              </div>

              <div className="space-y-2">
                <Button onClick={() => window.history.back()} className="w-full">
                  Voltar
                </Button>
                <Button variant="outline" onClick={logout} className="w-full">
                  Fazer Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};
