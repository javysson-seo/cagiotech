
import React, { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, BarChart3, MessageSquare, ArrowRight } from 'lucide-react';

const LandingContent: React.FC = () => {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    console.log('Login button clicked, navigating to /auth/login');
    navigate('/auth/login');
  };

  const handleBoxRegisterClick = () => {
    console.log('Box register button clicked, navigating to /auth/box-register');
    navigate('/auth/box-register');
  };

  const handleStudentRegisterClick = () => {
    console.log('Student register button clicked, navigating to /auth/student-register');
    navigate('/auth/student-register');
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cagio-green mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src="/lovable-uploads/8dbf4355-937c-46a1-b5ed-612c0fa8be8e.png" alt="CagioTech" className="h-10 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleLoginClick}>
              {t('auth.login')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            {t('landing.title')}
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {t('landing.subtitle')}
          </p>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="group hover:shadow-lg transition-shadow cursor-pointer border-border hover:border-cagio-green">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-cagio-green-light rounded-full flex items-center justify-center mb-4 group-hover:bg-cagio-green transition-colors">
                <Users className="h-8 w-8 text-cagio-green group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground">{t('landing.boxOption')}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('landing.boxDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full bg-cagio-green hover:bg-cagio-green-dark text-white" onClick={handleBoxRegisterClick}>
                {t('landing.getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow cursor-pointer border-border hover:border-cagio-green">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-cagio-green-light rounded-full flex items-center justify-center mb-4 group-hover:bg-cagio-green transition-colors">
                <Users className="h-8 w-8 text-cagio-green group-hover:text-white" />
              </div>
              <CardTitle className="text-2xl text-foreground">{t('landing.studentOption')}</CardTitle>
              <CardDescription className="text-muted-foreground">
                {t('landing.studentDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="w-full bg-foreground hover:bg-foreground/90 text-background" onClick={handleStudentRegisterClick}>
                {t('landing.getStarted')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-8">Principais Funcionalidades</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-cagio-green-light rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-cagio-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{t('landing.features.management')}</h3>
              <p className="text-muted-foreground">{t('landing.features.managementDesc')}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-cagio-green-light rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-cagio-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{t('landing.features.analytics')}</h3>
              <p className="text-muted-foreground">{t('landing.features.analyticsDesc')}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-cagio-green-light rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-cagio-green" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{t('landing.features.communication')}</h3>
              <p className="text-muted-foreground">{t('landing.features.communicationDesc')}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-cagio-green rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-6 opacity-90">
            Junte-se a centenas de BOXes que já confiam no CagioTech
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-cagio-green hover:bg-white/90" onClick={handleBoxRegisterClick}>
              Registar como BOX
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={handleStudentRegisterClick}>
              Registar como Aluno
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-foreground text-background py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <img src="/lovable-uploads/8dbf4355-937c-46a1-b5ed-612c0fa8be8e.png" alt="CagioTech" className="h-8 w-auto" />
          </div>
          <p className="text-background/70">© 2024 CagioTech. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export const Landing: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cagio-green mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    }>
      <LandingContent />
    </Suspense>
  );
};
