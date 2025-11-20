
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
    { name: 'Financeiro', href: '/admin/financial', icon: CreditCard },
    { name: 'Todos os Atletas', href: '/admin/athletes', icon: Users },
    { name: 'Sugestões', href: '/admin/suggestions', icon: MessageSquare },
    { name: 'Relatórios', href: '/admin/reports', icon: BarChart3 },
    { name: 'Segurança', href: '/admin/security', icon: Shield },
    { name: 'Base de Dados', href: '/admin/database', icon: Database },
  ];

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border shadow-xl">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border bg-cagio-green-muted">
        <div className="flex items-center space-x-3">
          <img 
            src="/lovable-uploads/f11d946f-1e84-4046-8622-ffeb54bba33e.png" 
            alt="CagioTech Logo" 
            className="h-10 w-auto"
          />
          <Badge className="bg-cagio-green text-white text-xs font-bold">ADMIN</Badge>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-cagio-green flex items-center justify-center ring-2 ring-cagio-green/20">
            <span className="text-white font-bold">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground">
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
                  ? 'bg-cagio-green text-white shadow-lg'
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
        <div className="bg-cagio-green-light p-3 rounded-lg mb-3 border border-cagio-green/30">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-cagio-green rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-cagio-green">Sistema Online</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Todos os serviços funcionais
          </p>
        </div>
        
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  );
};
