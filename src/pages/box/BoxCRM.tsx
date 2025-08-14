
import React from 'react';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { BoxHeader } from '@/components/box/BoxHeader';
import { Footer } from '@/components/Footer';
import { AreaThemeProvider } from '@/contexts/AreaThemeContext';

const BoxCRMContent: React.FC = () => {
  return (
    <div className="flex h-screen bg-background">
      <BoxSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <BoxHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">CRM</h1>
              <p className="text-muted-foreground">
                Gestão de prospects e leads
              </p>
            </div>
            
            {/* CRM Content will be implemented here */}
            <div className="text-center py-12">
              <p className="text-muted-foreground">CRM em desenvolvimento...</p>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export const BoxCRM: React.FC = () => {
  return (
    <AreaThemeProvider area="box">
      <BoxCRMContent />
    </AreaThemeProvider>
  );
};
