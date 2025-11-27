import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const AutoRedirect = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading || !user) return;

    const redirect = async () => {
      try {
        console.log('🔄 Auto-redirect for user role:', user.role);

        // Redirect based on role
        switch (user.role) {
          case 'cagio_admin':
            navigate('/admin/dashboard', { replace: true });
            break;
          case 'box_admin':
            if (user.boxId) {
              navigate(`/${user.boxId}/dashboard`, { replace: true });
            } else {
              navigate('/box/dashboard', { replace: true });
            }
            break;
          case 'trainer':
            navigate('/trainer/dashboard', { replace: true });
            break;
          case 'student':
            // Check if approved
            if (user.isApproved === false) {
              navigate('/student/pending-approval', { replace: true });
            } else {
              navigate('/student/dashboard', { replace: true });
            }
            break;
          default:
            console.warn('Unknown role, staying on landing page');
        }
      } catch (error) {
        console.error('Error in auto-redirect:', error);
      }
    };

    redirect();
  }, [user, isLoading, navigate]);

  // Show landing page while checking auth
  return <>{children}</>;
};
