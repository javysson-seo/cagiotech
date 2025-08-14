
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

interface PasswordRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackToLogin: () => void;
}

export const PasswordRecoveryModal: React.FC<PasswordRecoveryModalProps> = ({ 
  isOpen, 
  onClose, 
  onBackToLogin 
}) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsLoading(false);
    setEmailSent(true);
  };

  const resetAndClose = () => {
    setEmail('');
    setEmailSent(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <DialogTitle className="text-center text-2xl">
            {emailSent ? 'Email Enviado!' : 'Recuperar Password'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!emailSent ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={onBackToLogin}
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar ao login
              </Button>

              <div className="text-center">
                <Mail className="h-12 w-12 text-[#bed700] mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Introduza o seu email e enviaremos as instruções para recuperar a sua password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recovery-email">Email</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-[#bed700] hover:bg-[#a5c400] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    'Enviar Instruções'
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold mb-2">Email Enviado com Sucesso!</h3>
                <p className="text-muted-foreground">
                  Enviámos as instruções para recuperar a sua password para{' '}
                  <strong>{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Verifique também a pasta de spam.
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={onBackToLogin} className="flex-1">
                  Voltar ao Login
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => setEmailSent(false)}
                  className="flex-1"
                >
                  Reenviar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
