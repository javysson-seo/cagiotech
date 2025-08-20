
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

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
  session: Session | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (userData: any, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('Auth event:', event, session?.user?.email);
      
      setSession(session);
      
      if (session?.user) {
        // Defer profile fetching to prevent deadlocks
        setTimeout(() => {
          if (isMounted) {
            fetchUserProfile(session.user);
          }
        }, 0);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          setIsLoading(false);
          return;
        }
        
        if (session?.user && isMounted) {
          setSession(session);
          await fetchUserProfile(session.user);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

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
        // Create profile if it doesn't exist
        if (error.code === 'PGRST116') {
          console.log('Profile not found, creating one...');
          const newProfile = {
            id: supabaseUser.id,
            name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
            email: supabaseUser.email!,
            role: 'student' as UserRole,
            is_approved: true
          };

          const { data: createdProfile, error: createError } = await supabase
            .from('profiles')
            .insert(newProfile)
            .select()
            .single();

          if (createError) {
            console.error('Error creating profile:', createError);
            setIsLoading(false);
            return;
          }

          const authUser: User = {
            id: createdProfile.id,
            name: createdProfile.name,
            email: createdProfile.email,
            role: createdProfile.role as UserRole,
            isApproved: createdProfile.is_approved,
            permissions: getDefaultPermissions(createdProfile.role as UserRole),
            avatar: createdProfile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${createdProfile.email}`
          };

          setUser(authUser);
          setIsLoading(false);
          return;
        }
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
      // Clean up any existing sessions
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors during cleanup
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(getAuthErrorMessage(error));
      }

      if (data.user) {
        toast.success('Login realizado com sucesso!');
        // Don't manually fetch profile here - let onAuthStateChange handle it
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
        email: userData.email.trim(),
        password: userData.password,
        options: {
          data: {
            name: userData.name,
            role: role,
            company_name: userData.companyName || userData.boxName,
            phone: userData.phone
          },
          emailRedirectTo: `${window.location.origin}/auth/login`
        }
      });

      if (error) {
        throw new Error(getAuthErrorMessage(error));
      }

      if (data.user) {
        toast.success('Conta criada com sucesso!');
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
      setIsLoading(true);
      await supabase.auth.signOut({ scope: 'global' });
      setUser(null);
      setSession(null);
      setError(null);
      toast.info('Logout realizado com sucesso');
      // Force a clean redirect
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Erro ao fazer logout');
    } finally {
      setIsLoading(false);
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

  const getAuthErrorMessage = (error: any): string => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email ou password incorretos';
      case 'Email not confirmed':
        return 'Por favor, confirme seu email antes de fazer login';
      case 'User already registered':
        return 'Este email já está registrado';
      case 'Password should be at least 6 characters':
        return 'A password deve ter pelo menos 6 caracteres';
      case 'Unable to validate email address: invalid format':
        return 'Formato de email inválido';
      default:
        return error.message || 'Erro de autenticação';
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
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
