import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Calendar as CalendarIcon,
  BarChart3,
  Star,
  ArrowRight,
  CreditCard,
  Target,
  Smartphone,
  Users,
  Activity,
  Instagram,
  Phone,
  Mail,
  Check,
  ChevronDown,
  Play,
  Package,
  X as XIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      icon: CalendarIcon,
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
      description: "Perfeito para empresas consolidadas.",
      features: [
        "Até 300 clientes activos",
        "10 profissionais",
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
      text: "Desde que implementámos a Cagiotech, conseguimos automatizar a gestão e reduzir o tempo administrativo em mais de 60%. É uma ferramenta essencial.",
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
      <header className="sticky top-0 z-50 w-full border-b border-black/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <Logo size="md" />
            <span className="text-2xl font-bold text-foreground">Cagiotech</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#funcionalidades" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Funcionalidades
            </a>
            <a href="#precos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Preços
            </a>
            <a href="#testemunhos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Testemunhos
            </a>
            <a href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
            <Button variant="outline" onClick={() => navigate('/login')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/box-register')}>
              Começar Grátis
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-black/10 bg-background">
            <nav className="container mx-auto px-6 py-4 flex flex-col gap-4">
              <a href="#funcionalidades" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                Funcionalidades
              </a>
              <a href="#precos" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                Preços
              </a>
              <a href="#testemunhos" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                Testemunhos
              </a>
              <a href="#faq" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                FAQ
              </a>
              <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                Entrar
              </Button>
              <Button className="w-full" onClick={() => navigate('/box-register')}>
                Começar Grátis
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section - Block with border */}
      <section className="container mx-auto px-6 py-20">
        <div className="border border-black/20 rounded-2xl p-12 md:p-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-base px-6 py-2">
              🚀 A Solução Completa para o Seu Negócio
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
              Gestão Inteligente para <span className="text-primary">Ginásios</span> e <span className="text-primary">Estúdios</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Automatize pagamentos, organize agendamentos e ofereça uma experiência premium aos seus clientes. Tudo numa única plataforma.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
              <Button size="lg" className="text-lg px-8 py-6" onClick={() => navigate('/box-register')}>
                Começar Trial Gratuito
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Play className="mr-2 h-5 w-5" />
                Ver Demo
              </Button>
            </div>

            <div className="pt-8 flex flex-wrap justify-center gap-8 text-center">
              <div className="border border-black/10 rounded-lg p-4 bg-background/50 min-w-[140px]">
                <div className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">Clientes Ativos</p>
              </div>
              <div className="border border-black/10 rounded-lg p-4 bg-background/50 min-w-[140px]">
                <div className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={50} suffix="K+" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">Reservas/Mês</p>
              </div>
              <div className="border border-black/10 rounded-lg p-4 bg-background/50 min-w-[140px]">
                <div className="text-3xl font-bold text-primary">
                  <AnimatedCounter end={98} suffix="%" />
                </div>
                <p className="text-sm text-muted-foreground mt-1">Satisfação</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Blocks with borders */}
      <section id="funcionalidades" className="container mx-auto px-6 py-20">
        <div className="border border-black/20 rounded-2xl p-12 md:p-16 bg-muted/20">
          <div className="text-center mb-16 space-y-4">
            <Badge className="text-base px-5 py-2">✨ Funcionalidades</Badge>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
              Tudo o que precisa num só lugar
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas profissionais para transformar a gestão do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="border border-black/10 rounded-xl p-6 bg-background hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition Section - Block with border */}
      <section className="container mx-auto px-6 py-20">
        <div className="border border-black/20 rounded-2xl p-16 md:p-20 bg-gradient-to-br from-secondary/5 to-primary/5">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <Badge className="text-lg px-6 py-2">🚀 Transforme o Seu Negócio</Badge>
              <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Automatize, Organize e Cresça com Cagiotech
              </h2>
              <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                A plataforma completa que elimina o trabalho manual e liberta o seu tempo para focar no que realmente importa: os seus clientes e o crescimento do seu negócio.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 pt-8">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Setup em 24h</h3>
                <p className="text-lg text-muted-foreground">
                  A nossa equipa migra todos os seus dados e configura tudo por si. Zero trabalho da sua parte.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Suporte em Português</h3>
                <p className="text-lg text-muted-foreground">
                  Equipa dedicada que responde em minutos, não em dias. Sempre disponível quando precisa.
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Preço Justo</h3>
                <p className="text-lg text-muted-foreground">
                  Sem taxas escondidas. Pague apenas pelas funcionalidades que usa. Cancele quando quiser.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - Block with border */}
      <section className="container mx-auto px-6 py-20">
        <div className="border border-black/20 rounded-2xl p-16 md:p-20 bg-muted/20">
          <div className="text-center mb-20 space-y-4">
            <Badge className="text-base px-5 py-2">⚡ Comparação</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Porque escolher a Cagiotech?
            </h2>
            <p className="text-2xl text-muted-foreground">
              Simples. Melhor em tudo.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {comparisons.map((item, index) => (
              <div 
                key={index}
                className="grid md:grid-cols-2 gap-6 border border-black/10 rounded-xl overflow-hidden bg-background"
              >
                <div className="p-8 bg-destructive/5 border-r border-black/10">
                  <div className="flex items-start gap-4">
                    <XIcon className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                    <p className="text-muted-foreground text-lg">{item.others}</p>
                  </div>
                </div>
                <div className="p-8 bg-primary/5">
                  <div className="flex items-start gap-4">
                    <Check className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                    <p className="font-medium text-foreground text-lg">{item.cagiotech}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Blocks with borders */}
      <section id="precos" className="container mx-auto px-6 py-20">
        <div className="border border-black/20 rounded-2xl p-16 md:p-20 bg-gradient-to-br from-primary/5 to-background">
          <div className="text-center mb-20 space-y-4">
            <Badge className="text-base px-5 py-2">💎 Planos</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Preços transparentes e justos
            </h2>
            <p className="text-2xl text-muted-foreground">
              Sem taxas escondidas. Cancele quando quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`border border-black/10 rounded-xl bg-background overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  plan.popular ? 'ring-2 ring-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold">
                    ⭐ Mais Popular
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-foreground">€{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>

                  <Button 
                    className="w-full mb-6" 
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    onClick={() => navigate('/box-register')}
                  >
                    {plan.cta}
                  </Button>

                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Block with border */}
      <section id="testemunhos" className="container mx-auto px-6 py-20">
        <div className="border border-black/20 rounded-2xl p-16 md:p-20 bg-muted/20">
          <div className="text-center mb-20 space-y-4">
            <Badge className="text-base px-5 py-2">💬 Testemunhos</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              O que dizem os nossos clientes
            </h2>
            <p className="text-2xl text-muted-foreground">
              Histórias reais de quem já transformou o seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="border border-black/10 rounded-xl p-8 bg-background hover:shadow-lg transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.text}"</p>
                <div className="pt-4 border-t border-black/10">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Block with border */}
      <section id="faq" className="container mx-auto px-6 py-20">
        <div className="border border-black/20 rounded-2xl p-16 md:p-20 bg-background">
          <div className="text-center mb-20 space-y-4">
            <Badge className="text-base px-5 py-2">❓ FAQ</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Perguntas Frequentes
            </h2>
            <p className="text-2xl text-muted-foreground">
              Tudo o que precisa saber
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="border border-black/10 rounded-xl overflow-hidden bg-muted/10"
              >
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-muted/20 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-muted-foreground border-t border-black/10 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section - Block with border */}
      <section className="container mx-auto px-6 py-20">
        <div className="border border-black/20 rounded-2xl p-16 md:p-20 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Pronto para transformar o seu negócio?
            </h2>
            <p className="text-2xl text-muted-foreground">
              Junte-se a centenas de empresas que já confiam na Cagiotech
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" className="text-lg px-10 py-7" onClick={() => navigate('/box-register')}>
                Começar Trial Gratuito de 14 Dias
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-7">
                <Phone className="mr-2 h-5 w-5" />
                Falar com Vendas
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              💳 Sem cartão de crédito • ✓ Suporte em Português • 🔒 Dados 100% seguros
            </p>
          </div>
        </div>
      </section>

      {/* Footer - Block with border */}
      <footer className="container mx-auto px-6 py-12">
        <div className="border border-black/20 rounded-2xl p-12 bg-muted/10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Logo size="md" />
                <span className="text-xl font-bold">Cagiotech</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                A solução completa para gestão de ginásios, estúdios e centros de bem-estar. Transforme o seu negócio com tecnologia de ponta.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://instagram.com/cagiotech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Contacto</h3>
              <div className="space-y-3">
                <a href="mailto:info@cagiotech.pt" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Mail className="h-4 w-4" />
                  info@cagiotech.pt
                </a>
                <a href="tel:+351914522100" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Phone className="h-4 w-4" />
                  +351 914 522 100
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Links Rápidos</h3>
              <div className="space-y-3">
                <a href="#funcionalidades" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Funcionalidades
                </a>
                <a href="#precos" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Preços
                </a>
                <a href="#testemunhos" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Testemunhos
                </a>
                <a href="#faq" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-black/10 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 Cagiotech. Todos os direitos reservados. Desenvolvido com ❤️ em Portugal.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};