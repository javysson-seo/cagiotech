
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Dumbbell, AlertCircle } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loading } from '@/components/ui/loading';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(3, 'Password deve ter pelo menos 3 caracteres'),
  role: z.enum(['cagio_admin', 'box_admin', 'trainer', 'student']).optional()
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'cagio_admin':
          navigate('/admin/dashboard');
          break;
        case 'box_admin':
          navigate('/box/dashboard');
          break;
        case 'trainer':
          navigate('/trainer/dashboard');
          break;
        case 'student':
          navigate('/student/dashboard');
          break;
      }
    }
  }, [user, navigate]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await login(data.email, data.password, selectedRole || undefined);
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  const quickLogin = async (email: string, password: string, role: UserRole) => {
    try {
      clearError();
      await login(email, password, role);
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  const roleOptions = [
    { value: 'cagio_admin', label: 'Administrador Cagio' },
    { value: 'box_admin', label: 'Administrador BOX' },
    { value: 'trainer', label: 'Personal Trainer' },
    { value: 'student', label: 'Aluno' }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-4">
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">CAGIO</h1>
          <p className="text-muted-foreground mt-1">
            Sistema de Gestão para BOX de CrossFit
          </p>
        </div>

        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="demo">Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Entrar na Conta</CardTitle>
                <CardDescription>
                  Entre com suas credenciais para acessar o sistema
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      {...register('email')}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Sua password"
                        {...register('password')}
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
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Função (Opcional)</Label>
                    <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar função" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <Loading size="sm" text="Entrando..." />
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">Não tem conta? </span>
                  <Link to="/auth/box-register" className="text-blue-600 hover:underline font-medium">
                    Registrar BOX
                  </Link>
                  <span className="text-muted-foreground"> ou </span>
                  <Link to="/auth/student-register" className="text-blue-600 hover:underline font-medium">
                    Registrar como Aluno
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <Card>
              <CardHeader>
                <CardTitle>Acesso Demo</CardTitle>
                <CardDescription>
                  Use estas contas para testar diferentes funcionalidades
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Administrador Cagio</p>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => quickLogin('admin@cagio.com', 'admin123', 'cagio_admin')}
                    disabled={isLoading}
                  >
                    <div>
                      <p className="font-medium">admin@cagio.com</p>
                      <p className="text-xs text-muted-foreground">Gestão completa da plataforma</p>
                    </div>
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Administrador BOX</p>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => quickLogin('joao@crossfitbenfica.com', 'box123', 'box_admin')}
                    disabled={isLoading}
                  >
                    <div>
                      <p className="font-medium">joao@crossfitbenfica.com</p>
                      <p className="text-xs text-muted-foreground">CrossFit Benfica</p>
                    </div>
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Personal Trainer</p>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => quickLogin('carlos@crossfitbenfica.com', 'trainer123', 'trainer')}
                    disabled={isLoading}
                  >
                    <div>
                      <p className="font-medium">carlos@crossfitbenfica.com</p>
                      <p className="text-xs text-muted-foreground">Personal Trainer</p>
                    </div>
                  </Button>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Aluno</p>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => quickLogin('ana@email.com', 'student123', 'student')}
                    disabled={isLoading}
                  >
                    <div>
                      <p className="font-medium">ana@email.com</p>
                      <p className="text-xs text-muted-foreground">Atleta</p>
                    </div>
                  </Button>
                </div>

                {isLoading && (
                  <div className="text-center py-4">
                    <Loading size="sm" text="Fazendo login..." />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
