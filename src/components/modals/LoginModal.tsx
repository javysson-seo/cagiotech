
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, User, Dumbbell, Eye, EyeOff } from 'lucide-react';
import { Logo } from '@/components/ui/logo';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister: () => void;
}

type UserType = 'box' | 'trainer' | 'student' | null;

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onOpenRegister }) => {
  const [selectedUserType, setSelectedUserType] = useState<UserType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleDemo = (type: string) => {
    alert(`🎮 Demo ${type} será aberto em breve! Esta é uma funcionalidade de demonstração.`);
  };

  const handleLogin = () => {
    alert('🔐 Sistema de login será implementado em breve! Esta é uma demonstração visual.');
  };

  const resetAndClose = () => {
    setSelectedUserType(null);
    setCredentials({ email: '', password: '' });
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
            {!selectedUserType ? 'Entrar na sua conta' : 'Login'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedUserType ? (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground mb-6">
                Selecione o seu tipo de acesso:
              </p>
              
              <div className="grid gap-3">
                <Button
                  variant="outline"
                  className="h-16 justify-start space-x-3 hover:border-[#bed700] hover:bg-[#bed700]/5"
                  onClick={() => setSelectedUserType('box')}
                >
                  <div className="w-10 h-10 bg-[#bed700]/10 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-[#bed700]" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">BOX / Ginásio</div>
                    <div className="text-sm text-muted-foreground">Proprietário ou gestor</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 justify-start space-x-3 hover:border-[#bed700] hover:bg-[#bed700]/5"
                  onClick={() => setSelectedUserType('trainer')}
                >
                  <div className="w-10 h-10 bg-[#bed700]/10 rounded-full flex items-center justify-center">
                    <Dumbbell className="h-5 w-5 text-[#bed700]" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Personal Trainer</div>
                    <div className="text-sm text-muted-foreground">Treinador profissional</div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-16 justify-start space-x-3 hover:border-[#bed700] hover:bg-[#bed700]/5"
                  onClick={() => setSelectedUserType('student')}
                >
                  <div className="w-10 h-10 bg-[#bed700]/10 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-[#bed700]" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Aluno</div>
                    <div className="text-sm text-muted-foreground">Membro do ginásio</div>
                  </div>
                </Button>
              </div>

              <div className="border-t pt-4">
                <p className="text-center text-sm text-muted-foreground mb-3">
                  🎮 Quer apenas testar?
                </p>
                <div className="grid gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleDemo('BOX')}>
                    Login Demo BOX
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDemo('Personal Trainer')}>
                    Login Demo Personal Trainer
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDemo('Aluno')}>
                    Login Demo Aluno
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedUserType(null)}
                className="p-0 h-auto text-muted-foreground hover:text-foreground"
              >
                ← Voltar à seleção
              </Button>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={credentials.email}
                    onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua password"
                      value={credentials.password}
                      onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>Lembrar-me</span>
                  </label>
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    Esqueci a password
                  </Button>
                </div>

                <Button 
                  className="w-full bg-[#bed700] hover:bg-[#a5c400] text-white"
                  onClick={handleLogin}
                >
                  Entrar
                </Button>

                <div className="text-center">
                  <span className="text-sm text-muted-foreground">Não tem conta? </span>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-[#bed700] hover:text-[#a5c400]"
                    onClick={() => {
                      resetAndClose();
                      onOpenRegister();
                    }}
                  >
                    Registar
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
