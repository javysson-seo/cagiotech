
import React, { useEffect, useState } from 'react';
import { ResponsiveStudentSidebar } from '@/components/student/ResponsiveStudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { QuickActions } from '@/components/student/QuickActions';
import { StatsOverview } from '@/components/student/StatsOverview';
import { QuickCheckIn } from '@/components/student/QuickCheckIn';
import { UpcomingClasses } from '@/components/student/UpcomingClasses';
import { ProgressStats } from '@/components/student/ProgressStats';
import { BadgesDisplay } from '@/components/student/BadgesDisplay';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useGamification } from '@/hooks/useGamification';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, Award } from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [athleteId, setAthleteId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAthleteId = async () => {
      if (!user?.email) return;

      const { data } = await supabase
        .from('athletes')
        .select('id')
        .eq('email', user.email)
        .maybeSingle();

      if (data) {
        setAthleteId(data.id);
      }
    };

    fetchAthleteId();
  }, [user?.email]);

  const { badges, isLoading } = useGamification(athleteId || undefined);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Bom dia' : currentHour < 18 ? 'Boa tarde' : 'Boa noite';
  const userName = user?.email?.split('@')[0] || 'Atleta';

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
                      <BadgesDisplay badges={badges || []} isLoading={isLoading} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
