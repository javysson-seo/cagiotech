
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

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

// Mock users database
const mockUsers = [
  {
    id: 'admin_1',
    name: 'Administrador Cagio',
    email: 'admin@cagio.com',
    password: 'admin123',
    role: 'cagio_admin' as UserRole,
    isApproved: true,
    permissions: ['all']
  },
  {
    id: 'box_admin_1', 
    name: 'João Silva',
    email: 'joao@crossfitbenfica.com',
    password: 'box123',
    role: 'box_admin' as UserRole,
    boxId: 'box_1',
    boxName: 'CrossFit Benfica',
    isApproved: true,
    permissions: ['manage_athletes', 'manage_trainers', 'manage_classes']
  },
  {
    id: 'trainer_1',
    name: 'Carlos Trainer',
    email: 'carlos@crossfitbenfica.com', 
    password: 'trainer123',
    role: 'trainer' as UserRole,
    boxId: 'box_1',
    boxName: 'CrossFit Benfica',
    isApproved: true,
    permissions: ['view_schedule', 'manage_classes']
  },
  {
    id: 'student_1',
    name: 'Ana Atleta',
    email: 'ana@email.com',
    password: 'student123',
    role: 'student' as UserRole,
    boxId: 'box_1',
    boxName: 'CrossFit Benfica',
    isApproved: true,
    permissions: ['book_classes', 'view_progress']
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (err) {
        console.error('Error parsing stored user data:', err);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock database
      const foundUser = mockUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.password === password &&
        (!role || u.role === role)
      );

      if (!foundUser) {
        throw new Error('Email, password ou função incorretos');
      }

      if (!foundUser.isApproved) {
        throw new Error('Conta pendente de aprovação');
      }

      const authUser: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
        boxId: foundUser.boxId,
        boxName: foundUser.boxName,
        isApproved: foundUser.isApproved,
        permissions: foundUser.permissions,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${foundUser.email}`
      };

      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
      
      toast.success(`Bem-vindo, ${authUser.name}!`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro no login';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if email already exists
      const existingUser = mockUsers.find(u => 
        u.email.toLowerCase() === userData.email.toLowerCase()
      );

      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      const newUser: User = {
        id: `${role}_${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role,
        boxId: role !== 'cagio_admin' ? userData.boxId || 'pending' : undefined,
        boxName: role !== 'cagio_admin' ? userData.boxName || userData.companyName : undefined,
        isApproved: role === 'student' || role === 'box_admin', // Auto-approve students and box admins
        permissions: getDefaultPermissions(role),
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
      };

      // Auto-login for students and box admins
      if (role === 'student' || role === 'box_admin') {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        toast.success('Conta criada com sucesso!');
      } else {
        toast.success('Conta criada! Aguarde aprovação do administrador.');
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

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
    toast.info('Logout realizado com sucesso');
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
