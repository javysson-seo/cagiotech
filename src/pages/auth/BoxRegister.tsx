
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const BoxRegister: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Reset email exists error when user changes email
    if (field === 'email' && emailExists) {
      setEmailExists(false);
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!email.trim()) return false;
    
    setIsCheckingEmail(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-email-exists', {
        body: { email }
      });

      if (error) throw error;

      return data.exists;
    } catch (error: any) {
      console.error('Error checking email:', error);
      return false;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error('A palavra-passe deve ter pelo menos 6 caracteres');
      return;
    }

    if (!formData.companyName.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email é obrigatório');
      return;
    }

    // Check if email already exists
    const exists = await checkEmailExists(formData.email);
    if (exists) {
      setEmailExists(true);
      toast.error('Este email já está registrado. Por favor, faça login.');
      return;
    }

    setIsLoading(true);

    try {
      // Send verification code
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { 
          email: formData.email,
          companyName: formData.companyName
        }
      });

      if (error) throw error;

      toast.success('Código de verificação enviado para o seu email');
      
      // Navigate to verification page
      navigate('/auth/verify-email', {
        state: {
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName
        }
      });
      
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Erro ao enviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <img 
            src="/lovable-uploads/ceef2c27-35ec-471c-a76f-fa4cbb07ecaa.png" 
            alt="Cagiotech" 
            className="h-12 w-auto"
          />
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-1">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <div className="text-white text-2xl font-bold">🏢</div>
              </div>
              <CardTitle className="text-2xl">
                Registrar Empresa
              </CardTitle>
              <CardDescription>
                Crie sua conta empresarial no CagioTech
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                {emailExists && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Este email já está registrado.{' '}
                      <Button
                        variant="link"
                        className="p-0 h-auto font-semibold underline"
                        onClick={() => navigate('/auth/login')}
                      >
                        Clique aqui para fazer login
                      </Button>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="companyName">Nome da empresa *</Label>
                  <Input
                    id="companyName"
                    placeholder="Fitness Premium"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@fitnesspremium.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Palavra-passe *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isCheckingEmail || emailExists}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando código...
                    </>
                  ) : isCheckingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando email...
                    </>
                  ) : (
                    'Continuar'
                  )}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Já tem conta?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal"
                      onClick={() => navigate('/auth/login')}
                    >
                      Entrar
                    </Button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
