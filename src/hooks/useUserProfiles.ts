import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  type: 'box_owner' | 'staff_member' | 'personal_trainer' | 'student';
  companyId: string;
  companyName: string;
  roleId?: string;
  roleName?: string;
  athleteId?: string;
  staffId?: string;
}

interface UseUserProfilesReturn {
  profiles: UserProfile[];
  loading: boolean;
  selectedProfile: UserProfile | null;
  setSelectedProfile: (profile: UserProfile) => void;
  clearSelectedProfile: () => void;
}

const SELECTED_PROFILE_KEY = 'cagiotech_selected_profile';

export const useUserProfiles = (userId: string | null): UseUserProfilesReturn => {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfileState] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Load selected profile from sessionStorage
    const stored = sessionStorage.getItem(SELECTED_PROFILE_KEY);
    if (stored) {
      try {
        setSelectedProfileState(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing stored profile:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfiles = async () => {
      try {
        const foundProfiles: UserProfile[] = [];

        // Check if user is a box owner
        const { data: companies } = await supabase
          .from('companies')
          .select('id, name')
          .eq('owner_id', userId);

        if (companies && companies.length > 0) {
          companies.forEach(company => {
            foundProfiles.push({
              type: 'box_owner',
              companyId: company.id,
              companyName: company.name
            });
          });
        }

        // Check if user is a staff member or personal trainer
        const { data: staffRecords } = await supabase
          .from('staff')
          .select(`
            id,
            company_id,
            role_id,
            companies!inner(name),
            roles(name)
          `)
          .eq('user_id', userId);

        if (staffRecords && staffRecords.length > 0) {
          staffRecords.forEach((staff: any) => {
            const roleName = staff.roles?.name?.toLowerCase() || '';
            const isTrainer = roleName.includes('trainer') || roleName.includes('treinador');
            
            foundProfiles.push({
              type: isTrainer ? 'personal_trainer' : 'staff_member',
              companyId: staff.company_id,
              companyName: staff.companies.name,
              roleId: staff.role_id,
              roleName: staff.roles?.name,
              staffId: staff.id
            });
          });
        }

        // Check if user is a student/athlete
        const { data: user } = await supabase.auth.getUser();
        if (user?.user?.email) {
          const { data: athletes } = await supabase
            .from('athletes')
            .select(`
              id,
              company_id,
              companies!inner(name)
            `)
            .eq('email', user.user.email);

          if (athletes && athletes.length > 0) {
            athletes.forEach((athlete: any) => {
              foundProfiles.push({
                type: 'student',
                companyId: athlete.company_id,
                companyName: athlete.companies.name,
                athleteId: athlete.id
              });
            });
          }
        }

        setProfiles(foundProfiles);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [userId]);

  const setSelectedProfile = (profile: UserProfile) => {
    setSelectedProfileState(profile);
    sessionStorage.setItem(SELECTED_PROFILE_KEY, JSON.stringify(profile));
  };

  const clearSelectedProfile = () => {
    setSelectedProfileState(null);
    sessionStorage.removeItem(SELECTED_PROFILE_KEY);
  };

  return {
    profiles,
    loading,
    selectedProfile,
    setSelectedProfile,
    clearSelectedProfile
  };
};
