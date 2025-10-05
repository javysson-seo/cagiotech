import React from 'react';
import { useParams } from 'react-router-dom';
import { SubscriptionPlansList } from '@/components/subscriptions/SubscriptionPlansList';
import { Loader2 } from 'lucide-react';

export const PlansManagementSettings: React.FC = () => {
  const { companyId } = useParams<{ companyId: string }>();

  if (!companyId) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Company ID not found</p>
      </div>
    );
  }

  return <SubscriptionPlansList companyId={companyId} />;
};
