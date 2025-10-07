import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle, Shield, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Loading } from '@/components/ui/loading';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userRoles } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (userRoles?.some(r => r.role === 'cagio_admin')) {
          navigate('/admin/dashboard');
        }
      }
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erro ao fazer login. Tente novamente.');
      }

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', authData.user.id);

      if (rolesError) throw rolesError;

      const isAdmin = userRoles?.some(r => r.role === 'cagio_admin');

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error('Acesso negado. Esta área é restrita a administradores CagioTech.');
      }

      toast.success('Login realizado com sucesso!');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Erro ao fazer login');
      toast.error(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CagioTech Admin
            </h1>
            <p className="text-muted-foreground mt-2">
              Área Administrativa do Sistema
            </p>
          </div>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">Acesso Restrito</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Apenas para administradores CagioTech
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nome de Usuário</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="cagiotech.pt"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  required
                  className="h-11"
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={loading}
                    required
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white" 
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar como Admin'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-900 font-medium">
                Credenciais padrão:
              </p>
              <p className="text-xs text-purple-700 mt-1">
                Email: cagiotech.pt
              </p>
              <p className="text-xs text-purple-700">
                Senha: cagiotech
              </p>
            </div>
          </CardContent>
        </Card>

        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar à página inicial
        </Link>
      </div>
    </div>
  );
};
