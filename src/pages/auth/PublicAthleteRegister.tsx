import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Calendar, Mail, Phone, User, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CompanyLogoImage } from '@/components/ui/company-logo';

export const PublicAthleteRegister = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; passwordHint: string } | null>(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: '',
  });

  // Carregar informações da empresa
  useEffect(() => {
    if (companyId) {
      supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single()
        .then(({ data, error }) => {
          if (error) {
            toast.error('Empresa não encontrada');
            navigate('/');
          } else {
            setCompanyInfo(data);
          }
        });
    }
  }, [companyId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyId) {
      toast.error('Link de registro inválido');
      return;
    }

    if (!formData.name || !formData.email || !formData.birth_date) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    // Validar data de nascimento
    const birthDate = new Date(formData.birth_date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 12 || age > 120) {
      toast.error('Data de nascimento inválida');
      return;
    }

    setLoading(true);

    try {
      // Chamar edge function para criar atleta com autenticação
      const { data, error } = await supabase.functions.invoke('public-athlete-register', {
        body: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          birth_date: formData.birth_date,
          company_id: companyId,
        },
      });

      if (error) throw error;

      if (data.success) {
        setCredentials({
          email: data.credentials.email,
          passwordHint: data.credentials.password_hint,
        });
        setRegistered(true);
        toast.success(data.message);
      } else {
        throw new Error(data.error || 'Erro ao registrar');
      }

    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Erro ao realizar registro');
    } finally {
      setLoading(false);
    }
  };

  if (!companyInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (registered && credentials) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Registro Realizado!</CardTitle>
            <CardDescription>
              Seu registro foi enviado para {companyInfo.name}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Seu cadastro precisa ser aprovado pela academia. Você receberá um email quando for aprovado.
              </AlertDescription>
            </Alert>

            <div className="space-y-4 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold">Suas credenciais de acesso:</h3>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <p className="font-medium">{credentials.email}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Senha</Label>
                  <p className="font-medium text-sm">{credentials.passwordHint}</p>
                </div>
              </div>
            </div>

            <Alert className="bg-yellow-500/10 border-yellow-500/20">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                <strong>Importante:</strong> Guarde estas informações! Você precisará delas para fazer login após a aprovação.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/auth/login')}
                className="w-full"
                variant="default"
              >
                Ir para Login
              </Button>
              <Button
                onClick={() => navigate('/')}
                className="w-full"
                variant="outline"
              >
                Voltar para Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <CompanyLogoImage 
            logoUrl={companyInfo.logo_url}
            companyName={companyInfo.name}
            className="h-12 w-auto"
          />
          <div className="text-center">
            <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
            {companyInfo.slogan && (
              <p className="text-sm text-muted-foreground">{companyInfo.slogan}</p>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Registrar como Atleta</CardTitle>
            <CardDescription>
              Preencha seus dados para se registrar em {companyInfo.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Após o registro, seu cadastro precisará ser aprovado pela academia antes que você possa acessar a plataforma.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="required">
                    Nome Completo *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birth_date">
                    Data de Nascimento *
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Você receberá uma senha temporária por email após o registro
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    Telefone
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Registrando...' : 'Registrar'}
              </Button>

              <p className="text-sm text-center text-muted-foreground">
                Já tem uma conta?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/auth/login')}
                  className="text-primary hover:underline"
                >
                  Fazer login
                </button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
