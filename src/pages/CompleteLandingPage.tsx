
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Users, 
  Calendar, 
  CreditCard, 
  Dumbbell, 
  Smartphone, 
  BarChart3,
  Star,
  ArrowRight,
  Play,
  Menu,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { LoginModal } from '@/components/modals/LoginModal';
import { RegisterModal } from '@/components/modals/RegisterModal';
import { DemoModal } from '@/components/modals/DemoModal';
import { ViewPlansModal } from '@/components/subscriptions/ViewPlansModal';

export const CompleteLandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [activeFeature, setActiveFeature] = useState(0);
  const [counters, setCounters] = useState({ boxes: 0, members: 0, satisfaction: 0, revenue: 0 });
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  
  // Modal states
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [viewPlansOpen, setViewPlansOpen] = useState(false);

  // Animated counters
  useEffect(() => {
    const targets = { boxes: 150, members: 15000, satisfaction: 98, revenue: 45 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let current = { boxes: 0, members: 0, satisfaction: 0, revenue: 0 };
    
    const timer = setInterval(() => {
      current.boxes = Math.min(current.boxes + targets.boxes / steps, targets.boxes);
      current.members = Math.min(current.members + targets.members / steps, targets.members);
      current.satisfaction = Math.min(current.satisfaction + targets.satisfaction / steps, targets.satisfaction);
      current.revenue = Math.min(current.revenue + targets.revenue / steps, targets.revenue);
      
      setCounters({
        boxes: Math.floor(current.boxes),
        members: Math.floor(current.members),
        satisfaction: Math.floor(current.satisfaction),
        revenue: Math.floor(current.revenue)
      });

      if (current.boxes >= targets.boxes) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('⚠️ Para se registar é necessário escolher um plano primeiro!\n\nRedirecionando para a seção de preços...');
    document.getElementById('precos')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const features = [
    {
      icon: <Users className="h-8 w-8" />,
      title: "Gestão de Alunos",
      description: "Cadastre, organize e acompanhe todos os seus atletas numa interface intuitiva",
      details: ["Fichas completas", "Histórico de pagamentos", "Documentos digitais"]
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Agendamento Inteligente",
      description: "Sistema de reservas automático com lista de espera e notificações",
      details: ["Mapa de aulas visual", "Reservas online", "Check-in QR Code"]
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Pagamentos Simplificados",
      description: "Multibanco, MB Way e débito direto. Tudo integrado e automático",
      details: ["Cobranças automáticas", "Relatórios fiscais", "Zero trabalho manual"]
    },
    {
      icon: <Dumbbell className="h-8 w-8" />,
      title: "Área do Personal Trainer",
      description: "Ferramenta completa para trainers criarem WODs e acompanharem alunos",
      details: ["Biblioteca de exercícios", "Planos personalizados", "Tracking de resultados"]
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "App para Alunos",
      description: "Seus alunos podem reservar aulas, ver treinos e acompanhar evolução",
      details: ["Reservas mobile", "Recordes pessoais", "Chat com trainer"]
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Relatórios Poderosos",
      description: "Analytics completos para tomar decisões baseadas em dados",
      details: ["Dashboard executivo", "Previsões de receita", "Análise de ocupação"]
    }
  ];

  const plans = [
    {
      name: "STARTER",
      price: "€29",
      period: "/mês",
      description: "Perfeito para começar",
      features: ["Até 50 alunos", "2 trainers", "Funcionalidades básicas", "Suporte email", "Setup gratuito"],
      cta: "Começar Grátis",
      popular: false
    },
    {
      name: "PROFESSIONAL",
      price: "€59",
      period: "/mês",
      description: "Mais popular",
      features: ["Até 150 alunos", "5 trainers", "Todas as funcionalidades", "App para alunos", "Suporte prioritário", "Relatórios avançados"],
      cta: "Escolher Plano",
      popular: true
    },
    {
      name: "BUSINESS",
      price: "€99",
      period: "/mês",
      description: "Para BOX estabelecidas",
      features: ["Até 300 alunos", "10 trainers", "Gamificação completa", "Integrações avançadas", "Gestor de conta dedicado", "Treino e onboarding"],
      cta: "Falar com Vendas",
      popular: false
    },
    {
      name: "ENTERPRISE",
      price: "Sob consulta",
      period: "",
      description: "Redes e franchises",
      features: ["Alunos ilimitados", "Trainers ilimitados", "Multi-localização", "API personalizada", "SLA garantido", "Desenvolvimento custom"],
      cta: "Contactar",
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      company: "CrossFit Porto",
      text: "Desde que mudámos para o CagioTech, poupamos 10 horas por semana em tarefas administrativas. O sistema de pagamentos é fantástico!",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=joao"
    },
    {
      name: "Maria Santos",
      company: "FunctionalFit Lisboa",
      text: "Os meus alunos adoram a app. As reservas aumentaram 40% e o no-show diminuiu drasticamente.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria"
    },
    {
      name: "Pedro Costa",
      company: "StrongBox Braga",
      text: "Relatórios incríveis! Finalmente tenho visibilidade total do negócio. Recomendo a 100%.",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pedro"
    }
  ];

  const faqs = [
    {
      question: "É difícil migrar os dados da minha BOX?",
      answer: "Não! A nossa equipa faz toda a migração gratuitamente. Normalmente fica pronto em 24h."
    },
    {
      question: "Os meus alunos vão conseguir usar facilmente?",
      answer: "Sim! A nossa app é super intuitiva. Disponibilizamos treino gratuito para a sua equipa e alunos."
    },
    {
      question: "Que métodos de pagamento suportam?",
      answer: "Multibanco, MB Way, débito direto SEPA e dinheiro. Tudo integrado e sem taxas extra."
    },
    {
      question: "E se eu não gostar?",
      answer: "Oferecemos 30 dias de garantia. Se não ficar satisfeito, devolvemos o dinheiro."
    },
    {
      question: "Têm suporte em português?",
      answer: "Claro! Somos uma empresa portuguesa com suporte 100% nacional."
    },
    {
      question: "Posso testar antes de pagar?",
      answer: "Sim! 14 dias grátis, sem necessidade de cartão de crédito."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/8dbf4355-937c-46a1-b5ed-612c0fa8be8e.png" alt="CagioTech" className="h-10 w-auto" />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('funcionalidades')} className="text-muted-foreground hover:text-foreground transition-colors">
                Funcionalidades
              </button>
              <button onClick={() => scrollToSection('precos')} className="text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </button>
              <button onClick={() => scrollToSection('depoimentos')} className="text-muted-foreground hover:text-foreground transition-colors">
                Clientes
              </button>
              <button onClick={() => scrollToSection('faq')} className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </button>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={() => setLoginModalOpen(true)}>
                Entrar
              </Button>
              <Button className="bg-[#bed700] hover:bg-[#a5c400] text-white" onClick={() => setRegisterModalOpen(true)}>
                Começar Grátis
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-border">
              <nav className="flex flex-col space-y-4 mt-4">
                <button onClick={() => scrollToSection('funcionalidades')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                  Funcionalidades
                </button>
                <button onClick={() => scrollToSection('precos')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                  Preços
                </button>
                <button onClick={() => scrollToSection('depoimentos')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                  Clientes
                </button>
                <button onClick={() => scrollToSection('faq')} className="text-left text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </button>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="outline" onClick={() => setLoginModalOpen(true)}>Entrar</Button>
                  <Button className="bg-[#bed700] hover:bg-[#a5c400] text-white" onClick={() => setRegisterModalOpen(true)}>
                    Começar Grátis
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 min-h-screen bg-gradient-to-br from-background to-muted flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                  Revolucione a Gestão da sua <span className="text-[#bed700]">BOX</span> com o CagioTech
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  A plataforma completa para ginásios portugueses. Gerencie alunos, aulas, pagamentos e muito mais numa só ferramenta.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#bed700] flex-shrink-0" />
                  <span className="text-foreground">Gestão completa de membros e trainers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#bed700] flex-shrink-0" />
                  <span className="text-foreground">Sistema de reservas inteligente</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#bed700] flex-shrink-0" />
                  <span className="text-foreground">Pagamentos Multibanco e MB Way</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#bed700] flex-shrink-0" />
                  <span className="text-foreground">Relatórios em tempo real</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-[#bed700] flex-shrink-0" />
                  <span className="text-foreground">100% adaptado à realidade portuguesa</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-[#bed700] hover:bg-[#a5c400] text-white" onClick={() => scrollToSection('precos')}>
                  Experimente Grátis por 14 Dias
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => setDemoModalOpen(true)}>
                  <Play className="mr-2 h-4 w-4" />
                  Ver Demo ao Vivo
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-2xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-[#bed700] mx-auto mb-4" />
                    <p className="text-muted-foreground">Dashboard CagioTech</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Já somos a escolha de mais de 150+ BOX em Portugal
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#bed700]">{counters.boxes}+</div>
              <div className="text-muted-foreground">BOX ativas</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#bed700]">{counters.members.toLocaleString()}+</div>
              <div className="text-muted-foreground">alunos gerenciados</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#bed700]">{counters.satisfaction}%</div>
              <div className="text-muted-foreground">satisfação dos clientes</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold text-[#bed700]">{counters.revenue}%</div>
              <div className="text-muted-foreground">aumento na receita média</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="funcionalidades" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Tudo o que precisa para gerir a sua BOX
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className={`group hover:shadow-lg transition-all duration-300 cursor-pointer ${
                activeFeature === index ? 'ring-2 ring-[#bed700] shadow-lg' : ''
              }`}>
                <CardHeader>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                    activeFeature === index ? 'bg-[#bed700] text-white' : 'bg-muted text-[#bed700]'
                  }`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#bed700] flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-20 bg-gradient-to-r from-[#bed700] to-[#a5c400] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que escolher o CagioTech?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            <div className="space-y-4">
              <div className="text-2xl font-bold">50% mais barato</div>
              <div className="opacity-90">vs outros sistemas complexos</div>
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Resposta em 2h</div>
              <div className="opacity-90">Suporte 100% português</div>
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Zero taxas extras</div>
              <div className="opacity-90">Multibanco nativo</div>
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Interface intuitiva</div>
              <div className="opacity-90">Design moderno</div>
            </div>
            <div className="space-y-4">
              <div className="text-2xl font-bold">Online em 24h</div>
              <div className="opacity-90">Migração gratuita</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Planos feitos para o seu crescimento
            </h2>
            <p className="text-xl text-muted-foreground">
              Sem surpresas. Sem taxas ocultas. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'ring-2 ring-[#bed700] shadow-xl scale-105' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#bed700] text-white">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-4xl font-bold text-[#bed700]">
                    {plan.price}<span className="text-lg text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-[#bed700] flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-[#bed700] hover:bg-[#a5c400] text-white' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => setViewPlansOpen(true)}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center space-y-4">
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-[#bed700]" />
                <span>14 dias grátis sem cartão</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-[#bed700]" />
                <span>Migração gratuita dos dados</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-[#bed700]" />
                <span>Suporte 24/7 em português</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-5 w-5 text-[#bed700]" />
                <span>Garantia 30 dias</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              O que dizem os nossos clientes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center space-x-3">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-muted">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full p-6 text-left hover:bg-muted/50 transition-colors"
                  onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{faq.question}</h3>
                    {faqOpen === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
                {faqOpen === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#bed700] to-[#a5c400] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Pronto para revolucionar a sua BOX?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a centenas de ginásios que já crescem com o CagioTech
          </p>

          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-8">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white text-foreground"
                required
              />
              <Button type="submit" className="bg-foreground text-[#bed700] hover:bg-foreground/90">
                Começar Grátis Agora
              </Button>
            </div>
          </form>

          <div className="mb-8">
            <p className="mb-4 opacity-90">🎮 Quer testar antes? Experimente nossa DEMO:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setDemoModalOpen(true)}>
                Login Demo BOX
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setDemoModalOpen(true)}>
                Login Demo Personal Trainer
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => setDemoModalOpen(true)}>
                Login Demo Aluno
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Setup em 24 horas</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Migração gratuita</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Suporte dedicado</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>14 dias grátis</span>
            </div>
          </div>

          <p className="opacity-90">
            Prefere falar connosco? 📞 +351 220 123 456
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <img src="/lovable-uploads/8dbf4355-937c-46a1-b5ed-612c0fa8be8e.png" alt="CagioTech" className="h-10 w-auto" />
              <p className="text-background/70">
                A plataforma completa para gestão de ginásios em Portugal.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Produto</h4>
              <ul className="space-y-2 text-background/70">
                <li><button onClick={() => scrollToSection('funcionalidades')} className="hover:text-background transition-colors">Funcionalidades</button></li>
                <li><button onClick={() => scrollToSection('precos')} className="hover:text-background transition-colors">Preços</button></li>
                <li><a href="#" className="hover:text-background transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Empresa</h4>
              <ul className="space-y-2 text-background/70">
                <li><a href="#" className="hover:text-background transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Contacto</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Política Privacidade</a></li>
                <li><a href="#" className="hover:text-background transition-colors">Termos de Uso</a></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Contacto</h4>
              <ul className="space-y-2 text-background/70">
                <li>ola@cagiotech.pt</li>
                <li>+351 220 123 456</li>
                <li>Lisboa, Portugal</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-background/20 pt-8 text-center space-y-2">
            <p className="text-background/70">
              Desenvolvido por{' '}
              <a
                href="https://newdester.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-background hover:text-background/80 font-medium transition-colors"
              >
                Newdester
              </a>
            </p>
            <p className="text-background/70">
              © 2024 CagioTech. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal 
        isOpen={loginModalOpen} 
        onClose={() => setLoginModalOpen(false)}
        onOpenRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />
      
      <RegisterModal 
        isOpen={registerModalOpen} 
        onClose={() => setRegisterModalOpen(false)}
        onOpenLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />
      
      <DemoModal 
        isOpen={demoModalOpen} 
        onClose={() => setDemoModalOpen(false)}
      />
      
      <ViewPlansModal 
        open={viewPlansOpen} 
        onOpenChange={setViewPlansOpen} 
      />
    </div>
  );
};
