
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  UserCheck,
  Calendar,
  BarChart3,
  Settings, 
  LogOut,
  UserCog,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';

export const BoxSidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/box/dashboard', icon: Home },
    { name: 'CRM', href: '/box/crm', icon: Target },
    { name: 'Atletas', href: '/box/athletes', icon: Users },
    { name: 'Personal Trainers', href: '/box/trainers', icon: UserCog },
    { name: 'Aulas', href: '/box/classes', icon: Calendar },
    { name: 'Relatórios', href: '/box/reports', icon: BarChart3 },
    { name: 'Configurações', href: '/box/settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <img src="/lovable-uploads/8dbf4355-937c-46a1-b5ed-612c0fa8be8e.png" alt="CagioTech" className="h-8 w-auto" />
          <Badge className="bg-cagio-green text-white text-xs hover:bg-cagio-green">BOX</Badge>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cagio-green flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">
              {user?.boxName}
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
                  ? 'bg-cagio-green text-white'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* BOX Status */}
      <div className="p-3 border-t border-border">
        <div className="bg-cagio-green-light p-3 rounded-lg mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cagio-green rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-cagio-green-dark">BOX Ativa</span>
          </div>
          <p className="text-xs text-cagio-green-dark mt-1">
            147 atletas ativos
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
