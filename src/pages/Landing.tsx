import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Calendar,
  TrendingUp,
  Zap,
  BarChart3,
  Heart,
  CheckCircle,
  Star,
  ArrowRight,
  CreditCard,
  Target,
  Smartphone,
  Users,
  Award,
  Activity,
  MessageSquare,
  Instagram,
  Phone,
  Mail,
  Check,
  ChevronDown,
  Play,
  Shield,
  Clock,
  HeadphonesIcon,
  Package,
  X as XIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { Logo } from '@/components/ui/logo';

export const Landing = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: Users,
      title: "Gestão de Clientes e Profissionais",
      description: "Organize toda a operação: inscrições, presenças, pagamentos e histórico de interações — tudo centralizado e acessível em tempo real."
    },
    {
      icon: Calendar,
      title: "Agendamento Inteligente",
      description: "Sistema de reservas automático com notificações e lista de espera integrada — nunca mais perca uma sessão por desorganização."
    },
    {
      icon: CreditCard,
      title: "Pagamentos Automatizados com IfthenPay",
      description: "Receba pagamentos de forma rápida e segura com integração nativa da IfthenPay. Gere recibos, reconciliações e relatórios fiscais automaticamente."
    },
    {
      icon: Activity,
      title: "Plataforma para Profissionais",
      description: "Personal trainers, terapeutas e instrutores podem criar planos de treino, sessões personalizadas e acompanhar resultados dos seus clientes."
    },
    {
      icon: Smartphone,
      title: "App Mobile para Clientes",
      description: "Os seus clientes podem marcar sessões, ver planos, acompanhar evolução e comunicar com a sua equipa — tudo através de uma app simples e profissional."
    },
    {
      icon: BarChart3,
      title: "Relatórios e Análises",
      description: "Dashboard intuitivo com métricas em tempo real: desempenho, retenção, receitas, ocupação e mais — tome decisões baseadas em dados."
    },
    {
      icon: Package,
      title: "Gestão de Recursos e Equipamentos",
      description: "Controle materiais, manutenção e disponibilidade de espaços ou equipamentos com alertas automáticos e agendamentos rápidos."
    },
    {
      icon: Target,
      title: "CRM Integrado",
      description: "Acompanhe leads, conversões e retenção de clientes com funil visual e campanhas automatizadas de marketing."
    }
  ];

  const plans = [
    {
      id: 1,
      name: "Starter",
      price: "69,90",
      period: "/mês",
      color: "bg-cagio-green",
      description: "Ideal para estúdios e negócios em crescimento.",
      features: [
        "Até 100 clientes activos",
        "3 profissionais",
        "Agendamento de sessões",
        "Pagamentos via IfthenPay",
        "App mobile para clientes",
        "Relatórios básicos",
        "Suporte por e-mail",
        "Setup e migração incluídos"
      ],
      cta: "Começar agora",
      popular: false
    },
    {
      id: 2,
      name: "Professional",
      price: "179,90",
      period: "/mês",
      color: "bg-cagio-green-dark",
      description: "Perfeito para empresas consolidadas.",
      features: [
        "Até 300 clientes activos",
        "10 profissionais",
        "Todas as funcionalidades do Starter",
        "Gestão de equipamentos",
        "CRM completo",
        "Relatórios avançados e analytics",
        "Gamificação e desafios",
        "Integrações externas",
        "Suporte prioritário (chat)",
        "Formação dedicada"
      ],
      cta: "Experimentar grátis",
      popular: true
    },
    {
      id: 3,
      name: "Business",
      price: "229,90",
      period: "/mês",
      color: "bg-cagio-green-dark",
      description: "Para redes, franchises e centros multiunidade.",
      features: [
        "Clientes e profissionais ilimitados",
        "Todas as funcionalidades do Professional",
        "Multi-localização (até 5 unidades)",
        "Dashboard consolidado",
        "API personalizada",
        "Automações avançadas",
        "Marca própria (white-label)",
        "Integrações personalizadas",
        "Gestor de conta dedicado",
        "Suporte 24/7"
      ],
      cta: "Contactar Vendas",
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "João Silva",
      role: "Diretor — StudioFit Lisboa",
      text: "Desde que implementámos a CagioTech, conseguimos automatizar a gestão e reduzir o tempo administrativo em mais de 60%. É uma ferramenta essencial.",
      rating: 5
    },
    {
      name: "Maria Santos",
      role: "Gestora — WellnessHub Algarve",
      text: "Os nossos clientes adoram a app. As reservas aumentaram 40% e a taxa de cancelamentos caiu drasticamente.",
      rating: 5
    },
    {
      name: "Pedro Costa",
      role: "Fundador — ActiveZone Porto",
      text: "A análise de dados em tempo real mudou a forma como tomamos decisões. Tudo está mais claro e previsível.",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "É difícil migrar os meus dados?",
      answer: "Nada disso. A nossa equipa faz tudo por si — sem custos adicionais."
    },
    {
      question: "O software é compatível com o meu tipo de negócio?",
      answer: "Sim! Funciona para ginásios, estúdios, clínicas de bem-estar, academias e personal trainers."
    },
    {
      question: "Como funcionam os pagamentos?",
      answer: "Todos os pagamentos são processados via IfthenPay, com segurança e integração total."
    },
    {
      question: "Posso testar antes de comprar?",
      answer: "Claro! Oferecemos 14 dias gratuitos sem compromisso."
    },
    {
      question: "O suporte é em português?",
      answer: "100%! E respondemos em média em menos de 2 horas."
    }
  ];

  const comparisons = [
    { others: "Complexos e caros", cagiotech: "Simples, intuitivo e 50% mais económico" },
    { others: "Suporte internacional genérico", cagiotech: "Suporte 100% português com resposta rápida" },
    { others: "Integrações limitadas", cagiotech: "Pagamentos automáticos via IfthenPay" },
    { others: "Software desactualizado", cagiotech: "Actualizações mensais incluídas" },
    { others: "Setup demorado", cagiotech: "Migração gratuita e online em 24–48 h" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="md" />
            <span className="text-xl font-bold text-foreground">CagioTech</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#funcionalidades" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#precos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <a href="#depoimentos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testemunhos
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
            <Button 
              onClick={() => navigate('/auth/login')}
              variant="ghost"
            >
              Entrar
            </Button>
            <Button 
              onClick={() => navigate('/auth/box-register')}
              className="gap-2"
            >
              Começar Grátis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </nav>

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
          <div className="md:hidden border-t bg-background animate-fade-in">
            <nav className="container mx-auto flex flex-col gap-4 p-4">
              <a 
                href="#funcionalidades" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Funcionalidades
              </a>
              <a 
                href="#precos" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Preços
              </a>
              <a 
                href="#depoimentos" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Testemunhos
              </a>
              <a 
                href="#faq" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <Button 
                onClick={() => navigate('/auth/login')}
                variant="outline"
                className="w-full"
              >
                Entrar
              </Button>
              <Button 
                onClick={() => navigate('/auth/box-register')}
                className="w-full gap-2"
              >
                Começar Grátis
                <ArrowRight className="h-4 w-4" />
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20 py-20 md:py-32">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-5xl text-center animate-fade-in">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20 font-semibold text-base px-4 py-2">
              ✨ Mais de 150 empresas de fitness e wellness já confiam em nós
            </Badge>
            
            <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Transforme a Gestão do Seu Negócio com a{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                CagioTech
              </span>
            </h1>
            
            <p className="mb-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A plataforma inteligente e completa para o setor fitness e wellness em Portugal.<br />
              Gestão integrada de membros, serviços, horários, pagamentos e performance — tudo numa única solução digital, simples e poderosa.
            </p>

            <div className="space-y-3 mb-10 max-w-2xl mx-auto">
              {[
                "Gestão completa de clientes e profissionais",
                "Agendamento automatizado com lista de espera",
                "Pagamentos online via IfthenPay",
                "App mobile moderna e intuitiva",
                "Suporte 100% português e setup rápido"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-left">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth/box-register')}
                className="gap-2 text-base px-8 py-6 h-auto"
              >
                Experimente grátis por 14 dias
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="gap-2 text-base px-8 py-6 h-auto"
              >
                <Play className="h-5 w-5" />
                Ver Demonstração
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              ✓ Sem compromisso • ✓ Sem cartão de crédito
            </p>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Resultados Reais. Impacto Comprovado.
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { value: 150, suffix: "+", label: "negócios activos" },
              { value: 15000, suffix: "+", label: "utilizadores geridos" },
              { value: 98, suffix: "%", label: "satisfação dos clientes" },
              { value: 45, suffix: "%", label: "aumento médio de eficiência", prefix: "+" }
            ].map((metric, index) => (
              <Card key={index} className="text-center p-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-0">
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                    {metric.prefix && <span>{metric.prefix}</span>}
                    <AnimatedCounter end={metric.value} />
                    {metric.suffix && <span>{metric.suffix}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Tudo o que precisa para gerir o seu negócio de fitness e wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A CagioTech foi criada para simplificar a gestão de empresas do setor, otimizar processos e oferecer uma experiência digital moderna a equipas e clientes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Porque escolher a CagioTech?
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center p-4 font-semibold text-lg bg-card rounded-t-lg border">
                Outros sistemas
              </div>
              <div className="text-center p-4 font-semibold text-lg bg-primary/10 rounded-t-lg border border-primary">
                CagioTech
              </div>
            </div>
            
            {comparisons.map((item, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-4 mb-2">
                <div className="flex items-center gap-3 p-4 bg-card border rounded-lg">
                  <XIcon className="h-5 w-5 text-destructive flex-shrink-0" />
                  <span className="text-muted-foreground">{item.others}</span>
                </div>
                <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground font-medium">{item.cagiotech}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Planos simples e transparentes
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Escolha o plano certo para o seu negócio — todos incluem 14 dias de teste gratuito, setup e migração sem custos.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id} 
                className={`relative ${plan.popular ? 'border-primary border-2 shadow-xl' : 'border-2'} animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Mais popular
                  </Badge>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${plan.color}`} />
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-foreground">€{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate('/auth/box-register')}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8">
            Todos os planos incluem setup gratuito, migração de dados e formação da equipa.<br />
            <span className="font-semibold">Precisa de um plano à medida? Contacte-nos.</span>
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              O que dizem os nossos clientes
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="border-2 hover:border-primary transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground italic mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card 
                key={index}
                className="border-2 cursor-pointer hover:border-primary transition-all animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-foreground pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown 
                      className={`h-5 w-5 text-primary flex-shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {openFaq === index && (
                    <p className="mt-4 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Pronto para transformar o seu negócio fitness e wellness?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
              Junte-se às mais de 150 empresas que já confiam na CagioTech para simplificar a sua gestão.<br />
              Comece grátis hoje e veja a diferença.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button 
                size="lg"
                onClick={() => window.open('https://wa.me/351938590116', '_blank')}
                className="gap-2 text-base px-8 py-6 h-auto"
              >
                <Phone className="h-5 w-5" />
                +351 938 590 116
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => window.open('https://instagram.com/cagiotech', '_blank')}
                className="gap-2 text-base px-8 py-6 h-auto"
              >
                <Instagram className="h-5 w-5" />
                @cagiotech
              </Button>
            </div>

            <Button 
              size="lg"
              variant="outline"
              onClick={() => window.open('mailto:suporte@cagiotech.pt')}
              className="gap-2 text-base px-8 py-6 h-auto mb-8"
            >
              <Mail className="h-5 w-5" />
              suporte@cagiotech.pt
            </Button>

            <div className="pt-8 border-t">
              <Button 
                size="lg"
                onClick={() => navigate('/auth/box-register')}
                className="gap-2 text-lg px-12 py-7 h-auto"
              >
                Começar Grátis Agora
                <ArrowRight className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Logo size="md" />
              <span className="text-xl font-bold text-foreground">CagioTech</span>
            </div>
            
            <p className="text-muted-foreground">
              A plataforma completa para gestão de negócios de fitness e wellness em Portugal.
            </p>
            
            <div className="flex items-center justify-center gap-6 py-6">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://wa.me/351938590116', '_blank')}
              >
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('https://instagram.com/cagiotech', '_blank')}
              >
                <Instagram className="h-4 w-4 mr-2" />
                Instagram
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.open('mailto:suporte@cagiotech.pt')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
            
            <div className="pt-6 border-t text-sm text-muted-foreground space-y-2">
              <p>© 2025 CagioTech. Todos os direitos reservados.</p>
              <p className="flex items-center justify-center gap-1">
                Desenvolvido por{' '}
                <a 
                  href="https://newdester.io" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-semibold hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Newdester 
                  <Heart className="h-4 w-4 text-primary fill-primary" />
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
