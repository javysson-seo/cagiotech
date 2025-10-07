
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loading } from '@/components/ui/loading';
import { Logo } from '@/components/ui/logo';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
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

      // Get the first role (priority: cagio_admin > box_owner > personal_trainer > staff_member > student)
      const roleOrder = ['cagio_admin', 'box_owner', 'personal_trainer', 'staff_member', 'student'];
      const sortedRole = userRoles.sort((a, b) => 
        roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
      )[0];

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/f11d946f-1e84-4046-8622-ffeb54bba33e.png" 
              alt="CagioTech Logo" 
              className="h-24 w-auto"
            />
          </div>
          <p className="text-muted-foreground mt-2">
            Sistema de Gestão Fitness & Wellness
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Entrar</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) => setFormData({ ...formData, rememberMe: checked as boolean })}
                    disabled={loading}
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm font-normal cursor-pointer"
                  >
                    Lembrar-me
                  </Label>
                </div>
                <Link 
                  to="/auth/password-recovery" 
                  className="text-sm hover:underline font-medium"
                  style={{ color: '#aeca12' }}
                >
                  Esqueci a senha
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-white hover:opacity-90 transition-opacity" 
                style={{ backgroundColor: '#aeca12' }}
                disabled={loading}
              >
                {loading ? <Loading size="sm" text="Entrando..." /> : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Não tem conta? </span>
              <Link 
                to="/auth/box-register" 
                className="hover:underline font-medium"
                style={{ color: '#aeca12' }}
              >
                Registrar BOX
              </Link>
            </div>
          </CardContent>
        </Card>

        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mt-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à página inicial
        </Link>
      </div>
    </div>
  );
};
