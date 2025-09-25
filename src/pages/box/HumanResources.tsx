import React from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { HRDashboard } from '@/components/hr/HRDashboard';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';

const HumanResourcesContent: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <HRDashboard />
          </div>
        </main>
      </div>
    </div>
  );
};

export const HumanResources: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <HumanResourcesContent />
    </AreaThemeProvider>
  );
};