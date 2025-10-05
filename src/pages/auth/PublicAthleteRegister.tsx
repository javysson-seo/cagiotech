import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Logo } from '@/components/ui/logo';
import { toast } from 'sonner';
import { Calendar, Mail, Phone, User, MapPin, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const PublicAthleteRegister = () => {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [companyInfo, setCompanyInfo] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birth_date: '',
    address: '',
    gender: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_notes: '',
  });

  // Carregar informações da empresa
  useState(() => {
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
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

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

    setLoading(true);

    try {
      // Gerar senha temporária
      const tempPassword = generatePassword();

      // Criar o atleta no banco de dados
      const { data: athlete, error: athleteError } = await supabase
        .from('athletes')
        .insert({
          company_id: companyId,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birth_date: formData.birth_date,
          address: formData.address,
          gender: formData.gender,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          medical_notes: formData.medical_notes,
          status: 'pending',
        })
        .select()
        .single();

      if (athleteError) throw athleteError;

      // Criar usuário de autenticação
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: tempPassword,
        options: {
          data: {
            name: formData.name,
            role: 'student',
          },
          emailRedirectTo: `${window.location.origin}/student/dashboard`,
        },
      });

      if (authError) throw authError;

      // Criar role de student
      if (authData.user) {
        await supabase.from('user_roles').insert({
          user_id: authData.user.id,
          role: 'student',
          company_id: companyId,
        });
      }

      setCredentials({
        email: formData.email,
        password: tempPassword,
      });
      setRegistered(true);
      toast.success('Registro realizado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao registrar:', error);
      toast.error(error.message || 'Erro ao realizar registro');
    } finally {
      setLoading(false);
    }
  };

  if (registered && credentials) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <CheckCircle className="h-16 w-16 text-cagio-green mx-auto mb-4" />
            <CardTitle className="text-2xl">Registro Concluído!</CardTitle>
            <CardDescription>
              Suas credenciais de acesso foram geradas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>IMPORTANTE:</strong> Guarde estas credenciais em local seguro. 
                Você usará estas informações para acessar a área do aluno.
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted rounded-lg space-y-3">
              <div>
                <Label className="text-sm text-muted-foreground">Email de Acesso</Label>
                <p className="font-mono font-medium">{credentials.email}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Senha Temporária</Label>
                <p className="font-mono font-medium text-lg">{credentials.password}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Seu cadastro está pendente de aprovação pela empresa. 
                Você receberá um email quando seu acesso for liberado.
              </p>
            </div>

            {companyInfo && (
              <div className="p-4 border border-border rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Empresa:</p>
                <p className="font-medium">{companyInfo.name}</p>
                {companyInfo.phone && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Telefone: {companyInfo.phone}
                  </p>
                )}
                {companyInfo.email && (
                  <p className="text-sm text-muted-foreground">
                    Email: {companyInfo.email}
                  </p>
                )}
              </div>
            )}

            <Button
              onClick={() => navigate('/auth/login')}
              className="w-full bg-cagio-green hover:bg-cagio-green-dark"
            >
              Ir para Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <CardTitle className="text-2xl">Registro de Aluno</CardTitle>
          <CardDescription>
            {companyInfo ? `${companyInfo.name}` : 'Preencha seus dados para se registrar'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Pessoais */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações Pessoais
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="birth_date">Data de Nascimento *</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="birth_date"
                      type="date"
                      required
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender">Sexo</Label>
                  <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Contato
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="seu@email.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="address">Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Seu endereço completo"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Contato de Emergência */}
            <div className="space-y-4">
              <h3 className="font-medium">Contato de Emergência</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergency_name">Nome</Label>
                  <Input
                    id="emergency_name"
                    value={formData.emergency_contact_name}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                    placeholder="Nome do contato"
                  />
                </div>

                <div>
                  <Label htmlFor="emergency_phone">Telefone</Label>
                  <Input
                    id="emergency_phone"
                    value={formData.emergency_contact_phone}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            </div>

            {/* Notas Médicas */}
            <div>
              <Label htmlFor="medical_notes">Condições Médicas ou Restrições</Label>
              <Textarea
                id="medical_notes"
                value={formData.medical_notes}
                onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
                placeholder="Descreva quaisquer condições médicas, alergias ou restrições físicas"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-cagio-green hover:bg-cagio-green-dark"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Concluir Registro'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};