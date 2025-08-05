
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { toast } from 'sonner';

export const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Determine user type from URL or state
  const userType = location.pathname.includes('box') ? 'box' : 
                  location.pathname.includes('student') ? 'student' : 'box';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Determine role based on route and email
      let role: UserRole = 'box_admin';
      if (email.includes('cagio') || email.includes('admin@cagio')) {
        role = 'cagio_admin';
      } else if (email.includes('trainer')) {
        role = 'trainer';
      } else if (userType === 'student' || email.includes('student')) {
        role = 'student';
      }

      await login(email, password, role);
      
      // Redirect based on role
      if (role === 'cagio_admin') {
        navigate('/admin/dashboard');
      } else if (role === 'box_admin') {
        navigate('/box/dashboard');
      } else if (role === 'trainer') {
        navigate('/trainer/dashboard');
      } else {
        navigate('/student/dashboard');
      }
      
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-1">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <div className="text-white text-2xl font-bold">
                  {userType === 'box' ? '🏢' : '🏃‍♂️'}
                </div>
              </div>
              <CardTitle className="text-2xl">
                {t('auth.loginTitle')}
              </CardTitle>
              <CardDescription>
                {userType === 'box' ? t('auth.loginAsBox') : t('auth.loginAsStudent')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@cagio.com (super admin) | box@test.com | student@test.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('auth.login')}
                </Button>
                
                <div className="text-center space-y-2">
                  <Button variant="link" className="text-sm">
                    {t('auth.forgotPassword')}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground">
                    {t('auth.noAccount')}{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal"
                      onClick={() => navigate(userType === 'box' ? '/auth/box-register' : '/auth/student-register')}
                    >
                      {t('auth.register')}
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p className="mb-2">Demo users para teste:</p>
            <div className="space-y-1">
              <p><strong>Super Admin:</strong> admin@cagio.com</p>
              <p><strong>BOX Admin:</strong> box@test.com</p>
              <p><strong>Trainer:</strong> trainer@test.com</p>
              <p><strong>Student:</strong> student@test.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
