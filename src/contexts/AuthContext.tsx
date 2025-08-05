
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'cagio_admin' | 'box_admin' | 'trainer' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  boxId?: string;
  boxName?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (userData: any, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
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

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock user based on role
    const mockUser: User = {
      id: `${role}_${Date.now()}`,
      name: role === 'cagio_admin' ? 'Cagio Administrator' : 
            role === 'box_admin' ? 'BOX Owner' :
            role === 'trainer' ? 'Personal Trainer' : 'Student User',
      email,
      role,
      boxId: role !== 'cagio_admin' ? 'box_123' : undefined,
      boxName: role !== 'cagio_admin' ? 'CrossFit Porto' : undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (userData: any, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: `${role}_${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role,
      boxId: role !== 'cagio_admin' ? userData.boxId || 'box_new' : undefined,
      boxName: role !== 'cagio_admin' ? userData.boxName : undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`
    };

    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
