
import React, { useState } from 'react';
import { StudentSidebar } from '@/components/student/StudentSidebar';
import { StudentHeader } from '@/components/student/StudentHeader';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { CurrentPlan } from '@/components/payments/CurrentPlan';
import { PaymentMethods } from '@/components/payments/PaymentMethods';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Footer } from '@/components/Footer';

export const PaymentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plan');

  return (
    <div className="flex h-screen bg-background">
      <StudentSidebar />
      
      <div className="flex-1 flex flex-col">
        <StudentHeader />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-foreground">Pagamentos</h1>
              <p className="text-muted-foreground">
                Gerencie seu plano e histórico de pagamentos
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="plan">Meu Plano</TabsTrigger>
                <TabsTrigger value="history">Histórico</TabsTrigger>
                <TabsTrigger value="methods">Métodos de Pagamento</TabsTrigger>
              </TabsList>

              <TabsContent value="plan">
                <CurrentPlan />
              </TabsContent>

              <TabsContent value="history">
                <PaymentHistory />
              </TabsContent>

              <TabsContent value="methods">
                <PaymentMethods />
              </TabsContent>
            </Tabs>
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};
