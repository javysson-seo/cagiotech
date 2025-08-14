
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';
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
  Target
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    navigate('/auth/box-register');
  };

  const features = [
    {
      id: 1,
      icon: Users,
      title: 'Gestão de Membros',
      description: 'Cadastre, organize e acompanhe todos os seus membros numa interface intuitiva com fichas completas e histórico de pagamentos.',
    },
    {
      id: 2,
      icon: Calendar,
      title: 'Agendamento Inteligente',
      description: 'Sistema de reservas automático com lista de espera, notificações e check-in QR Code para máxima eficiência.',
    },
    {
      id: 3,
      icon: CreditCard,
      title: 'Pagamentos Simplificados',
      description: 'Multibanco, MB Way e débito direto. Tudo integrado e automático com relatórios fiscais e zero trabalho manual.',
    },
    {
      id: 4,
      icon: Dumbbell,
      title: 'Área do Personal Trainer',
      description: 'Ferramenta completa para trainers criarem WODs, planos personalizados e acompanharem resultados dos membros.',
    },
    {
      id: 5,
      icon: Smartphone,
      title: 'App para Membros',
      description: 'Seus membros podem reservar aulas, ver treinos, acompanhar evolução e chat com trainer numa app intuitiva.',
    },
    {
      id: 6,
      icon: BarChart3,
      title: 'Relatórios Poderosos',
      description: 'Analytics completos com dashboard executivo, previsões de receita e análise de ocupação para decisões baseadas em dados.',
    },
  ];

  const plans = [
    {
      id: 1,
      title: 'Starter',
      price: '€29',
      period: '/mês',
      description: 'Perfeito para começar',
      features: [
        'Até 50 membros',
        '2 profissionais',
        'Funcionalidades básicas',
        'Suporte email',
        'Setup gratuito',
      ],
      cta: 'Começar Grátis',
      popular: false,
    },
    {
      id: 2,
      title: 'Professional',
      price: '€59',
      period: '/mês',
      description: 'Mais popular',
      features: [
        'Até 150 membros',
        '5 profissionais',
        'Todas as funcionalidades',
        'App para membros',
        'Suporte prioritário',
        'Relatórios avançados',
      ],
      cta: 'Escolher Plano',
      popular: true,
    },
    {
      id: 3,
      title: 'Business',
      price: '€99',
      period: '/mês',
      description: 'Para empresas estabelecidas',
      features: [
        'Até 300 membros',
        '10 profissionais',
        'Gamificação completa',
        'Integrações avançadas',
        'Gestor de conta dedicado',
        'Treino e onboarding',
      ],
      cta: 'Falar com Vendas',
      popular: false,
    },
    {
      id: 4,
      title: 'Enterprise',
      price: 'Sob consulta',
      period: '',
      description: 'Redes e franchises',
      features: [
        'Membros ilimitados',
        'Profissionais ilimitados',
        'Multi-localização',
        'API personalizada',
        'SLA garantido',
        'Desenvolvimento custom',
      ],
      cta: 'Contactar',
      popular: false,
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'João Silva',
      role: 'FitnessPro Porto',
      testimonial: 'Desde que mudámos para o Cagiotech, poupamos 10 horas por semana em tarefas administrativas. O sistema de pagamentos é fantástico!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 2,
      name: 'Maria Santos',
      role: 'WellnessHub Lisboa',
      testimonial: 'Os meus membros adoram a app. As reservas aumentaram 40% e o no-show diminuiu drasticamente.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b601?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
    {
      id: 3,
      name: 'Pedro Costa',
      role: 'FitCenter Braga',
      testimonial: 'Relatórios incríveis! Finalmente tenho visibilidade total do negócio. Recomendo a 100%.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80',
    },
  ];

  const faqs = [
    {
      id: 1,
      question: 'É difícil migrar os dados da minha empresa?',
      answer: 'Não! A nossa equipa faz toda a migração gratuitamente. Normalmente fica pronto em 24h.',
    },
    {
      id: 2,
      question: 'Os meus membros vão conseguir usar facilmente?',
      answer: 'Sim! A nossa app é super intuitiva. Disponibilizamos treino gratuito para a sua equipa e membros.',
    },
    {
      id: 3,
      question: 'Que métodos de pagamento suportam?',
      answer: 'Multibanco, MB Way, débito direto SEPA e dinheiro. Tudo integrado e sem taxas extra.',
    },
    {
      id: 4,
      question: 'E se eu não gostar?',
      answer: 'Oferecemos 30 dias de garantia. Se não ficar satisfeito, devolvemos o dinheiro.',
    },
    {
      id: 5,
      question: 'Têm suporte em português?',
      answer: 'Claro! Somos uma empresa portuguesa com suporte 100% nacional.',
    },
    {
      id: 6,
      question: 'Posso testar antes de pagar?',
      answer: 'Sim! 14 dias grátis, sem necessidade de cartão de crédito.',
    },
  ];

  const competitiveFeatures = [
    { others: 'Complexos e caros', cagiotech: 'Simples e acessível', advantage: '50% mais barato' },
    { others: 'Suporte internacional', cagiotech: 'Suporte 100% português', advantage: 'Resposta em 2h' },
    { others: 'Pagamentos limitados', cagiotech: 'Multibanco nativo', advantage: 'Zero taxas extras' },
    { others: 'Interface desatualizada', cagiotech: 'Design moderno', advantage: 'Interface intuitiva' },
    { others: 'Setup complicado', cagiotech: 'Online em 24h', advantage: 'Migração gratuita' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/ceef2c27-35ec-471c-a76f-fa4cbb07ecaa.png" 
                alt="Cagiotech" 
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-[#2d3748]">Cagiotech</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#funcionalidades" className="text-[#2d3748] hover:text-[#bed700] transition-colors">Funcionalidades</a>
              <a href="#precos" className="text-[#2d3748] hover:text-[#bed700] transition-colors">Preços</a>
              <a href="#depoimentos" className="text-[#2d3748] hover:text-[#bed700] transition-colors">Clientes</a>
              <a href="#faq" className="text-[#2d3748] hover:text-[#bed700] transition-colors">FAQ</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth/login')}>
                Entrar
              </Button>
              <Button 
                className="bg-[#bed700] hover:bg-[#a5c400] text-white font-semibold"
                onClick={() => navigate('/auth/box-register')}
              >
                Experimente Grátis
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t">
              <nav className="flex flex-col space-y-4 pt-4">
                <a href="#funcionalidades" className="text-[#2d3748] hover:text-[#bed700] transition-colors">Funcionalidades</a>
                <a href="#precos" className="text-[#2d3748] hover:text-[#bed700] transition-colors">Preços</a>
                <a href="#depoimentos" className="text-[#2d3748] hover:text-[#bed700] transition-colors">Clientes</a>
                <a href="#faq" className="text-[#2d3748] hover:text-[#bed700] transition-colors">FAQ</a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="outline" onClick={() => navigate('/auth/login')}>Entrar</Button>
                  <Button 
                    className="bg-[#bed700] hover:bg-[#a5c400] text-white font-semibold"
                    onClick={() => navigate('/auth/box-register')}
                  >
                    Experimente Grátis
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="lg:pr-8">
              <Badge className="mb-6 bg-[#bed700]/10 text-[#bed700] border-[#bed700]/20 font-semibold">
                ✨ Novo: App para membros disponível
              </Badge>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#2d3748] leading-tight">
                Revolucione a Gestão do seu Negócio de Fitness e Wellness com o Cagiotech
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                A plataforma completa para empresas de fitness e wellness portuguesas. 
                Gerencie membros, aulas, pagamentos e muito mais numa só ferramenta.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-[#bed700]" />
                  <span className="text-gray-700">Gestão completa de membros e profissionais</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-[#bed700]" />
                  <span className="text-gray-700">Sistema de reservas inteligente</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-[#bed700]" />
                  <span className="text-gray-700">Pagamentos Multibanco e MB Way</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-[#bed700]" />
                  <span className="text-gray-700">Relatórios em tempo real</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-[#bed700]" />
                  <span className="text-gray-700">100% adaptado à realidade portuguesa</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button 
                  size="lg" 
                  className="bg-[#bed700] hover:bg-[#a5c400] text-white font-semibold text-lg px-8 py-4"
                  onClick={() => navigate('/auth/box-register')}
                >
                  Experimente Grátis por 14 Dias
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="font-semibold text-lg px-8 py-4">
                  <Play className="mr-2 h-5 w-5" />
                  Ver Demo ao Vivo
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                ✓ Teste grátis por 14 dias • ✓ Sem compromisso • ✓ Cancelamento a qualquer momento
              </p>
            </div>

            <div className="lg:pl-8">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-[#2d3748]">Dashboard Cagiotech</h3>
                      <Badge variant="secondary" className="bg-[#bed700]/10 text-[#bed700]">Online</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-[#bed700]">150+</div>
                          <div className="text-sm text-gray-600">Empresas Ativas</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-[#bed700]">15K+</div>
                          <div className="text-sm text-gray-600">Membros</div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-[#bed700]/20 to-[#a5c400]/20 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-12 w-12 text-[#bed700]" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#bed700] rounded-full flex items-center justify-center shadow-lg">
                  <Zap className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-[#e8e8e8]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2d3748] mb-4">
            Já somos a escolha de mais de 150+ empresas de Fitness e Wellness em Portugal
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#bed700] mb-2">
                <AnimatedCounter end={150} suffix="+" />
              </div>
              <div className="text-gray-600">Empresas ativas</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#bed700] mb-2">
                <AnimatedCounter end={15000} suffix="+" />
              </div>
              <div className="text-gray-600">membros gerenciados</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#bed700] mb-2">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <div className="text-gray-600">satisfação dos clientes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#bed700] mb-2">
                <AnimatedCounter end={45} suffix="%" />
              </div>
              <div className="text-gray-600">aumento na receita média</div>
            </div>
          </div>

          <p className="text-gray-600 mt-8 font-medium">
            Juntam-se a nós todas as semanas
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#2d3748]">
              Tudo o que precisa para gerir a sua empresa de Fitness e Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra como a nossa plataforma pode transformar a gestão da sua empresa, 
              otimizar o desempenho dos seus membros e impulsionar o crescimento do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.id} className="group hover:shadow-xl transition-all duration-300 border-gray-100 hover:border-[#bed700]/30">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-[#bed700]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#bed700] transition-colors">
                    <feature.icon className="h-6 w-6 text-[#bed700] group-hover:text-white transition-colors" />
                  </div>
                  <CardTitle className="text-xl font-bold text-[#2d3748] group-hover:text-[#bed700] transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 bg-gradient-to-r from-[#bed700] to-[#a5c400] text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher o Cagiotech?
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 opacity-90">Outros Sistemas</h3>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4">Cagiotech</h3>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-4 opacity-90">Vantagem</h3>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              {competitiveFeatures.map((item, index) => (
                <div key={index} className="grid md:grid-cols-3 gap-4 bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                  <div className="flex items-center text-center md:text-left">
                    <X className="h-4 w-4 mr-2 text-red-300 flex-shrink-0" />
                    <span>{item.others}</span>
                  </div>
                  <div className="flex items-center text-center md:text-left">
                    <Check className="h-4 w-4 mr-2 text-white flex-shrink-0" />
                    <span className="font-semibold">{item.cagiotech}</span>
                  </div>
                  <div className="text-center md:text-left font-medium">
                    {item.advantage}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 bg-[#e8e8e8]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2d3748]">
              Planos feitos para o seu crescimento
            </h2>
            <p className="text-xl text-gray-600">
              Sem surpresas. Sem taxas ocultas. Cancele quando quiser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-[#bed700] scale-105' : ''} hover:shadow-xl transition-all duration-300`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#bed700] text-white px-4 py-1 font-semibold">
                      Mais Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="h-6 w-6 text-[#bed700] mr-2" />
                    <CardTitle className="text-2xl font-bold text-[#2d3748]">
                      {plan.title}
                    </CardTitle>
                  </div>
                  <CardDescription className="text-gray-600 mb-4">
                    {plan.description}
                  </CardDescription>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-[#2d3748]">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <Check className="h-4 w-4 text-[#bed700] mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full font-semibold ${
                      plan.popular 
                        ? 'bg-[#bed700] hover:bg-[#a5c400] text-white' 
                        : 'bg-white hover:bg-gray-50 text-[#2d3748] border border-gray-200'
                    }`}
                    onClick={() => navigate('/auth/box-register')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-5 w-5 text-[#bed700]" />
                <span className="text-gray-700">14 dias grátis sem cartão</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-5 w-5 text-[#bed700]" />
                <span className="text-gray-700">Migração gratuita dos dados</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-5 w-5 text-[#bed700]" />
                <span className="text-gray-700">Suporte 24/7 em português</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Check className="h-5 w-5 text-[#bed700]" />
                <span className="text-gray-700">Garantia 30 dias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2d3748]">
              O que dizem os nossos clientes
            </h2>
            <p className="text-xl text-gray-600">
              Descubra como o Cagiotech tem ajudado empresas de Fitness e Wellness portuguesas a alcançar o sucesso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <CardTitle className="text-lg font-semibold text-[#2d3748]">
                        {testimonial.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {testimonial.role}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 italic mb-4 leading-relaxed">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#e8e8e8]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2d3748]">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tire as suas dúvidas sobre a nossa plataforma.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader 
                  className="cursor-pointer"
                  onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-[#2d3748] text-left">
                      {faq.question}
                    </CardTitle>
                    <ChevronDown 
                      className={`h-5 w-5 text-gray-500 transition-transform ${
                        openFaq === faq.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </div>
                </CardHeader>
                {openFaq === faq.id && (
                  <CardContent className="pt-0">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#bed700] to-[#a5c400] text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pronto para revolucionar a sua empresa de Fitness e Wellness?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se a centenas de empresas que já crescem com o Cagiotech
            </p>

            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Introduza o seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white text-[#2d3748] placeholder:text-gray-500 border-white focus:ring-white"
                required
              />
              <Button 
                type="submit" 
                size="lg"
                className="bg-white text-[#bed700] hover:bg-gray-100 font-semibold whitespace-nowrap"
              >
                Começar Grátis Agora
              </Button>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Setup em 24 horas</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Migração gratuita</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Suporte dedicado</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>14 dias grátis</span>
              </div>
            </div>

            <p className="text-lg opacity-90">
              Prefere falar connosco? 📞 +351 XXX XXX XXX
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-[#2d3748] text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/lovable-uploads/f11d946f-1e84-4046-8622-ffeb54bba33e.png" 
                  alt="Cagiotech" 
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold">Cagiotech</span>
              </div>
              <p className="text-gray-300 text-sm">
                A plataforma completa para gestão de empresas de Fitness e Wellness portuguesas.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>ola@cagiotech.pt</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+351 XXX XXX XXX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Lisboa, Portugal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-600 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-gray-300 mb-4 md:mb-0">
                © 2024 Cagiotech. Todos os direitos reservados.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  <Youtube className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
