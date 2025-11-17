import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RoleBasedRedirect = () => {
  const { user } = useAuth();
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getRoleRedirectPath(user.role, user.id).then((path) => {
        setRedirectPath(path);
        if (window.location.pathname === '/auth/login' || window.location.pathname === '/') {
          window.location.href = path;
        }
      });
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!redirectPath) {
    return null;
  }

  return <Navigate to={redirectPath} replace />;
};

const getRoleRedirectPath = async (role: string, userId: string): Promise<string> => {
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
    case 'box_owner': {
      // Check if user is a staff member first
      const { data: staffData } = await supabase
        .from('staff')
        .select('company_id, role_id')
        .eq('user_id', userId)
        .maybeSingle();

      if (staffData?.company_id) {
        // Staff member - redirect to company dashboard
        return `/${staffData.company_id}`;
      }

      // Box owner - buscar a empresa do usuário
      const { data: company } = await supabase
        .from('companies')
        .select('id')
        .eq('owner_id', userId)
        .single();
      
      return company ? `/${company.id}` : '/box/dashboard';
    }
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
      return '/auth/login';
  }
};