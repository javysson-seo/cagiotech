import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface StaffRole {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
}

/**
 * Hook to get the current staff member's role and permissions
 * Only works for users with staff_member role
 */
export const useStaffRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<StaffRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaffRole = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Get staff info
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('role_id, company_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (staffError || !staffData?.role_id) {
          setLoading(false);
          return;
        }

        // Get role with permissions
        const { data: roleData, error: roleError } = await (supabase as any)
          .from('roles')
          .select(`
            id,
            name,
            description,
            role_permissions (
              permission_key
            )
          `)
          .eq('id', staffData.role_id)
          .single();

        if (roleError || !roleData) {
          setLoading(false);
          return;
        }

        const staffRole: StaffRole = {
          id: roleData.id,
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.role_permissions?.map((p: any) => p.permission_key) || []
        };

        setRole(staffRole);
      } catch (error) {
        console.error('Error fetching staff role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffRole();
  }, [user?.id]);

  return {
    role,
    loading,
    isStaffMember: role !== null,
    hasPermission: (permission: string) => {
      if (!role) return false;
      return role.permissions.includes('all') || role.permissions.includes(permission);
    }
  };
};
