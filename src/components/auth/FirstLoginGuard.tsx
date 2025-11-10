import React from 'react';
import { useFirstLoginCheck } from '@/hooks/useFirstLoginCheck';
import { ForcePasswordChangeModal } from './ForcePasswordChangeModal';
import { Loading } from '@/components/ui/loading';

interface FirstLoginGuardProps {
  children: React.ReactNode;
}

export const FirstLoginGuard: React.FC<FirstLoginGuardProps> = ({ children }) => {
  const { isFirstLogin, staffId, loading } = useFirstLoginCheck();
  const [passwordChanged, setPasswordChanged] = React.useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Verificando acesso..." />
      </div>
    );
  }

  // If it's first login and password hasn't been changed, show the modal
  if (isFirstLogin && !passwordChanged && staffId) {
    return (
      <>
        {/* Render children in background but blur it */}
        <div className="blur-sm pointer-events-none">
          {children}
        </div>
        
        {/* Show force password change modal */}
        <ForcePasswordChangeModal
          isOpen={true}
          staffId={staffId}
          onPasswordChanged={() => {
            setPasswordChanged(true);
            // Reload the page to refresh user data
            window.location.reload();
          }}
        />
      </>
    );
  }

  // Normal flow - render children
  return <>{children}</>;
};
