import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Loader2, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const VerifyEmailCode: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password, companyName } = location.state || {};
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (!email || !password || !companyName) {
      navigate('/auth/box-register');
      return;
    }

    // Load resend state from localStorage
    const storageKey = `resend_${email}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const { lastResend, count } = JSON.parse(stored);
      const now = Date.now();
      const waitTime = count === 0 ? 60000 : 300000; // 1min first, 5min after
      const elapsed = now - lastResend;
      
      if (elapsed < waitTime) {
        setCanResend(false);
        setResendCount(count);
        setCountdown(Math.ceil((waitTime - elapsed) / 1000));
      }
    }
  }, [email, password, companyName, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      toast.error('O código deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);

    try {
      // Call edge function to verify code and create account
      const { data, error } = await supabase.functions.invoke('verify-code-and-register', {
        body: { email, code, password }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Erro ao verificar código');
      }

      // Check if user already existed
      if (data.userExists) {
        toast.success('Email confirmado com sucesso! Redirecionando para login...');
        setTimeout(() => {
          navigate('/auth/login');
        }, 1500);
        return;
      }

      toast.success('Conta criada com sucesso!');
      
      // Login the user
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (loginError) throw loginError;

      // Redirect to company dashboard
      navigate(`/${data.companyId}`);
      
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.message || 'Erro ao verificar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, companyName }
      });

      if (error) throw error;
      
      if (data?.error) {
        throw new Error(data.error);
      }

      const newCount = resendCount + 1;
      const waitTime = newCount === 1 ? 60 : 300; // seconds
      
      // Save to localStorage
      const storageKey = `resend_${email}`;
      localStorage.setItem(storageKey, JSON.stringify({
        lastResend: Date.now(),
        count: newCount
      }));
      
      setResendCount(newCount);
      setCanResend(false);
      setCountdown(waitTime);
      
      toast.success(`Novo código enviado! Aguarde ${waitTime === 60 ? '1 minuto' : '5 minutos'} para reenviar novamente.`);
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error(error.message || 'Erro ao reenviar código. Tente novamente.');
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
                <Mail className="text-white w-8 h-8" />
              </div>
              <CardTitle className="text-2xl">
                Verifique seu email
              </CardTitle>
              <CardDescription>
                Enviamos um código de verificação para<br />
                <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
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
                  <p className="text-xs text-muted-foreground text-center">
                    Insira o código de 6 dígitos enviado para o seu email
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || code.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Verificar e criar conta'
                  )}
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
                    onClick={() => navigate('/auth/box-register')}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                </div>
              </form>

              <div className="bg-muted p-4 rounded-lg mt-4">
                <p className="text-xs text-muted-foreground">
                  <strong>Não recebeu o código?</strong><br />
                  Verifique sua pasta de spam ou clique em "Reenviar código"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
