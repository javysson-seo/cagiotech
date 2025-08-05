
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { toast } from 'sonner';

export const StudentRegister: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    boxId: '',
    password: '',
    confirmPassword: ''
  });

  // Mock BOX list - will come from API later
  const availableBoxes = [
    { id: 'box_1', name: 'CrossFit Porto' },
    { id: 'box_2', name: 'CrossFit Lisboa' },
    { id: 'box_3', name: 'Box Functional Braga' },
    { id: 'box_4', name: 'Iron Temple Coimbra' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As palavras-passe não coincidem');
      return;
    }

    if (!formData.boxId) {
      toast.error('Por favor, selecione uma BOX');
      return;
    }

    try {
      const selectedBox = availableBoxes.find(box => box.id === formData.boxId);
      await register({
        ...formData,
        boxName: selectedBox?.name
      }, 'student');
      
      navigate('/student/dashboard');
      toast.success('Conta criada com sucesso! Bem-vindo à sua BOX!');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center space-y-1">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full w-16 h-16 mx-auto mb-4">
                <div className="text-white text-2xl font-bold">🏃‍♂️</div>
              </div>
              <CardTitle className="text-2xl">
                {t('auth.registerTitle')}
              </CardTitle>
              <CardDescription>
                {t('auth.registerStudent')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('auth.name')}</Label>
                    <Input
                      id="name"
                      placeholder="Maria Santos"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('auth.phone')}</Label>
                    <Input
                      id="phone"
                      placeholder="+351 912 345 678"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="boxId">Escolha a sua BOX</Label>
                  <Select value={formData.boxId} onValueChange={(value) => handleInputChange('boxId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma BOX" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableBoxes.map(box => (
                        <SelectItem key={box.id} value={box.id}>
                          {box.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="maria@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? t('common.loading') : t('auth.register')}
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {t('auth.hasAccount')}{' '}
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal"
                      onClick={() => navigate('/auth/student-login')}
                    >
                      {t('auth.login')}
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
