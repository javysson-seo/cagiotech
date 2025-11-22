import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Building2, Phone, MapPin, Globe, ChevronRight, ChevronLeft } from 'lucide-react';

interface CompanyOnboardingModalProps {
  companyId: string;
}

export const CompanyOnboardingModal: React.FC<CompanyOnboardingModalProps> = ({ companyId }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postal_code: '',
    website: '',
    instagram: '',
    description: '',
    capacity: 30
  });
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  useEffect(() => {
    if (companyId) {
      loadCompanyData();
    }
  }, [companyId]);

  const loadCompanyData = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', companyId)
      .single();

    if (data && !error) {
      setFormData({
        name: data.name || '',
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        city: data.city || '',
        postal_code: data.postal_code || '',
        website: data.website || '',
        instagram: data.instagram || '',
        description: data.description || '',
        capacity: data.capacity || 30
      });
      setStep(data.onboarding_step || 1);
    }
  };

  const handleNext = async () => {
    if (step < totalSteps) {
      await saveProgress(step + 1);
      setStep(step + 1);
    } else {
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const saveProgress = async (currentStep: number) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          ...formData,
          onboarding_step: currentStep
        })
        .eq('id', companyId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Erro ao salvar progresso');
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('companies')
        .update({
          ...formData,
          onboarding_completed: true,
          onboarding_step: totalSteps
        })
        .eq('id', companyId);

      if (error) throw error;

      toast.success('Configuração concluída com sucesso!');
      navigate(`/${companyId}`);
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error('Erro ao finalizar configuração');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              <p className="text-sm text-muted-foreground">Configure os dados principais da sua empresa</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Nome da Empresa *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: CrossFit Lisboa"
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Ex: +351 912 345 678"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email de Contacto *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@empresa.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="capacity">Capacidade Máxima</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  placeholder="30"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-semibold">Localização</h3>
              <p className="text-sm text-muted-foreground">Onde sua empresa está localizada</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="address">Morada</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Rua, número"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Lisboa"
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code">Código Postal</Label>
                  <Input
                    id="postal_code"
                    value={formData.postal_code}
                    onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    placeholder="1000-001"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Globe className="w-12 h-12 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-semibold">Presença Online</h3>
              <p className="text-sm text-muted-foreground">Conecte suas redes sociais e website</p>
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://www.suaempresa.com"
                />
              </div>

              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@suaempresa"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição da Empresa</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Conte sobre sua empresa, especialidades, valores..."
                  rows={4}
                />
              </div>

              <div className="flex items-start space-x-2 pt-4">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Concordo com os{' '}
                  <a
                    href="/termos-e-politicas"
                    target="_blank"
                    className="text-primary underline hover:no-underline"
                  >
                    Termos de Serviço e Política de Privacidade
                  </a>
                </Label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center">Configure sua Empresa</DialogTitle>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center text-muted-foreground mt-2">
              Passo {step} de {totalSteps}
            </p>
          </div>
        </DialogHeader>

        <div className="py-4">
          {renderStep()}
        </div>

        <div className="flex justify-between gap-3">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 1 || loading}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          <Button
            onClick={handleNext}
            disabled={
              loading || 
              !formData.name || 
              !formData.phone || 
              !formData.email ||
              (step === totalSteps && !acceptedTerms)
            }
            className="flex-1"
          >
            {loading ? (
              'Salvando...'
            ) : step === totalSteps ? (
              'Finalizar'
            ) : (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};