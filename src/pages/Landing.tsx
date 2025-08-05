
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, BarChart3, MessageSquare, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/Header';

export const Landing: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: t('landing.features.management'),
      description: t('landing.features.managementDesc')
    },
    {
      icon: BarChart3,
      title: t('landing.features.analytics'),
      description: t('landing.features.analyticsDesc')
    },
    {
      icon: MessageSquare,
      title: t('landing.features.communication'),
      description: t('landing.features.communicationDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('landing.title')}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            {t('landing.subtitle')}
          </p>

          {/* User Type Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-2 hover:border-blue-500"
              onClick={() => navigate('/auth/box-register')}
            >
              <CardHeader className="text-center pb-6">
                <div className="bg-blue-100 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">{t('landing.boxOption')}</CardTitle>
                <CardDescription className="text-lg">
                  {t('landing.boxDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full group-hover:bg-blue-600" size="lg">
                  {t('landing.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 group border-2 hover:border-purple-500"
              onClick={() => navigate('/auth/student-register')}
            >
              <CardHeader className="text-center pb-6">
                <div className="bg-purple-100 dark:bg-purple-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">{t('landing.studentOption')}</CardTitle>
                <CardDescription className="text-lg">
                  {t('landing.studentDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full group-hover:bg-purple-600" size="lg" variant="secondary">
                  {t('landing.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>Confiance por 500+ BOX</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>50K+ Atletas Ativos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span>99.9% Uptime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
