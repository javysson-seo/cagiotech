
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EmailVerification: React.FC = () => {
  const navigate = useNavigate();

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
                Enviamos um link de verificação para o seu email
              </CardDescription>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Clique no link enviado para o seu email para ativar sua conta.
                </p>
                <p className="text-sm text-muted-foreground">
                  Após a verificação, você será redirecionado automaticamente para o painel de controle.
                </p>
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <strong>Não recebeu o email?</strong><br />
                  Verifique sua pasta de spam ou aguarde alguns minutos.
                </p>
              </div>
              
              <div className="space-y-2">
                <Button
                  variant="outline" 
                  className="w-full"
                  onClick={() => navigate('/auth/login')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao login
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
