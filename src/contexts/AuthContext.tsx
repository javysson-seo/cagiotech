
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'cagio_admin' | 'box_admin' | 'trainer' | 'student';

export interface UserProfile {
  type: string;
  role: UserRole;
  companyId?: string;
  companyName?: string;
  companySlug?: string;
}

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
  availableProfiles?: UserProfile[];
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string, role?: UserRole) => Promise<void>;
  register: (userData: any, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  switchProfile: (profile: UserProfile) => void;
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

// Utility function to hash email for avatar generation (privacy improvement)
const hashEmail = (email: string): string => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString();
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

      // Gate debug logs behind development mode
      if (import.meta.env.DEV) {
        console.log('Auth event:', event, session?.user ? 'User authenticated' : 'No user');
      }
      
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
          console.error('Error getting session:', error.message);
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
        console.error('Error initializing auth:', error instanceof Error ? error.message : 'Unknown error');
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

  // Separate effect for profile update listener
  useEffect(() => {
    const handleProfileUpdate = () => {
      if (session?.user) {
        fetchUserProfile(session.user);
      }
    };

    window.addEventListener('profile-updated', handleProfileUpdate);

    return () => {
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, [session]);

  const fetchUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      if (import.meta.env.DEV) {
        console.log('Fetching profile for user ID:', supabaseUser.id.substring(0, 8) + '...');
      }
      
      // Fetch profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar_url, is_approved')
        .eq('id', supabaseUser.id)
        .single();
      
      // Fetch user roles from user_roles table (proper authorization source)
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          role,
          company_id,
          companies (
            id,
            name,
            slug
          )
        `)
        .eq('user_id', supabaseUser.id);

      if (error || rolesError) {
        console.error('Error fetching profile or roles:', error?.message || rolesError?.message);
        setIsLoading(false);
        return;
      }

      if (!profile) {
        console.error('No profile found for user');
        setIsLoading(false);
        return;
      }

      // Get primary role from user_roles table (secure authorization source)
      if (!userRoles || userRoles.length === 0) {
        console.error('No roles found for user - user may need approval');
        setIsLoading(false);
        return;
      }

      // Build available profiles list
      const availableProfiles: UserProfile[] = userRoles.map((r: any) => ({
        type: r.role,
        role: mapRole(r.role),
        companyId: r.company_id,
        companyName: r.companies?.name,
        companySlug: r.companies?.slug
      }));

      // Check if user has selected a profile preference
      const savedProfile = localStorage.getItem(`profile_${supabaseUser.id}`);
      let primaryRole: any;
      
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        primaryRole = userRoles.find((r: any) => 
          r.role === parsed.type && r.company_id === parsed.companyId
        );
      }
      
      if (!primaryRole) {
        // Determine primary role using priority and prefer company-linked roles
        const rolePriority = ['cagio_admin','box_owner','personal_trainer','staff_member','student'];
        primaryRole = (userRoles as any[])
          .sort((a: any, b: any) => rolePriority.indexOf(a.role) - rolePriority.indexOf(b.role))[0];

        // If student was picked but user has company-linked roles, prefer them
        if (primaryRole?.role === 'student') {
          const trainer = (userRoles as any[]).find((r: any) => r.role === 'personal_trainer' && r.company_id);
          const staff = (userRoles as any[]).find((r: any) => r.role === 'staff_member' && r.company_id);
          const owner = (userRoles as any[]).find((r: any) => r.role === 'box_owner' && r.company_id);
          primaryRole = trainer || staff || owner || primaryRole;
        }
      }

      const company = primaryRole?.companies;

      // Map database role to UserRole type
      const mapRole = (dbRole: string): UserRole => {
        const roleMap: Record<string, UserRole> = {
          'cagio_admin': 'cagio_admin',
          'box_owner': 'box_admin',
          'box_admin': 'box_admin',
          'personal_trainer': 'trainer',
          'trainer': 'trainer',
          'student': 'student',
          'staff_member': 'box_admin', // Map staff_member to box_admin role
        };
        return roleMap[dbRole] || 'student';
      };

      // Determine permissions based on role
      let customPermissions: string[] | null = null;
      
      // Box owners (company owners) always have full access
      if (primaryRole.role === 'box_owner') {
        customPermissions = ['all'];
      } 
      // Staff members get custom permissions from their role
      else if (primaryRole.role === 'staff_member') {
        // Get staff info to find role_id
        const { data: staffData } = await supabase
          .from('staff')
          .select('role_id')
          .eq('user_id', supabaseUser.id)
          .eq('company_id', company?.id)
          .single();

        if (staffData?.role_id) {
          // Get permissions from the role
          const { data: rolePermissions } = await supabase
            .from('role_permissions')
            .select('permission_key')
            .eq('role_id', staffData.role_id);

          if (rolePermissions && rolePermissions.length > 0) {
            customPermissions = rolePermissions.map(p => p.permission_key);
          }
        }
      }

      const authUser: User = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: mapRole(primaryRole.role),
        boxId: company?.id,
        boxName: company?.name,
        isApproved: profile.is_approved,
        permissions: customPermissions || getDefaultPermissions(mapRole(primaryRole.role)),
        avatar: profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${hashEmail(profile.email)}`,
        availableProfiles
      };

      if (import.meta.env.DEV) {
        console.log('User profile loaded successfully');
      }
      setUser(authUser);
    } catch (err) {
      console.error('Error in fetchUserProfile:', err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (import.meta.env.DEV) {
        console.log('Attempting login for user');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        throw new Error(getAuthErrorMessage(error));
      }

      if (data.user) {
        if (import.meta.env.DEV) {
          console.log('Login successful');
        }
        toast.success('Login realizado com sucesso!');
        // Don't manually fetch profile here - let onAuthStateChange handle it
      }
      
    } catch (err) {
      console.error('Login catch error:', err instanceof Error ? err.message : 'Unknown error');
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
      if (import.meta.env.DEV) {
        console.log('Attempting registration');
      }
      
      // Register without email confirmation
      const { data, error } = await supabase.auth.signUp({
        email: userData.email.trim(),
        password: userData.password,
        options: {
          data: {
            name: userData.companyName,
            role: role,
            company_name: userData.companyName
          },
          emailRedirectTo: undefined // Remove email confirmation
        }
      });

      if (error) {
        console.error('Registration error:', error.message);
        throw new Error(getAuthErrorMessage(error));
      }

      if (data.user) {
        if (import.meta.env.DEV) {
          console.log('Registration successful, signing in user');
        }
        
        // Since we're not requiring email confirmation, we can sign in immediately
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: userData.email.trim(),
          password: userData.password,
        });

        if (signInError) {
          console.error('Auto sign-in error:', signInError.message);
          throw new Error(getAuthErrorMessage(signInError));
        }

        toast.success('Conta criada com sucesso! Redirecionando...');
        
        // Redirect to company dashboard after successful registration
        // Get the company slug for redirect
        const { data: companyData } = await supabase
          .from('companies')
          .select('slug')
          .eq('owner_id', data.user.id)
          .single();
          
        const redirectUrl = companyData?.slug ? `/${companyData.slug}` : '/auth/login';
        setTimeout(() => {
          window.location.href = redirectUrl;
        }, 1000);
      }

    } catch (err) {
      console.error('Registration catch error:', err instanceof Error ? err.message : 'Unknown error');
      const errorMessage = err instanceof Error ? err.message : 'Erro no registro';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const switchProfile = (profile: UserProfile) => {
    if (session?.user) {
      localStorage.setItem(`profile_${session.user.id}`, JSON.stringify(profile));
      fetchUserProfile(session.user);
      toast.success('Perfil alterado com sucesso!');
      
      // Redirect based on profile
      setTimeout(() => {
        switch (profile.role) {
          case 'cagio_admin':
            window.location.href = '/admin/dashboard';
            break;
          case 'box_admin':
            window.location.href = `/${profile.companySlug || profile.companyId}/dashboard`;
            break;
          case 'trainer':
            window.location.href = '/trainer/dashboard';
            break;
          case 'student':
            window.location.href = '/student/dashboard';
            break;
        }
      }, 500);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Clear profile preference
      if (session?.user) {
        localStorage.removeItem(`profile_${session.user.id}`);
      }
      
      // Clear state immediately for better UX
      setUser(null);
      setSession(null);
      setError(null);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('Logout error:', error.message);
        toast.error('Erro ao fazer logout');
      } else {
        toast.info('Logout realizado com sucesso');
      }
      
      // Force a clean redirect regardless of logout result
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 500);
      
    } catch (error) {
      console.error('Error logging out:', error instanceof Error ? error.message : 'Unknown error');
      toast.error('Erro ao fazer logout');
      // Still redirect even if logout fails
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultPermissions = (role: UserRole): string[] => {
    switch (role) {
      case 'cagio_admin':
        return ['all'];
      case 'box_admin':
        // Box admins (company owners) have full access
        return ['all'];
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
        return 'Email ou senha incorretos';
      case 'Email not confirmed':
        return 'Por favor, confirme seu email antes de fazer login';
      case 'User already registered':
        return 'Este email já está registrado';
      case 'Password should be at least 6 characters':
        return 'A senha deve ter pelo menos 6 caracteres';
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
      switchProfile,
      isLoading, 
      error, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
