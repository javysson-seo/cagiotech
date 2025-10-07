
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Building2, 
  Users, 
  BarChart3,
  Settings, 
  HelpCircle,
  LogOut,
  CreditCard,
  MessageSquare,
  Shield,
  Database
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Empresas', href: '/admin/companies', icon: Building2 },
    { name: 'Todos os Atletas', href: '/admin/athletes', icon: Users },
    { name: 'Gestão de BOX', href: '/admin/boxes', icon: Building2 },
    { name: 'Utilizadores', href: '/admin/users', icon: Users },
    { name: 'Relatórios', href: '/admin/reports', icon: BarChart3 },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-[#1a1a2e] text-white shadow-xl">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/f11d946f-1e84-4046-8622-ffeb54bba33e.png" 
            alt="CagioTech Logo" 
            className="h-10 w-auto"
          />
          <Badge className="bg-[#16ff00] text-[#1a1a2e] text-xs font-bold">ADMIN</Badge>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#16ff00] to-[#0ea5e9] flex items-center justify-center ring-2 ring-[#16ff00]/20">
            <span className="text-[#1a1a2e] font-bold">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-sm text-gray-400">
              Administrador CagioTech
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all',
                isActive
                  ? 'bg-[#16ff00] text-[#1a1a2e] shadow-lg shadow-[#16ff00]/20'
                  : 'text-gray-300 hover:text-white hover:bg-white/5'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-3 border-t border-white/10">
        <div className="bg-[#16ff00]/10 p-3 rounded-lg mb-3 border border-[#16ff00]/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-[#16ff00] rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-[#16ff00]">Sistema Online</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Todos os serviços funcionais
          </p>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/5"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};
