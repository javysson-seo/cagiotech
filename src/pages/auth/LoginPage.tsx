import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type UserType = 'student' | 'box_admin' | 'trainer';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuth();
  const [selectedUserType, setSelectedUserType] = useState<UserType>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!credentials.email || !credentials.password) {
      return;
    }

    try {
      // Convert selectedUserType to the correct role format
      const roleMapping = {
        'student': 'student',
        'box_admin': 'box_admin',
        'trainer': 'trainer'
      } as const;

      await login(credentials.email, credentials.password, roleMapping[selectedUserType]);
      
      // Redirect based on user type after successful login
      const redirectPaths = {
        'student': '/student',
        'box_admin': '/box',
        'trainer': '/trainer'
      };
      
      navigate(redirectPaths[selectedUserType]);
    } catch (err) {
      // Error is handled by the AuthContext
      console.error('Login error:', err);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setForgotPasswordSent(true);
  };

  const resetForgotPassword = () => {
    setShowForgotPassword(false);
    setForgotPasswordSent(false);
    setForgotPasswordEmail('');
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <img 
                  src="/lovable-uploads/ceef2c27-35ec-471c-a76f-fa4cbb07ecaa.png" 
                  alt="Cagiotech" 
                  className="h-12 w-auto"
                />
              </div>
              <CardTitle className="text-2xl">
                {forgotPasswordSent ? 'Email Enviado!' : 'Redefinir Senha'}
              </CardTitle>
              <CardDescription>
                {forgotPasswordSent 
                  ? 'Verifique a sua caixa de email' 
                  : 'Introduza o seu email para receber as instruções'
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              {!forgotPasswordSent ? (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetForgotPassword}
                    className="p-0 h-auto text-muted-foreground hover:text-foreground mb-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar ao login
                  </Button>

                  <div className="text-center mb-6">
                    <Mail className="h-12 w-12 text-[#bed700] mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Introduza o seu email e enviaremos as instruções para redefinir a sua senha.
                    </p>
                  </div>

                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email">Email</Label>
                      <Input
                        id="forgot-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        required
                      />
                    </div>

                    <Button 
                      type="submit"
                      className="w-full bg-[#bed700] hover:bg-[#a5c400] text-white"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Enviando...' : 'Enviar Instruções'}
                    </Button>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Email Enviado com Sucesso!</h3>
                    <p className="text-muted-foreground">
                      Enviámos as instruções para redefinir a sua senha para{' '}
                      <strong>{forgotPasswordEmail}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Verifique também a pasta de spam.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={resetForgotPassword} className="flex-1">
                      Voltar ao Login
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => setForgotPasswordSent(false)}
                      className="flex-1"
                    >
                      Reenviar
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/ceef2c27-35ec-471c-a76f-fa4cbb07ecaa.png" 
              alt="Cagiotech" 
              className="h-12 w-auto"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Cagiotech</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de Gestão para Fitness e Wellness
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar na Conta</CardTitle>
            <CardDescription>
              Selecione o seu tipo de acesso e entre com as suas credenciais
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs value={selectedUserType} onValueChange={(value) => setSelectedUserType(value as UserType)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="student">Aluno</TabsTrigger>
                <TabsTrigger value="box_admin">Empresa</TabsTrigger>
                <TabsTrigger value="trainer">Personal</TabsTrigger>
              </TabsList>

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
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Lembrar-me</span>
                  </label>
                  <Button 
                    variant="link" 
                    size="sm" 
                    type="button"
                    className="p-0 h-auto text-[#bed700] hover:text-[#a5c400]"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Esqueci a senha
                  </Button>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#bed700] hover:bg-[#a5c400] text-white" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">Empresa não registrada? </span>
                <Link to="/auth/box-register" className="text-[#bed700] hover:text-[#a5c400] font-medium">
                  Registar Empresa
                </Link>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-4 text-center">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à página inicial
          </Button>
        </div>
      </div>
    </div>
  );
};
