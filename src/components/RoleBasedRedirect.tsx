import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RoleBasedRedirect = () => {
  const { user } = useAuth();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      // Extract the route suffix from the current path (e.g., /uuid/subscription -> /subscription)
      const pathParts = location.pathname.split('/').filter(Boolean);
      let targetRoute = '/dashboard';
      
      // If there's a second part after the UUID, use that as the target
      if (pathParts.length > 1) {
        const routeSuffix = pathParts.slice(1).join('/');
        if (routeSuffix && routeSuffix !== 'dashboard') {
          targetRoute = `/${routeSuffix}`;
        }
      }

      getRoleRedirectPath(user.role, user.id, targetRoute).then((path) => {
        setRedirectPath(path);
      });
    }
  }, [user, location.pathname]);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!redirectPath) {
    return null;
  }

  return <Navigate to={redirectPath} replace />;
};

const getRoleRedirectPath = async (role: string, userId: string, targetRoute: string): Promise<string> => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  // Helper function to get user email
  const getUserEmail = async (uid: string): Promise<string> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email || '';
  };
  
  switch (role) {
    case 'cagio_admin':
      return '/admin/dashboard';
    case 'box_admin':
    case 'box_owner':
    case 'personal_trainer':
    case 'staff_member':
      // Redirect to clean URL based on the route they were trying to access
      return targetRoute;
    case 'trainer':
      return '/trainer/dashboard';
    case 'student': {
      // Check if user has an athlete record
      const { data: athleteData } = await supabase
        .from('athletes')
        .select('id, company_id, is_approved')
        .or(`user_id.eq.${userId},email.eq.${await getUserEmail(userId)}`)
        .maybeSingle();

      if (athleteData) {
        if (!athleteData.is_approved) {
          // Athlete not yet approved
          return '/student/pending-approval';
        }
        return '/student/dashboard';
      }
      
      // No athlete record found
      return '/student/dashboard';
    }
    default:
      return targetRoute;
  }
};