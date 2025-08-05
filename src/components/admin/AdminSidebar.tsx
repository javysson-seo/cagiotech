
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
import { useAuth } from '@/contexts/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
    { name: 'Gestão de BOX', href: '/admin/boxes', icon: Building2 },
    { name: 'Utilizadores', href: '/admin/users', icon: Users },
    { name: 'Relatórios', href: '/admin/reports', icon: BarChart3 },
    { name: 'Financeiro', href: '/admin/financial', icon: CreditCard },
    { name: 'Comunicação', href: '/admin/communication', icon: MessageSquare },
    { name: 'Sistema', href: '/admin/system', icon: Database },
    { name: 'Segurança', href: '/admin/security', icon: Shield },
    { name: 'Configurações', href: '/admin/settings', icon: Settings },
    { name: 'Suporte', href: '/admin/support', icon: HelpCircle },
  ];

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-foreground">CAGIO</span>
          <Badge className="bg-purple-100 text-purple-800 text-xs">ADMIN</Badge>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">
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
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-purple-600 text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* System Status */}
      <div className="p-3 border-t border-border">
        <div className="bg-green-50 p-3 rounded-lg mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800">Sistema Online</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Todos os serviços funcionais
          </p>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};
