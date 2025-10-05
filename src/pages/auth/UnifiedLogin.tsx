import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Dumbbell, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loading } from '@/components/ui/loading';

export const UnifiedLogin: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleRedirect(session.user.id);
      }
    });
  }, []);

  const handleRedirect = async (userId: string) => {
    try {
      // Get user roles
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role, company_id')
        .eq('user_id', userId);

      if (!userRoles || userRoles.length === 0) {
        toast.error('Sem permissões atribuídas');
        return;
      }

      // Get the first role (priority: cagio_admin > box_owner > personal_trainer > student)
      const roleOrder = ['cagio_admin', 'box_owner', 'personal_trainer', 'staff_member', 'student'];
      const sortedRole = userRoles.sort((a, b) => 
        roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
      )[0];

      console.log('Redirecting with role:', sortedRole.role);

      // Redirect based on role
      switch (sortedRole.role) {
        case 'cagio_admin':
          navigate('/admin/dashboard');
          break;
        case 'box_owner':
          if (sortedRole.company_id) {
            const { data: company } = await supabase
              .from('companies')
              .select('id')
              .eq('id', sortedRole.company_id)
              .single();
            navigate(company ? `/${company.id}` : '/box/dashboard');
          } else {
            navigate('/box/dashboard');
          }
          break;
        case 'personal_trainer':
          navigate('/trainer/dashboard');
          break;
        case 'staff_member':
          navigate('/box/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
        default:
          toast.error('Tipo de usuário não reconhecido');
      }
    } catch (error) {
      console.error('Error redirecting:', error);
      toast.error('Erro ao redirecionar');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou password incorretos');
        } else {
          setError(signInError.message);
        }
        return;
      }

      if (data.user) {
        toast.success('Login realizado com sucesso!');
        await handleRedirect(data.user.id);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CAGIO
          </h1>
          <p className="text-muted-foreground mt-2">
            Sistema de Gestão para BOX de CrossFit
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                disabled={loading}
              >
                {loading ? <Loading size="sm" text="Entrando..." /> : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem conta? </span>
              <Link to="/auth/box-register" className="text-blue-600 hover:underline font-medium">
                Registrar BOX
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          O sistema identifica automaticamente o seu tipo de acesso
        </p>
      </div>
    </div>
  );
};
