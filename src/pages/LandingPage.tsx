import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Menu, 
  X, 
  ArrowRight, 
  Check, 
  Users, 
  Calendar, 
  BarChart3, 
  MessageSquare,
  Star,
  ChevronDown,
  Play,
  Shield,
  Zap,
  Heart
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
      title: 'Gestão Simplificada de Atletas',
      description: 'Acompanhe o progresso, gerencie planos de treino e personalize a experiência de cada atleta.',
    },
    {
      id: 2,
      icon: Calendar,
      title: 'Agendamento Inteligente de Aulas',
      description: 'Otimize a ocupação da sua box com um sistema de agendamento fácil de usar e totalmente integrado.',
    },
    {
      id: 3,
      icon: BarChart3,
      title: 'Análise de Desempenho em Tempo Real',
      description: 'Tome decisões informadas com base em dados precisos sobre o desempenho da sua box e dos seus atletas.',
    },
    {
      id: 4,
      icon: MessageSquare,
      title: 'Comunicação Direta com a sua Comunidade',
      description: 'Mantenha todos informados com atualizações, novidades e promoções através de canais de comunicação integrados.',
    },
  ];

  const plans = [
    {
      id: 1,
      title: 'Plano Base',
      price: 'Grátis',
      features: [
        'Até 5 atletas',
        'Agendamento de aulas',
        'Relatórios básicos',
      ],
      cta: 'Começar agora',
    },
    {
      id: 2,
      title: 'Plano Pro',
      price: '€29/mês',
      features: [
        'Até 50 atletas',
        'Agendamento avançado',
        'Relatórios personalizados',
        'Suporte prioritário',
      ],
      cta: 'Experimentar Pro',
    },
    {
      id: 3,
      title: 'Plano Premium',
      price: '€59/mês',
      features: [
        'Atletas ilimitados',
        'Todas as funcionalidades Pro',
        'Consultoria individualizada',
        'Integrações exclusivas',
      ],
      cta: 'Contactar Premium',
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'João Silva',
      role: 'Proprietário da CrossFit Porto',
      testimonial: 'A plataforma revolucionou a forma como gerimos a nossa box. Recomendo vivamente!',
      image: 'https://images.unsplash.com/photo-1573496896073-ca9949faefd8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8dGVzdGltb25pYWxzfGVufDB8fDB8fA%3D%3D',
    },
    {
      id: 2,
      name: 'Ana Pereira',
      role: 'Treinadora da CrossFit Lisboa',
      testimonial: 'Com a plataforma, consigo acompanhar de perto o progresso de cada aluno e personalizar os treinos.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8dGVzdGltb25pYWxzfGVufDB8fDB8fA%3D%3D',
    },
    {
      id: 3,
      name: 'Carlos Martins',
      role: 'Aluno da CrossFit Coimbra',
      testimonial: 'A plataforma é muito intuitiva e fácil de usar. Consigo ver o meu progresso e agendar as aulas sem problemas.',
      image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8dGVzdGltb25pYWxzfGVufDB8fDB8fA%3D%3D',
    },
  ];

  const faqs = [
    {
      id: 1,
      question: 'Como posso começar a usar a plataforma?',
      answer: 'Basta criar uma conta e começar a adicionar os seus atletas e aulas. Oferecemos um período de teste gratuito para que possa experimentar todas as funcionalidades.',
    },
    {
      id: 2,
      question: 'Quais são os métodos de pagamento aceites?',
      answer: 'Aceitamos pagamentos por cartão de crédito, débito e transferência bancária.',
    },
    {
      id: 3,
      question: 'Posso cancelar a minha subscrição a qualquer momento?',
      answer: 'Sim, pode cancelar a sua subscrição a qualquer momento sem qualquer custo adicional.',
    },
    {
      id: 4,
      question: 'Oferecem suporte técnico?',
      answer: 'Sim, oferecemos suporte técnico por email e telefone.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#bed700] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-black">CagioTech</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#funcionalidades" className="text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a>
              <a href="#precos" className="text-muted-foreground hover:text-foreground transition-colors">Preços</a>
              <a href="#depoimentos" className="text-muted-foreground hover:text-foreground transition-colors">Clientes</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth/login')}>
                Entrar
              </Button>
              <Button className="bg-[#bed700] hover:bg-[#a5c400] text-white" onClick={() => navigate('/auth/box-register')}>
                Começar Grátis
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
                <a href="#funcionalidades" className="text-muted-foreground hover:text-foreground transition-colors">Funcionalidades</a>
                <a href="#precos" className="text-muted-foreground hover:text-foreground transition-colors">Preços</a>
                <a href="#depoimentos" className="text-muted-foreground hover:text-foreground transition-colors">Clientes</a>
                <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="outline" onClick={() => navigate('/auth/login')}>Entrar</Button>
                  <Button className="bg-[#bed700] hover:bg-[#a5c400] text-white" onClick={() => navigate('/auth/box-register')}>
                    Começar Grátis
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 bg-[#bed700]/10 text-[#bed700] border-[#bed700]/20">
              ✨ Novo: App para alunos disponível
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              A Plataforma que Revoluciona a Gestão da sua BOX
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Simplifique a gestão da sua academia de CrossFit. Desde o agendamento até ao faturamento, 
              tudo numa plataforma intuitiva e poderosa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <form onSubmit={handleEmailSubmit} className="flex gap-2 w-full sm:w-auto">
                <Input
                  type="email"
                  placeholder="Introduza o seu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-[300px]"
                  required
                />
                <Button type="submit" className="bg-[#bed700] hover:bg-[#a5c400] text-white">
                  Começar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#bed700] hover:bg-[#a5c400] text-white" onClick={() => navigate('/auth/box-register')}>
                Experimente Grátis por 14 Dias
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                <Play className="mr-2 h-4 w-4" />
                Ver Demonstração
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              ✓ Teste grátis por 14 dias • ✓ Sem compromisso • ✓ Cancelamento a qualquer momento
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-16 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Funcionalidades que Impulsionam o seu Sucesso
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra como a nossa plataforma pode transformar a gestão da sua box, 
              otimizar o desempenho dos seus atletas e impulsionar o crescimento do seu negócio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <feature.icon className="h-6 w-6 text-[#bed700] mb-4" />
                  <CardTitle className="text-lg font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precos" className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Planos de Preços Flexíveis para Todas as Necessidades
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano que melhor se adapta ao tamanho da sua box e comece a usufruir 
              de todas as funcionalidades da nossa plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card key={plan.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold">
                    {plan.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.price === 'Grátis' ? 'Plano Gratuito' : `A partir de ${plan.price}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-muted-foreground">
                        <Check className="h-4 w-4 mr-2 text-[#bed700]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full bg-[#bed700] hover:bg-[#a5c400] text-white">
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-16 bg-muted">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              O que os Nossos Clientes Dizem
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra como a nossa plataforma tem ajudado boxes de CrossFit a alcançar o sucesso.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex items-center space-x-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {testimonial.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground italic">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="flex items-center mt-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-500" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tire as suas dúvidas sobre a nossa plataforma.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.id} className="shadow-md">
                <CardHeader className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold">
                    {faq.question}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </CardHeader>
                {openFaq === faq.id && (
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {faq.answer}
                    </CardDescription>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted border-t">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 CagioTech. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};
