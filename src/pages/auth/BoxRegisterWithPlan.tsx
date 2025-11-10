import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Building2, Mail, Lock, User, Loader2, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PricingPlans } from '@/components/subscription/PricingPlans';
import ReCAPTCHA from 'react-google-recaptcha';

export const BoxRegisterWithPlan: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedPlan = searchParams.get('plan') || '';

  const [step, setStep] = useState<'plan' | 'register'>(preselectedPlan ? 'register' : 'plan');
  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSelectPlan = (planSlug: string, cycle: 'monthly' | 'yearly') => {
    setSelectedPlan(planSlug);
    setBillingCycle(cycle);
    setStep('register');
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Nome da empresa é obrigatório';
    }

    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Seu nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (!captchaToken) {
      newErrors.captcha = 'Por favor, complete a verificação de segurança';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      // 1. Create user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            name: formData.ownerName,
            company_name: formData.companyName
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar conta');

      // 2. Create company with selected plan
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([{
          name: formData.companyName,
          owner_id: authData.user.id,
          subscription_plan: selectedPlan,
          // Trial dates are set automatically by trigger
        }])
        .select()
        .single();

      if (companyError) throw companyError;

      // 3. Assign box_owner role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: authData.user.id,
          role: 'box_owner',
          company_id: companyData.id
        }]);

      if (roleError) throw roleError;

      // 4. Sign in automatically
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });

      if (signInError) throw signInError;

      toast.success('🎉 Conta criada com sucesso! 14 dias grátis começam agora!');
      
      // Redirect to company dashboard
      setTimeout(() => {
        window.location.href = `/${companyData.id}`;
      }, 1000);

    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'plan') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cagio-green-light via-white to-cagio-green-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-4xl md:text-5xl font-bold text-cagio-green mb-4">
              Escolha o Plano Ideal
            </h1>
            <p className="text-xl text-muted-foreground">
              Comece com 14 dias grátis, sem cartão de crédito
            </p>
          </div>

          <PricingPlans onSelectPlan={handleSelectPlan} selectedPlan={selectedPlan} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cagio-green-light via-white to-cagio-green-light dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Button
            variant="ghost"
            onClick={() => setStep('plan')}
            className="w-fit mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos planos
          </Button>
          <CardTitle className="text-3xl">Complete seu Cadastro</CardTitle>
          <CardDescription>
            Plano selecionado: <strong className="text-cagio-green capitalize">{selectedPlan}</strong> ({billingCycle === 'monthly' ? 'Mensal' : 'Anual'})
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="companyName"
                  placeholder="CrossFit Lisboa"
                  className="pl-10"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName}</p>
              )}
            </div>

            {/* Owner Name */}
            <div className="space-y-2">
              <Label htmlFor="ownerName">Seu Nome *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="ownerName"
                  placeholder="João Silva"
                  className="pl-10"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                />
              </div>
              {errors.ownerName && (
                <p className="text-sm text-destructive">{errors.ownerName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Senha *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  className="pl-10"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Digite a senha novamente"
                  className="pl-10"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword}</p>
              )}
            </div>

            {/* reCAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Test key - substituir por chave real
                onChange={(token) => setCaptchaToken(token)}
                theme="light"
              />
            </div>
            {errors.captcha && (
              <p className="text-sm text-destructive text-center">{errors.captcha}</p>
            )}

            {/* Trial Notice */}
            <Alert className="bg-green-50 border-green-200 dark:bg-green-950">
              <Shield className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-900 dark:text-green-100">
                ✓ 14 dias de teste grátis<br />
                ✓ Sem cartão de crédito<br />
                ✓ Cancele quando quiser
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-cagio-green hover:bg-cagio-green-dark text-white"
              size="lg"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Começar Teste Grátis'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
