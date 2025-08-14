
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/ui/logo';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLogin: () => void;
}

type AccountType = 'box' | 'trainer' | 'student';

export const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose, onOpenLogin }) => {
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType>('box');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    boxName: '',
    address: '',
    nif: '',
    terms: false,
    privacy: false
  });

  const handleRegister = () => {
    alert('⚠️ Para se registar é necessário escolher um plano primeiro!\n\nRedirecionando para a seção de preços...');
    onClose();
    document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const resetAndClose = () => {
    setStep(1);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      boxName: '',
      address: '',
      nif: '',
      terms: false,
      privacy: false
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <DialogTitle className="text-center text-2xl">
            Criar conta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 text-center">
              ⚠️ <strong>Importante:</strong> Para se registar é necessário escolher um plano primeiro
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Que tipo de conta pretende criar?</Label>
              <RadioGroup value={accountType} onValueChange={(value) => setAccountType(value as AccountType)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="box" id="box" />
                  <Label htmlFor="box">BOX/Ginásio (proprietário)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="trainer" id="trainer" />
                  <Label htmlFor="trainer">Personal Trainer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student">Aluno</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo *</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar password *</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirme sua password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  placeholder="+351 XXX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              {accountType === 'box' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="boxName">Nome da BOX *</Label>
                    <Input
                      id="boxName"
                      placeholder="Nome do seu ginásio"
                      value={formData.boxName}
                      onChange={(e) => setFormData(prev => ({ ...prev, boxName: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Morada *</Label>
                    <Input
                      id="address"
                      placeholder="Morada completa"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nif">NIF/NIPC *</Label>
                    <Input
                      id="nif"
                      placeholder="Número de contribuinte"
                      value={formData.nif}
                      onChange={(e) => setFormData(prev => ({ ...prev, nif: e.target.value }))}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="bg-[#bed700]/10 rounded-lg p-4">
              <div className="text-sm">
                <div className="font-semibold text-[#bed700]">Plano escolhido: Professional €59/mês</div>
                <Button variant="link" size="sm" className="p-0 h-auto text-[#bed700] hover:text-[#a5c400]">
                  Alterar plano
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.terms}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, terms: !!checked }))}
                />
                <Label htmlFor="terms" className="text-sm">
                  Aceito os <Button variant="link" className="p-0 h-auto text-[#bed700]">Termos e Condições</Button>
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="privacy"
                  checked={formData.privacy}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, privacy: !!checked }))}
                />
                <Label htmlFor="privacy" className="text-sm">
                  Concordo com a <Button variant="link" className="p-0 h-auto text-[#bed700]">Política de Privacidade</Button>
                </Label>
              </div>
            </div>

            <Button 
              className="w-full bg-[#bed700] hover:bg-[#a5c400] text-white"
              onClick={handleRegister}
            >
              Iniciar Teste Grátis 14 Dias
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              Só será cobrado após período de teste
            </div>

            <div className="text-center">
              <span className="text-sm text-muted-foreground">Já tem conta? </span>
              <Button
                variant="link"
                size="sm"
                className="p-0 h-auto text-[#bed700] hover:text-[#a5c400]"
                onClick={() => {
                  resetAndClose();
                  onOpenLogin();
                }}
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
