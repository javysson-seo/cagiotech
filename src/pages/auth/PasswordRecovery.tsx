import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Loader2, Lock, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Step = 'email' | 'code' | 'password';

export const PasswordRecovery: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-password-reset-code', {
        body: { email }
      });

      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      toast.success('Código enviado para o seu email');
      setStep('code');
    } catch (error: any) {
      console.error('Send code error:', error);
      toast.error(error.message || 'Erro ao enviar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error('O código deve ter 6 dígitos');
      return;
    }

    setStep('password');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verify-password-reset', {
        body: { email, code, newPassword }
      });

      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      const { userRole, isEmailConfirmed } = data;

      // Check if email is confirmed
      if (!isEmailConfirmed) {
        toast.error('Seu email ainda não foi confirmado. Verifique sua caixa de entrada.');
        setIsLoading(false);
        return;
      }

      toast.success('Senha alterada com sucesso! Redirecionando...');
      
      // Login automatically
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password: newPassword
      });

      if (loginError) throw loginError;

      // Redirect based on user role
      let redirectPath = '/';
      
      if (userRole === 'student') {
        redirectPath = '/student/dashboard';
      } else if (userRole === 'box_owner' || userRole === 'staff_member' || userRole === 'personal_trainer') {
        redirectPath = '/box/dashboard';
      } else if (userRole === 'cagio_admin') {
        redirectPath = '/admin/dashboard';
      }

      navigate(redirectPath);
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.message || 'Erro ao redefinir senha');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-password-reset-code', {
        body: { email }
      });

      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      const newCount = resendCount + 1;
      const waitTime = newCount === 1 ? 60 : 300;
      
      setResendCount(newCount);
      setCanResend(false);
      setCountdown(waitTime);
      
      toast.success(`Novo código enviado! Aguarde ${waitTime === 60 ? '1 minuto' : '5 minutos'} para reenviar novamente.`);
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.message || 'Erro ao reenviar código');
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
                {step === 'password' ? (
                  <Lock className="text-white w-8 h-8" />
                ) : (
                  <Mail className="text-white w-8 h-8" />
                )}
              </div>
              <CardTitle className="text-2xl">
                {step === 'email' && 'Recuperar senha'}
                {step === 'code' && 'Verificar código'}
                {step === 'password' && 'Nova senha'}
              </CardTitle>
              <CardDescription>
                {step === 'email' && 'Digite seu email para receber o código de recuperação'}
                {step === 'code' && `Código enviado para ${email}`}
                {step === 'password' && 'Digite sua nova senha'}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {step === 'email' && (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      'Enviar código'
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => navigate('/auth/box-register')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </form>
              )}

              {step === 'code' && (
                <form onSubmit={handleVerifyCode} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="code" className="text-center block">Código de verificação</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={code}
                        onChange={(value) => setCode(value)}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || code.length !== 6}
                  >
                    Verificar código
                  </Button>

                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleResendCode}
                      disabled={isLoading || !canResend}
                    >
                      {!canResend ? (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Aguarde {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                        </>
                      ) : (
                        'Reenviar código'
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => setStep('email')}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Voltar
                    </Button>
                  </div>
                </form>
              )}

              {step === 'password' && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Digite a nova senha"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme a nova senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Alterando senha...
                      </>
                    ) : (
                      'Alterar senha'
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
