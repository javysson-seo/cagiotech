
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
  Dumbbell,
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
    <div className="flex flex-col w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-blue-900 text-white shadow-xl">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-purple-700">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-8 w-8 text-blue-300" />
          <span className="text-xl font-bold">CAGIO</span>
          <Badge className="bg-blue-500 text-white text-xs">ADMIN</Badge>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-purple-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ring-2 ring-white/20">
            <span className="text-white font-medium">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-white">{user?.name}</p>
            <p className="text-sm text-purple-200">
              Administrador Cagio
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
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : 'text-purple-100 hover:text-white hover:bg-white/10'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-3 border-t border-purple-700">
        <div className="bg-green-500/20 p-3 rounded-lg mb-3 border border-green-400/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-300">Sistema Online</span>
          </div>
          <p className="text-xs text-green-200 mt-1">
            Todos os serviços funcionais
          </p>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-purple-100 hover:text-white hover:bg-white/10"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};
