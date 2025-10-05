import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { BoxHeader } from '@/components/box/BoxHeader';
import { BoxSidebar } from '@/components/box/BoxSidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SubscriptionPlansList } from '@/components/subscriptions/SubscriptionPlansList';
import { PaymentMethodsSettings } from '@/components/subscriptions/PaymentMethodsSettings';
import { ActiveSubscriptions } from '@/components/subscriptions/ActiveSubscriptions';
import { useCompany } from '@/contexts/CompanyContext';

export default function SubscriptionsManagement() {
  const { companyId } = useParams();
  const { currentCompany } = useCompany();
  const [activeTab, setActiveTab] = useState('plans');

  return (
    <div className="min-h-screen flex flex-col">
      <BoxHeader />
      <div className="flex-1 flex">
        <BoxSidebar />
        <main className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="plans">Planos de Assinatura</TabsTrigger>
                <TabsTrigger value="subscriptions">Assinaturas Ativas</TabsTrigger>
                <TabsTrigger value="payment-methods">Métodos de Pagamento</TabsTrigger>
              </TabsList>

              <TabsContent value="plans">
                {currentCompany && (
                  <SubscriptionPlansList companyId={currentCompany.id} />
                )}
              </TabsContent>

              <TabsContent value="subscriptions">
                {currentCompany && (
                  <ActiveSubscriptions companyId={currentCompany.id} />
                )}
              </TabsContent>

              <TabsContent value="payment-methods">
                {currentCompany && (
                  <PaymentMethodsSettings companyId={currentCompany.id} />
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
