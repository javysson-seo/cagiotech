
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { toast } from 'sonner';

export const BoxOnboarding: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    boxName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Portugal',
    website: '',
    instagram: '',
    facebook: '',
    
    // Step 2: Admin Info
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    
    // Step 3: Settings (placeholder for future)
    currency: 'EUR',
    timezone: 'Europe/Lisbon'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.boxName || !formData.address || !formData.city) {
          toast.error('Por favor, preencha todos os campos obrigatórios');
          return false;
        }
        break;
      case 2:
        if (!formData.adminName || !formData.adminEmail) {
          toast.error('Por favor, preencha todos os campos obrigatórios');
          return false;
        }
        break;
    }
    return true;
  };

  const handleFinish = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call to create BOX
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('BOX criada com sucesso!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Erro ao criar BOX. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: t('onboarding.step1') },
    { number: 2, title: t('onboarding.step2') },
    { number: 3, title: t('onboarding.step4') }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center mb-8">{t('onboarding.title')}</h1>
            
            <div className="flex items-center justify-between mb-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    currentStep >= step.number 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={`font-medium ${
                      currentStep >= step.number ? 'text-blue-600' : 'text-muted-foreground'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 h-0.5 ml-4 ${
                      currentStep > step.number ? 'bg-blue-600' : 'bg-muted-foreground/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>
                {currentStep === 1 && t('onboarding.boxInfo')}
                {currentStep === 2 && t('onboarding.adminInfo')}
                {currentStep === 3 && t('onboarding.step4')}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Step 1: BOX Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="boxName">{t('auth.boxName')} *</Label>
                    <Input
                      id="boxName"
                      placeholder="CrossFit Porto"
                      value={formData.boxName}
                      onChange={(e) => handleInputChange('boxName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('onboarding.address')} *</Label>
                    <Input
                      id="address"
                      placeholder="Rua Example, 123"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('onboarding.city')} *</Label>
                      <Input
                        id="city"
                        placeholder="Porto"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">{t('onboarding.postalCode')}</Label>
                      <Input
                        id="postalCode"
                        placeholder="4000-001"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="country">{t('onboarding.country')}</Label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Portugal">Portugal</SelectItem>
                        <SelectItem value="Spain">España</SelectItem>
                        <SelectItem value="France">France</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">{t('onboarding.website')}</Label>
                    <Input
                      id="website"
                      placeholder="https://crossfitporto.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        placeholder="@crossfitporto"
                        value={formData.instagram}
                        onChange={(e) => handleInputChange('instagram', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        placeholder="CrossFit Porto"
                        value={formData.facebook}
                        onChange={(e) => handleInputChange('facebook', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Admin Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="adminName">{t('onboarding.adminName')} *</Label>
                    <Input
                      id="adminName"
                      placeholder="João Silva"
                      value={formData.adminName}
                      onChange={(e) => handleInputChange('adminName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminEmail">{t('onboarding.adminEmail')} *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="joao@crossfitporto.com"
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="adminPhone">{t('onboarding.adminPhone')}</Label>
                    <Input
                      id="adminPhone"
                      placeholder="+351 912 345 678"
                      value={formData.adminPhone}
                      onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="bg-muted p-6 rounded-lg">
                    <h3 className="font-semibold mb-4">Resumo da BOX:</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Nome:</span> {formData.boxName}</p>
                      <p><span className="font-medium">Localização:</span> {formData.address}, {formData.city}</p>
                      <p><span className="font-medium">Administrador:</span> {formData.adminName}</p>
                      <p><span className="font-medium">Email:</span> {formData.adminEmail}</p>
                      {formData.website && <p><span className="font-medium">Website:</span> {formData.website}</p>}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Clique em "Finalizar" para criar a BOX e enviar credenciais de acesso para o administrador.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('onboarding.previous')}
            </Button>
            
            {currentStep < 3 ? (
              <Button onClick={nextStep}>
                {t('onboarding.next')}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleFinish}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                {isSubmitting ? t('common.loading') : t('onboarding.finish')}
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
