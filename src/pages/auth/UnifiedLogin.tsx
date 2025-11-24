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
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
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
      // Get user roles with company details
      const { data: userRoles, error: rolesError } = await supabase
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
        .eq('user_id', userId);

      if (rolesError) {
        console.error('Error fetching roles:', rolesError);
        toast.error('Erro ao buscar permissões');
        return;
      }

      if (!userRoles || userRoles.length === 0) {
        console.error('No roles found for user');
        toast.error('Usuário sem permissões. Contacte o suporte.');
        // Redirect to a waiting page or logout
        await supabase.auth.signOut();
        return;
      }

      // Get the first role (priority: cagio_admin > box_owner > personal_trainer > student)
      const roleOrder = ['cagio_admin', 'box_owner', 'personal_trainer', 'staff_member', 'student'];
      const sortedRole = userRoles.sort((a, b) => 
        roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
      )[0];

      console.log('Redirecting with role:', sortedRole.role, 'company:', sortedRole.companies);

      // Redirect based on role
      switch (sortedRole.role) {
        case 'cagio_admin':
          toast.success('Bem-vindo, Admin!');
          navigate('/admin/dashboard');
          break;
        case 'box_owner':
          if (sortedRole.company_id && sortedRole.companies) {
            const company = sortedRole.companies as any;
            // Use slug if available, fallback to ID
            const companyPath = company.slug || company.id;
            toast.success(`Bem-vindo à ${company.name}!`);
            navigate(`/${companyPath}/dashboard`);
          } else {
            toast.success('Bem-vindo!');
            navigate('/box/dashboard');
          }
          break;
        case 'personal_trainer':
          toast.success('Bem-vindo, Treinador!');
          navigate('/trainer/dashboard');
          break;
        case 'staff_member':
          toast.success('Bem-vindo!');
          navigate('/box/dashboard');
          break;
        case 'student':
          toast.success('Bem-vindo, Atleta!');
          navigate('/student/dashboard');
          break;
        default:
          toast.error('Tipo de usuário não reconhecido');
          await supabase.auth.signOut();
      }
    } catch (error) {
      console.error('Error redirecting:', error);
      toast.error('Erro ao redirecionar. Tente novamente.');
    }
  };

  const handleResendConfirmation = async () => {
    setResendingEmail(true);
    setError(null);

    try {
      // Delete old codes first
      await supabase
        .from('email_verification_codes')
        .delete()
        .eq('email', formData.email);

      // Get company name for the email
      const { data: companies } = await supabase
        .from('companies')
        .select('name')
        .limit(1);
      
      const companyName = companies?.[0]?.name || 'CagioTech';

      const { error: functionError } = await supabase.functions.invoke('send-verification-code', {
        body: { 
          email: formData.email,
          companyName: companyName
        }
      });

      if (functionError) throw functionError;

      toast.success('Novo código de confirmação enviado! Verifique sua caixa de entrada.');
      
      // Redirect to verification page
      navigate('/auth/verify-email', {
        state: {
          email: formData.email,
          password: formData.password,
          companyName: companyName
        }
      });
    } catch (error: any) {
      console.error('Error resending confirmation:', error);
      setError('Erro ao reenviar email de confirmação. Tente novamente.');
    } finally {
      setResendingEmail(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailNotConfirmed(false);
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message.includes('Email not confirmed') || 
            signInError.message.includes('email_not_confirmed')) {
          setEmailNotConfirmed(true);
          setError('Email não confirmado. Por favor, verifique seu email ou reenvie o código de confirmação.');
        } else if (signInError.message.includes('Invalid login credentials')) {
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
              src="/lovable-uploads/ceef2c27-35ec-471c-a76f-fa4cbb07ecaa.png" 
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
            <CardDescription className="text-center">
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {error}
                    {emailNotConfirmed && (
                      <Button
                        type="button"
                        variant="link"
                        className="ml-2 p-0 h-auto underline"
                        onClick={handleResendConfirmation}
                        disabled={resendingEmail}
                      >
                        {resendingEmail ? 'Reenviando...' : 'Reenviar código'}
                      </Button>
                    )}
                  </AlertDescription>
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
                className="w-full h-11 text-white hover:opacity-90 transition-opacity" 
                style={{ backgroundColor: '#aeca12' }}
                disabled={loading}
              >
                {loading ? <Loading size="sm" text="Entrando..." /> : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 space-y-3 text-center text-sm">
              <div>
                <span className="text-muted-foreground">Esqueceu a senha? </span>
                <Link 
                  to="/auth/password-recovery" 
                  className="hover:underline font-medium"
                  style={{ color: '#aeca12' }}
                >
                  Recuperar senha
                </Link>
              </div>
              
              <div>
                <span className="text-muted-foreground">Não tem conta? </span>
                <Link 
                  to="/auth/box-register" 
                  className="hover:underline font-medium"
                  style={{ color: '#aeca12' }}
                >
                  Registrar Empresa
                </Link>
              </div>
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
