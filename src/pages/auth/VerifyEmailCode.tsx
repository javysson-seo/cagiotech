import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const VerifyEmailCode: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, password, companyName } = location.state || {};
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!email || !password || !companyName) {
    navigate('/auth/box-register');
    return null;
  }

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
    setIsLoading(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-verification-code', {
        body: { email, companyName }
      });

      if (error) throw error;

      toast.success('Novo código enviado para o seu email');
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error('Erro ao reenviar código. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <img 
            src="/lovable-uploads/b8bff381-d517-4462-9251-cbc6c9edbf52.png" 
            alt="CagioTech" 
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
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Código de verificação</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-2xl tracking-widest font-mono"
                    required
                  />
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
                    disabled={isLoading}
                  >
                    Reenviar código
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
