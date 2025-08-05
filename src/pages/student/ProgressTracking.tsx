
import React, { useState } from 'react';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { ProgressStats } from '@/components/student/ProgressStats';
import { ProgressCharts } from '@/components/progress/ProgressCharts';
import { GoalsManagement } from '@/components/progress/GoalsManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const ProgressTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stats');

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Meu Progresso</h1>
              <p className="text-muted-foreground">
                Acompanhe sua evolução e conquiste seus objetivos
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                <TabsTrigger value="charts">Gráficos</TabsTrigger>
                <TabsTrigger value="goals">Objetivos</TabsTrigger>
              </TabsList>

              <TabsContent value="stats">
                <ProgressStats />
              </TabsContent>

              <TabsContent value="charts">
                <ProgressCharts />
              </TabsContent>

              <TabsContent value="goals">
                <GoalsManagement />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};
