
import React from 'react';
import { ResponsiveStudentSidebar } from '@/components/student/ResponsiveStudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { ProgressStats } from '@/components/student/ProgressStats';
import { RecentActivity } from '@/components/student/RecentActivity';
import { Footer } from '@/components/Footer';

export const StudentDashboard: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <ResponsiveStudentSidebar />
      
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">
                Bem-vindo de volta! Aqui está seu resumo de hoje.
              </p>
            </div>

            <div className="space-y-6">
              <ProgressStats />
              <RecentActivity />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
