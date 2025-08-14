
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const BoxRegister: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    boxName: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('As palavras-passe não coincidem');
      return;
    }

    try {
      await register({
        ...formData,
        boxId: `box_${Date.now()}`
      }, 'box_admin');
      
      navigate('/box');
      toast.success('Conta criada com sucesso!');
    } catch (error) {
      toast.error('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Simplified Header */}
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
                <div className="text-white text-2xl font-bold">🏢</div>
              </div>
              <CardTitle className="text-2xl">
                {t('auth.registerTitle')}
              </CardTitle>
              <CardDescription>
                {t('auth.registerBox')}
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('auth.name')}</Label>
                    <Input
                      id="name"
                      placeholder="João Silva"
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
                  <Label htmlFor="boxName">{t('auth.boxName')}</Label>
                  <Input
                    id="boxName"
                    placeholder="CrossFit Porto"
                    value={formData.boxName}
                    onChange={(e) => handleInputChange('boxName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="joao@crossfitporto.com"
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
                      onClick={() => navigate('/auth/login')}
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
