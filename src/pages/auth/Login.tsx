
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
import { useUserProfiles, UserProfile } from '@/hooks/useUserProfiles';
import { ProfileSelector } from '@/components/auth/ProfileSelector';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showProfileSelector, setShowProfileSelector] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const { profiles, loading: profilesLoading, setSelectedProfile, clearSelectedProfile } = useUserProfiles(userId);

  useEffect(() => {
    // Check if already logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleRedirect(session.user.id);
      }
    });
  }, []);

  const handleRedirect = async (userId: string, selectedProfile?: UserProfile) => {
    try {
      // If we have a selected profile, use it directly
      if (selectedProfile) {
        redirectToProfile(selectedProfile);
        return;
      }

      // Set userId to trigger profiles loading
      setUserId(userId);
    } catch (error) {
      console.error('Error redirecting:', error);
      toast.error('Erro ao redirecionar');
    }
  };

  const redirectToProfile = (profile: UserProfile) => {
    switch (profile.type) {
      case 'box_owner':
        navigate(`/${profile.companyId}`);
        break;
      case 'personal_trainer':
        navigate('/trainer/dashboard');
        break;
      case 'staff_member':
        navigate(`/${profile.companyId}`);
        break;
      case 'student':
        navigate('/student/dashboard');
        break;
      default:
        toast.error('Tipo de perfil não reconhecido');
    }
  };

  const handleProfileSelection = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setShowProfileSelector(false);
    redirectToProfile(profile);
  };

  // Check for multiple profiles after loading
  useEffect(() => {
    if (!profilesLoading && profiles.length > 0 && userId) {
      if (profiles.length === 1) {
        // Only one profile, redirect directly
        redirectToProfile(profiles[0]);
      } else {
        // Multiple profiles, show selector
        setShowProfileSelector(true);
      }
    }
  }, [profiles, profilesLoading, userId]);

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
        clearSelectedProfile(); // Clear any previous profile selection

        // Identify roles and redirect accordingly (trainer > company roles > student)
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('role, company_id, companies(name)')
          .eq('user_id', data.user.id);

        if (!rolesError && rolesData && rolesData.length > 0) {
          const trainerRole = (rolesData as any[]).find(r => r.role === 'personal_trainer' && r.company_id);
          if (trainerRole) {
            // Persist selected company context for trainer
            setSelectedProfile({
              type: 'personal_trainer',
              companyId: trainerRole.company_id,
              companyName: trainerRole.companies?.name || ''
            });
            navigate('/trainer/dashboard');
            return;
          }

          const companyRole = (rolesData as any[]).find(r => (r.role === 'box_owner' || r.role === 'staff_member') && r.company_id);
          if (companyRole) {
            setSelectedProfile({
              type: companyRole.role === 'box_owner' ? 'box_owner' : 'staff_member',
              companyId: companyRole.company_id,
              companyName: companyRole.companies?.name || ''
            });
            navigate(`/${companyRole.company_id}`);
            return;
          }

          const isStudent = (rolesData as any[]).some(r => r.role === 'student');
          if (isStudent) {
            navigate('/student/dashboard');
            return;
          }
        }

        // Fallback to existing profile-based redirect flow
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
    <>
      <ProfileSelector
        isOpen={showProfileSelector}
        profiles={profiles}
        onSelectProfile={handleProfileSelection}
      />
      
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
                Registrar Empresa
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
    </>
  );
};
