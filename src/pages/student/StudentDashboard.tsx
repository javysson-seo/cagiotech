import React from 'react';
import { ResponsiveStudentSidebar } from '@/components/student/ResponsiveStudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { QuickActions } from '@/components/student/QuickActions';
import { StatsOverview } from '@/components/student/StatsOverview';
import { QuickCheckIn } from '@/components/student/QuickCheckIn';
import { UpcomingClasses } from '@/components/student/UpcomingClasses';
import { ProgressStats } from '@/components/student/ProgressStats';
import { BadgesDisplay } from '@/components/student/BadgesDisplay';
import { NutritionOverview } from '@/components/student/NutritionOverview';
import { Footer } from '@/components/Footer';
import { useCurrentAthlete } from '@/hooks/useCurrentAthlete';
import { useGamification } from '@/hooks/useGamification';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Award, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export const StudentDashboard: React.FC = () => {
  const { athlete, loading } = useCurrentAthlete();
  const { badges, isLoading: badgesLoading } = useGamification(athlete?.id);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';
  const userName = athlete?.name?.split(' ')[0] || 'Atleta';

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-cagio-green-light/20 via-background to-background">
        <ResponsiveStudentSidebar />
        <div className="flex-1 flex flex-col">
          <StudentHeader />
          <main className="flex-1 p-3 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-4">
              <Skeleton className="h-20 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!athlete) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-cagio-green-light/20 via-background to-background">
        <ResponsiveStudentSidebar />
        <div className="flex-1 flex flex-col">
          <StudentHeader />
          <main className="flex-1 p-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Não foi possível carregar seus dados. Por favor, entre em contato com a academia.
              </AlertDescription>
            </Alert>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-cagio-green-light/20 via-background to-background">
      <ResponsiveStudentSidebar />
      
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 p-3 sm:p-6">
          <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
            {/* Welcome Section */}
            <div className="animate-fade-in">
              <h1 className="text-2xl sm:text-3xl font-bold text-cagio-green mb-1">
                {greeting}, {userName}! 👋
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Continue seu treino e alcance seus objetivos
              </p>
            </div>

            {/* Quick Actions */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <QuickActions />
            </div>

            {/* Stats Overview */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <StatsOverview />
            </div>

            {/* Check-in Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <QuickCheckIn />
            </div>

            {/* Upcoming Classes & Progress Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <UpcomingClasses />
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
                  <Card className="border-t-4 border-t-blue-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg sm:text-xl text-blue-500 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Progresso Semanal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ProgressStats />
                    </CardContent>
                  </Card>
                </div>

                <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
                  <Card className="border-t-4 border-t-purple-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg sm:text-xl text-purple-500 flex items-center">
                        <Award className="h-5 w-5 mr-2" />
                        Conquistas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <BadgesDisplay badges={badges || []} isLoading={badgesLoading} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Nutrition Section */}
            <div className="animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <NutritionOverview />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
