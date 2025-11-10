import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FirstLoginData {
  isFirstLogin: boolean;
  staffId: string | null;
  loading: boolean;
}

export const useFirstLoginCheck = (): FirstLoginData => {
  const { user } = useAuth();
  const [data, setData] = useState<FirstLoginData>({
    isFirstLogin: false,
    staffId: null,
    loading: true
  });

  useEffect(() => {
    const checkFirstLogin = async () => {
      if (!user?.id) {
        setData({ isFirstLogin: false, staffId: null, loading: false });
        return;
      }

      try {
        // Check if user is a staff member with first_login flag
        const { data: staffData, error } = await supabase
          .from('staff')
          .select('id, first_login')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking first login:', error);
          setData({ isFirstLogin: false, staffId: null, loading: false });
          return;
        }

        if (staffData && staffData.first_login === true) {
          setData({
            isFirstLogin: true,
            staffId: staffData.id,
            loading: false
          });
        } else {
          setData({
            isFirstLogin: false,
            staffId: staffData?.id || null,
            loading: false
          });
        }
      } catch (error) {
        console.error('Error in checkFirstLogin:', error);
        setData({ isFirstLogin: false, staffId: null, loading: false });
      }
    };

    checkFirstLogin();
  }, [user?.id]);

  return data;
};
