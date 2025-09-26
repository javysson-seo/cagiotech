import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RoleBasedRedirect = () => {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const redirectPath = getRoleRedirectPath(user.role);
      if (window.location.pathname === '/auth/login' || window.location.pathname === '/') {
        window.location.href = redirectPath;
      }
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  const redirectPath = getRoleRedirectPath(user.role);
  return <Navigate to={redirectPath} replace />;
};

const getRoleRedirectPath = (role: string): string => {
  switch (role) {
    case 'cagio_admin':
      return '/admin/dashboard';
    case 'box_admin':
      return '/box/dashboard';
    case 'trainer':
      return '/trainer/dashboard';
    case 'student':
      return '/student/dashboard';
    default:
      return '/auth/login';
  }
};