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
  Phone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Logo } from '@/components/ui/logo';

export const Landing = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Calendar,
      title: "Gestão completa de aulas",
      description: "Agendamento, inscrições e presenças automatizadas"
    },
    {
      icon: CreditCard,
      title: "Pagamentos automáticos",
      description: "Multibanco, MB Way e cartões integrados"
    },
    {
      icon: Activity,
      title: "Controlo de assiduidade",
      description: "Registo de presenças em tempo real"
    },
    {
      icon: BarChart3,
      title: "Relatórios e métricas",
      description: "Dashboards com insights de performance"
    },
    {
      icon: Smartphone,
      title: "App intuitiva",
      description: "Para gestores e alunos, simples e eficaz"
    },
    {
      icon: MessageSquare,
      title: "Suporte local",
      description: "Formação personalizada em português"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Menos trabalho administrativo",
      description: "Automatiza inscrições, presenças e pagamentos"
    },
    {
      icon: Heart,
      title: "Maior retenção",
      description: "Acompanha hábitos dos alunos e age antes de perder membros"
    },
    {
      icon: TrendingUp,
      title: "Crescimento sustentável",
      description: "Dashboards com insights reais para decisões rápidas"
    },
    {
      icon: Award,
      title: "Imagem premium",
      description: "Destaca-te com uma experiência moderna e profissional"
    },
    {
      icon: Target,
      title: "Feito para Portugal",
      description: "Integra MB Way, Multibanco e suporte em português"
    }
  ];

  const businesses = [
    { name: "Ginásios", icon: Activity },
    { name: "Box's de CrossFit", icon: Target },
    { name: "Estúdios de Yoga", icon: Heart },
    { name: "Pilates", icon: Users },
    { name: "Fisioterapia", icon: MessageSquare },
    { name: "Centros de Bem-estar", icon: Award }
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
            <a href="#beneficios" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Benefícios
            </a>
            <a href="#para-quem" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Para Quem
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
              Experimenta Gratuitamente
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
                href="#beneficios" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Benefícios
              </a>
              <a 
                href="#para-quem" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Para Quem
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
                Experimenta Gratuitamente
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
          <div className="mx-auto max-w-4xl text-center animate-fade-in">
            <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Transforma o teu ginásio, box ou estúdio numa{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                máquina de crescimento e eficiência
              </span>
            </h1>
            <p className="mb-8 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Software inteligente de gestão para empresas de fitness e wellness — aulas, membros, pagamentos e relatórios, tudo numa única plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth/box-register')}
                className="gap-2 text-base px-8 py-6 h-auto"
              >
                Experimenta Gratuitamente
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => window.open('https://wa.me/351938590116', '_blank')}
                className="gap-2 text-base px-8 py-6 h-auto"
              >
                <Phone className="h-5 w-5" />
                Fala connosco no WhatsApp
              </Button>
            </div>
            
            {/* Features highlight */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-16">
              {[
                { icon: Calendar, label: "Aulas" },
                { icon: Users, label: "Membros" },
                { icon: CreditCard, label: "Pagamentos" },
                { icon: BarChart3, label: "Relatórios" }
              ].map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card border animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sobre a CagioTech */}
      <section id="funcionalidades" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Tudo o que precisas para gerir o teu negócio de fitness num só lugar
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Na CagioTech, acreditamos que gerir um ginásio, box de CrossFit ou centro de bem-estar deve ser simples e eficiente.
              O nosso software ajuda-te a automatizar tarefas, reduzir erros e libertar tempo para te focares no que mais importa — os teus membros.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-foreground flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section id="beneficios" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Mais eficiência. Mais retenção.{" "}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Mais crescimento.
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex flex-col items-center text-center p-8 rounded-xl bg-card border-2 hover:border-primary transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-4 rounded-full bg-primary/10 mb-6">
                  <benefit.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Para Quem É */}
      <section id="para-quem" className="py-20 md:py-32 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Ideal para qualquer negócio de fitness ou wellness
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Perfeito para ginásios, box's de CrossFit, estúdios de yoga, pilates, fisioterapia e centros de bem-estar que querem crescer de forma inteligente e moderna.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
            {businesses.map((business, index) => (
              <div 
                key={index}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card border hover:border-primary transition-all duration-300 hover:shadow-lg animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <business.icon className="h-8 w-8 text-primary" />
                <span className="text-sm font-medium text-center text-foreground">{business.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testemunho */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <Card className="border-2 border-primary/20 shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="flex gap-1 mb-6 justify-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-primary text-primary" />
                  ))}
                </div>
                <blockquote className="text-xl md:text-2xl text-center text-foreground italic mb-8 leading-relaxed">
                  "Desde que começámos com a CagioTech, simplificámos tudo — desde pagamentos até aulas. A retenção subiu e o feedback dos alunos é incrível!"
                </blockquote>
                <div className="text-center">
                  <p className="font-semibold text-lg text-foreground">Cliente CagioTech</p>
                  <p className="text-muted-foreground">Box de CrossFit, Lisboa</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
              Pronto para transformar o teu negócio de fitness?
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed">
              Fala connosco e marca já a tua demonstração gratuita.<br />
              Descobre como a CagioTech pode revolucionar o teu dia a dia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
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

            <div className="pt-8 border-t">
              <Button 
                size="lg"
                onClick={() => navigate('/auth/box-register')}
                className="gap-2 text-lg px-12 py-7 h-auto"
              >
                Experimenta Gratuitamente
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
              Software inteligente de gestão para empresas de fitness e wellness
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
            </div>
            
            <div className="pt-6 border-t text-sm text-muted-foreground space-y-2">
              <p>© 2025 CagioTech. Todos os direitos reservados.</p>
              <p className="flex items-center justify-center gap-1">
                Desenvolvido por Newdester 
                <Heart className="h-4 w-4 text-primary fill-primary inline-block" />
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
