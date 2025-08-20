
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'cagio_admin' | 'box_admin' | 'trainer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  boxId?: string;
  boxName?: string;
  avatar?: string;
  isApproved?: boolean;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (userData: any, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('Auth event:', event, session?.user?.email);
      
      if (session?.user) {
        setIsLoading(true);
        await fetchUserProfile(session.user);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Fetching profile for user:', supabaseUser.id);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          companies (
            id,
            name
          )
        `)
        .eq('id', supabaseUser.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
        return;
      }

      if (!profile) {
        console.error('No profile found for user');
        setIsLoading(false);
        return;
      }

      // Handle the company relationship correctly
      const companies = profile.companies;
      const company = Array.isArray(companies) ? companies[0] : companies;

      const authUser: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role as UserRole,
        boxId: company?.id,
        boxName: company?.name,
        isApproved: profile.is_approved,
        permissions: getDefaultPermissions(profile.role as UserRole),
        avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`
      };

      console.log('Setting user:', authUser);
      setUser(authUser);
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        await fetchUserProfile(data.user);
        toast.success('Login realizado com sucesso!');
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no login';
      setError(errorMessage);
      toast.error(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (userData: any, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: role,
            company_name: userData.companyName || userData.boxName,
            phone: userData.phone
          },
          emailRedirectTo: undefined // Remove email verification
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // Since we disabled email confirmation, the user should be automatically signed in
        toast.success('Conta criada com sucesso!');
        
        // Redirect based on role
        if (role === 'box_admin') {
          window.location.href = '/box';
        }
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no registro';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setError(null);
      toast.info('Logout realizado com sucesso');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const getDefaultPermissions = (role: UserRole): string[] => {
    switch (role) {
      case 'cagio_admin':
        return ['all'];
      case 'box_admin':
        return ['manage_athletes', 'manage_trainers', 'manage_classes', 'view_reports'];
      case 'trainer':
        return ['view_schedule', 'manage_classes', 'view_athletes'];
      case 'student':
        return ['book_classes', 'view_progress', 'manage_profile'];
      default:
        return [];
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      error, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
