import React from 'react';
import { Navigate } from 'react-router-dom';
import { useMobileDetection } from '@/hooks/useMobileDetection';
import { useAuth } from '@/contexts/AuthContext';

interface MobileOnlyRouteProps {
  children: React.ReactNode;
  allowedRoles: ('student' | 'trainer')[];
}

export const MobileOnlyRoute: React.FC<MobileOnlyRouteProps> = ({ children, allowedRoles }) => {
  const { isMobileApp } = useMobileDetection();
  const { user } = useAuth();

  // No mobile app, apenas permitir student e trainer
  if (isMobileApp && user?.role) {
    const restrictedRoles = ['box_owner', 'box_admin', 'cagio_admin'];
    
    if (restrictedRoles.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};
