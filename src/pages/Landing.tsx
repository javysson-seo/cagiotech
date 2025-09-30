import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Logo } from '@/components/ui/logo';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Check, 
  Users, 
  Calendar, 
  CreditCard, 
  Dumbbell,
  Smartphone,
  BarChart3,
  Star,
  ChevronDown,
  Play,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Instagram,
  Youtube,
  Clock,
  Shield,
  Zap,
  Heart,
  Target,
  TrendingUp,
  HeadphonesIcon
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/auth/box-register');
  };

  const handlePlanSelect = (planId: number) => {
    // Aqui será integrado com o sistema de pagamento
    navigate('/auth/box-register');
  };

  const features = [
    {
      id: 1,
      icon: Users,
      title: 'Gestão Completa de Membros',
      description: 'Registe e acompanhe todos os seus atletas com fichas completas, histórico de pagamentos e presença em tempo real.',
    },
    {
      id: 2,
      icon: Calendar,
      title: 'Agendamento Inteligente',
      description: 'Sistema de reservas automático com lista de espera, notificações push e check-in por QR Code para máxima eficiência.',
    },
    {
      id: 3,
      icon: CreditCard,
      title: 'Pagamentos Automatizados',
      description: 'Multibanco, MB Way e débito directo SEPA. Tudo integrado com relatórios fiscais e reconciliação automática.',
    },
    {
      id: 4,
      icon: Dumbbell,
      title: 'Área do Personal Trainer',
      description: 'Plataforma completa para personal trainers criarem treinos personalizados, acompanharem evolução e gerirem os seus atletas.',
    },
    {
      id: 5,
      icon: Smartphone,
      title: 'App Mobile para Atletas',
      description: 'Os seus membros podem reservar aulas, consultar treinos, acompanhar evolução e comunicar com trainers através de uma app intuitiva.',
    },
    {
      id: 6,
      icon: BarChart3,
      title: 'Relatórios e Analytics',
      description: 'Dashboard executivo com KPIs em tempo real, previsões de receita, análise de ocupação e relatórios personalizados.',
    },
    {
      id: 7,
      icon: Target,
      title: 'Gestão de Equipamentos',
      description: 'Controle inventário, manutenções programadas e disponibilidade de equipamentos com alertas automáticos.',
    },
    {
      id: 8,
      icon: Heart,
      title: 'Planos Nutricionais',
      description: 'Personal trainers podem criar e partilhar planos nutricionais personalizados directamente na plataforma.',
    },
    {
      id: 9,
      icon: TrendingUp,
      title: 'CRM Integrado',
      description: 'Acompanhe leads, conversões, retenção de clientes e crie campanhas de marketing direcionadas.',
    },
  ];

  const plans = [
    {
      id: 1,
      title: 'Starter',
      price: '€69,90',
      period: '/mês',
      description: 'Perfeito para ginásios em crescimento',
      features: [
        'Até 100 atletas activos',
        '3 treinadores',
        'Agendamento de aulas',
        'Pagamentos Multibanco e MB Way',
        'App mobile para atletas',
        'Relatórios básicos',
        'Suporte por email',
        'Setup e migração incluídos',
      ],
      cta: 'Começar Agora',
      popular: false,
      highlight: false,
    },
    {
      id: 2,
      title: 'Professional',
      price: '€179,90',
      period: '/mês',
      description: 'Ideal para ginásios estabelecidos',
      features: [
        'Até 300 atletas activos',
        '10 treinadores',
        'Todas as funcionalidades do Starter',
        'Gestão de equipamentos',
        'Planos nutricionais',
        'CRM completo',
        'Relatórios avançados e analytics',
        'Gamificação e desafios',
        'Integrações com wearables',
        'Suporte prioritário (chat)',
        'Formação dedicada',
      ],
      cta: 'Experimentar Grátis',
      popular: true,
      highlight: true,
    },
    {
      id: 3,
      title: 'Business',
      price: '€229,90',
      period: '/mês',
      description: 'Para redes e franchises',
      features: [
        'Atletas ilimitados',
        'Treinadores ilimitados',
        'Todas as funcionalidades Professional',
        'Multi-localização (até 5 unidades)',
        'Dashboard consolidado',
        'API personalizada',
        'Automações avançadas',
        'White-label (marca própria)',
        'Integrações personalizadas',
        'Gestor de conta dedicado',
        'SLA garantido',
        'Suporte 24/7',
      ],
      cta: 'Contactar Vendas',
      popular: false,
      highlight: false,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'João Silva',
      role: 'Proprietário, CrossFit Porto',
      testimonial: 'Desde que mudámos para o CagioTech, poupamos mais de 15 horas por semana em tarefas administrativas. O sistema de pagamentos automáticos é absolutamente fantástico!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    },
    {
      id: 2,
      name: 'Maria Santos',
      role: 'Directora, WellnessHub Lisboa',
      testimonial: 'Os nossos membros adoram a aplicação móvel. As reservas aumentaram 45% e o no-show diminuiu drasticamente. Recomendo vivamente!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b601?w=150&h=150&fit=crop',
    },
    {
      id: 3,
      name: 'Pedro Costa',
      role: 'Owner, FitCenter Braga',
      testimonial: 'Os relatórios em tempo real mudaram completamente a forma como gerimos o negócio. Finalmente temos visibilidade total de todas as métricas importantes.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
  ];

  const faqs = [
    {
      id: 1,
      question: 'É complicado migrar os dados da minha empresa actual?',
      answer: 'Absolutamente não! A nossa equipa especializada faz toda a migração dos dados gratuitamente. O processo é totalmente acompanhado e normalmente fica concluído em 24-48 horas. Importamos membros, histórico de pagamentos, aulas e tudo o que for necessário.',
    },
    {
      id: 2,
      question: 'Os meus atletas vão conseguir usar facilmente a aplicação?',
      answer: 'Sim! A nossa aplicação móvel foi desenhada para ser extremamente intuitiva. Disponibilizamos formação gratuita para a sua equipa e materiais de apoio para os atletas. A taxa de adopção é superior a 90% nos primeiros 30 dias.',
    },
    {
      id: 3,
      question: 'Que métodos de pagamento são suportados?',
      answer: 'Suportamos Multibanco, MB Way, débito directo SEPA e pagamentos em dinheiro (com registo). Todas as transacções são automaticamente registadas e reconciliadas, sem taxas adicionais além das taxas normais dos operadores.',
    },
    {
      id: 4,
      question: 'E se não ficar satisfeito com a plataforma?',
      answer: 'Oferecemos 30 dias de garantia de satisfação total. Se por algum motivo não ficar completamente satisfeito, devolvemos integralmente o valor investido, sem perguntas.',
    },
    {
      id: 5,
      question: 'O suporte é realmente em português?',
      answer: 'Sim! Somos uma empresa 100% portuguesa com equipa de suporte nacional. Respondemos em média em 2 horas durante horário comercial e oferecemos suporte por email, chat e telefone.',
    },
    {
      id: 6,
      question: 'Posso testar antes de me comprometer?',
      answer: 'Claro! Oferecemos 14 dias de teste totalmente gratuito, com acesso a todas as funcionalidades. Não pedimos cartão de crédito para começar o teste.',
    },
    {
      id: 7,
      question: 'Os dados dos meus atletas estão seguros?',
      answer: 'Sim! Utilizamos encriptação de nível bancário, servidores na Europa (GDPR compliant) e fazemos backups automáticos diários. Os dados são propriedade exclusiva sua e podem ser exportados a qualquer momento.',
    },
    {
      id: 8,
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim, não há períodos de fidelização. Pode cancelar a subscrição a qualquer momento e manter acesso aos seus dados durante 90 dias para exportação.',
    },
  ];

  const competitiveFeatures = [
    { others: 'Sistemas complexos e caros', cagiotech: 'Interface simples e intuitiva', advantage: '50% mais económico' },
    { others: 'Suporte internacional genérico', cagiotech: 'Suporte 100% português', advantage: 'Resposta em 2h' },
    { others: 'Pagamentos limitados', cagiotech: 'Multibanco e MB Way nativos', advantage: 'Zero taxas extras' },
    { others: 'Software desactualizado', cagiotech: 'Tecnologia moderna', advantage: 'Actualizações mensais' },
    { others: 'Setup demorado (semanas)', cagiotech: 'Online em 24-48h', advantage: 'Migração gratuita' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
              <Logo size="md" />
              <span className="text-xl font-bold text-foreground">CagioTech</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#funcionalidades" className="text-foreground/80 hover:text-primary transition-colors">Funcionalidades</a>
              <a href="#precos" className="text-foreground/80 hover:text-primary transition-colors">Preços</a>
              <a href="#depoimentos" className="text-foreground/80 hover:text-primary transition-colors">Testemunhos</a>
              <a href="#faq" className="text-foreground/80 hover:text-primary transition-colors">FAQ</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth/login')}>
                Entrar
              </Button>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                onClick={() => navigate('/auth/box-register')}
              >
                Começar Grátis
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border">
              <nav className="flex flex-col space-y-4 pt-4">
                <a href="#funcionalidades" className="text-foreground/80 hover:text-primary transition-colors">Funcionalidades</a>
                <a href="#precos" className="text-foreground/80 hover:text-primary transition-colors">Preços</a>
                <a href="#depoimentos" className="text-foreground/80 hover:text-primary transition-colors">Testemunhos</a>
                <a href="#faq" className="text-foreground/80 hover:text-primary transition-colors">FAQ</a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="outline" onClick={() => navigate('/auth/login')}>Entrar</Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                    onClick={() => navigate('/auth/box-register')}
                  >
                    Começar Grátis
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="lg:pr-8">
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 font-semibold">
                ✨ Mais de 150 ginásios já confiam em nós
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-foreground leading-tight">
                Transforme a Gestão do Seu Ginásio ou Box
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                A plataforma completa para ginásios, boxes de CrossFit e estúdios de fitness em Portugal. 
                Gerencie membros, aulas, pagamentos e treinos numa única solução integrada.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">Gestão completa de membros e personal trainers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">Agendamento inteligente com lista de espera</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">Pagamentos Multibanco, MB Way e débito directo</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">App mobile para os seus atletas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-foreground">100% adaptado à realidade portuguesa</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg px-8"
                  onClick={() => navigate('/auth/box-register')}
                >
                  Experimente Grátis por 14 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="font-semibold text-lg px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Ver Demonstração
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                ✓ 14 dias grátis • ✓ Sem compromisso • ✓ Sem cartão de crédito
              </p>
            </div>

            <div className="lg:pl-8">
              <div className="relative">
                <Card className="shadow-2xl border-border">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-foreground">Dashboard CagioTech</h3>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">Ao Vivo</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Card className="bg-muted/50">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-primary">
                              <AnimatedCounter end={150} suffix="+" />
                            </div>
                            <div className="text-sm text-muted-foreground">Ginásios Activos</div>
                          </CardContent>
                        </Card>
                        <Card className="bg-muted/50">
                          <CardContent className="p-4">
                            <div className="text-2xl font-bold text-primary">
                              <AnimatedCounter end={15} suffix="K+" />
                            </div>
                            <div className="text-sm text-muted-foreground">Atletas</div>
                          </CardContent>
                        </Card>
                      </div>
                      <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                        <BarChart3 className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-12">
            A escolha de mais de 150 ginásios e boxes em Portugal
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={150} suffix="+" />
              </div>
              <div className="text-muted-foreground">Ginásios activos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={15000} suffix="+" />
              </div>
              <div className="text-muted-foreground">Atletas geridos</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <div className="text-muted-foreground">Satisfação</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                <AnimatedCounter end={45} suffix="%" />
              </div>
              <div className="text-muted-foreground">Aumento receita</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Tudo o que precisa para gerir o seu ginásio
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Uma plataforma completa que transforma a gestão do seu negócio de fitness, 
              optimiza o desempenho dos atletas e impulsiona o crescimento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id} className="hover:shadow-lg transition-all duration-300 border-border group">
                  <CardHeader>
                    <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2 text-foreground">{feature.title}</CardTitle>
                    <CardDescription className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Porque escolher o CagioTech?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comparação com outras plataformas do mercado
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {competitiveFeatures.map((item, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-3 gap-4 items-center">
                      <div className="text-center md:text-left">
                        <p className="text-sm text-muted-foreground mb-1">Outros sistemas</p>
                        <p className="text-foreground/70">{item.others}</p>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-primary text-primary-foreground">{item.advantage}</Badge>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-sm text-muted-foreground mb-1">CagioTech</p>
                        <p className="text-primary font-semibold">{item.cagiotech}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Planos simples e transparentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Escolha o plano ideal para o seu negócio. Todos os planos incluem 14 dias de teste grátis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                className={`relative ${
                  plan.highlight 
                    ? 'border-primary shadow-xl scale-105 md:scale-110' 
                    : 'border-border'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-8 pt-8">
                  <CardTitle className="text-2xl mb-2 text-foreground">{plan.title}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-foreground/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${
                      plan.highlight 
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                        : 'bg-secondary hover:bg-secondary/90'
                    }`}
                    size="lg"
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Todos os planos incluem setup gratuito, migração de dados e formação da equipa
            </p>
            <p className="text-sm text-muted-foreground">
              Precisa de um plano personalizado? <Button variant="link" className="text-primary p-0 h-auto">Contacte-nos</Button>
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              O que dizem os nossos clientes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Junte-se a centenas de ginásios satisfeitos em todo o país
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/80 mb-6 italic">"{testimonial.testimonial}"</p>
                  <div className="flex items-center space-x-4">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-foreground">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tire as suas dúvidas sobre a plataforma
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="border-border">
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-foreground">{faq.question}</CardTitle>
                    <ChevronDown 
                      className={`h-5 w-5 text-muted-foreground transition-transform ${
                        openFaq === faq.id ? 'transform rotate-180' : ''
                      }`}
                    />
                  </div>
                </CardHeader>
                {openFaq === faq.id && (
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Ainda tem dúvidas?
            </p>
            <Button variant="outline" size="lg">
              <HeadphonesIcon className="mr-2 h-5 w-5" />
              Falar com a Nossa Equipa
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para transformar o seu ginásio?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Junte-se a mais de 150 ginásios que já modernizaram a sua gestão com o CagioTech. 
            Comece grátis hoje, sem cartão de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto w-full">
              <Input
                type="email"
                placeholder="O seu email profissional"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-primary-foreground text-foreground"
                required
              />
              <Button 
                type="submit"
                size="lg" 
                variant="secondary" 
                className="bg-background text-foreground hover:bg-background/90 whitespace-nowrap"
              >
                Começar Grátis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>
          </div>
          <p className="text-sm opacity-75">
            ✓ 14 dias grátis • ✓ Setup em 24h • ✓ Suporte em português
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Logo size="sm" />
                <span className="font-bold text-foreground">CagioTech</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                A plataforma completa para gestão de ginásios e boxes em Portugal.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Produto</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#funcionalidades" className="text-muted-foreground hover:text-primary transition-colors">Funcionalidades</a></li>
                <li><a href="#precos" className="text-muted-foreground hover:text-primary transition-colors">Preços</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Integrações</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Empresa</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Carreiras</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Parceiros</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Contacto</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>suporte@cagiotech.pt</span>
                </li>
                <li className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+351 XXX XXX XXX</span>
                </li>
                <li className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Lisboa, Portugal</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2024 CagioTech. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacidade</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Termos</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
