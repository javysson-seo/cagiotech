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
    case 'student':
      return '/student/dashboard';
    default:
      return '/auth/login';
  }
};