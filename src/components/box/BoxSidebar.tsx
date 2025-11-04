
import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Users, 
  UserCheck,
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  Dumbbell,
  UserPlus,
  Euro,
  CreditCard,
  Package,
  CalendarDays,
  Trophy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { Logo } from '@/components/ui/logo';
import { useAthletes } from '@/hooks/useAthletes';

export const BoxSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { companyId: routeCompanyId } = useParams<{ companyId: string }>();
  const { currentCompany } = useCompany();
  const { athletes } = useAthletes();

  const resolvedCompanyId = routeCompanyId || currentCompany?.id;

  if (!resolvedCompanyId || !currentCompany) {
    return null;
  }

  const activeAthletes = athletes.filter(athlete => athlete.status === 'active').length;

  const navigation = [
    { name: 'Dashboard', href: `/${resolvedCompanyId}`, icon: Home },
    { name: 'Atletas', href: `/${resolvedCompanyId}/athletes`, icon: Users },
    { name: 'Recursos humanos', href: `/${resolvedCompanyId}/hr`, icon: UserCheck },
    { name: 'Aulas / Serviços', href: `/${resolvedCompanyId}/classes`, icon: Calendar },
    { name: 'Treinos', href: `/${resolvedCompanyId}/workouts`, icon: Trophy },
    { name: 'CRM', href: `/${resolvedCompanyId}/crm`, icon: UserPlus },
    { name: 'Comunicação', href: `/${resolvedCompanyId}/communication`, icon: MessageSquare },
    { name: 'Financeiro', href: `/${resolvedCompanyId}/financial`, icon: Euro },
    { name: 'Material deportivo', href: `/${resolvedCompanyId}/equipment`, icon: Dumbbell },
    { name: 'Loja', href: `/${resolvedCompanyId}/store`, icon: Package },
    { name: 'Eventos', href: `/${resolvedCompanyId}/events`, icon: CalendarDays },
    { name: 'Configurações', href: `/${resolvedCompanyId}/settings`, icon: Settings },
  ];

  return (
    <aside className="flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-border shrink-0">
        <div className="flex items-center space-x-2">
          <Logo size="sm" />
          <span className="text-lg font-bold text-foreground">CAGIO</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="space-y-1">
          <p className="font-semibold text-sm text-foreground truncate">{currentCompany.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user?.name}</p>
          <Badge variant="outline" className="text-xs mt-1">
            Administrador
          </Badge>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === `/${resolvedCompanyId}`}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
          >
            <item.icon className="mr-3 h-4 w-4 shrink-0" />
            <span className="truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-3 border-t border-border shrink-0">
        <div className="bg-primary/10 p-3 rounded-lg mb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Atletas</span>
            </div>
            <span className="text-sm font-bold text-primary">{activeAthletes}</span>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      </div>
    </aside>
  );
};
