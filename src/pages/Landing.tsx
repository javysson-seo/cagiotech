
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, BarChart3, MessageSquare, ArrowRight } from 'lucide-react';

export const Landing: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <h1 className="text-2xl font-bold">CagioTech</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/auth/login">
              <Button variant="outline">{t('auth.login')}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {t('landing.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {t('landing.subtitle')}
          </p>
        </div>

        {/* Options Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
          <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">{t('landing.boxOption')}</CardTitle>
              <CardDescription className="text-gray-600">
                {t('landing.boxDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/auth/box-register">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  {t('landing.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">{t('landing.studentOption')}</CardTitle>
              <CardDescription className="text-gray-600">
                {t('landing.studentDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link to="/auth/student-register">
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  {t('landing.getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Principais Funcionalidades</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.features.management')}</h3>
              <p className="text-gray-600">{t('landing.features.managementDesc')}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.features.analytics')}</h3>
              <p className="text-gray-600">{t('landing.features.analyticsDesc')}</p>
            </div>

            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('landing.features.communication')}</h3>
              <p className="text-gray-600">{t('landing.features.communicationDesc')}</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-6 opacity-90">
            Junte-se a centenas de BOXes que já confiam no CagioTech
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/box-register">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Registar como BOX
              </Button>
            </Link>
            <Link to="/auth/student-register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Registar como Aluno
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            <h3 className="text-xl font-bold mb-2">CagioTech</h3>
          </div>
          <p className="text-gray-400">© 2024 CagioTech. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
