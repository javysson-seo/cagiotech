
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
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { Logo } from '@/components/ui/logo';
import { useAthletes } from '@/hooks/useAthletes';

export const BoxSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { companySlug } = useParams<{ companySlug: string }>();
  const { currentCompany } = useCompany();
  const { athletes } = useAthletes();

  if (!companySlug || !currentCompany) {
    return null;
  }

  const activeAthletes = athletes.filter(athlete => athlete.status === 'active').length;

  const navigation = [
    { name: 'Dashboard', href: `/${companySlug}`, icon: Home },
    { name: 'Atletas', href: `/${companySlug}/athletes`, icon: Users },
    { name: 'Recursos humanos', href: `/${companySlug}/hr`, icon: UserCheck },
    { name: 'Aulas / Serviços', href: `/${companySlug}/classes`, icon: Calendar },
    { name: 'CRM', href: `/${companySlug}/crm`, icon: UserPlus },
    { name: 'Comunicação', href: `/${companySlug}/communication`, icon: MessageSquare },
    { name: 'Financeiro', href: `/${companySlug}/financial`, icon: Euro },
    { name: 'Assinaturas', href: `/${companySlug}/subscriptions`, icon: CreditCard },
    { name: 'Material deportivo', href: `/${companySlug}/equipment`, icon: Dumbbell },
    { name: 'Observatorio', href: `/${companySlug}/observatory`, icon: BarChart3 },
    { name: 'KPIS', href: `/${companySlug}/kpis`, icon: BarChart3 },
    { name: 'Configurações', href: `/${companySlug}/settings`, icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Logo size="md" />
          <span className="text-xl font-bold text-foreground">CAGIO</span>
          <Badge className="bg-[#bed700] text-black text-xs font-medium">{currentCompany.name}</Badge>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border">
        <div className="space-y-1">
          <p className="font-medium text-foreground">{currentCompany.name}</p>
          <p className="text-sm text-muted-foreground">{user?.name}</p>
          <Badge variant="outline" className="text-xs">
            BOX Administrator
          </Badge>
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
                  ? 'bg-[#bed700] text-black'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Quick Stats */}
      <div className="p-3 border-t border-border">
        <div className="bg-[#bed700]/10 p-3 rounded-lg mb-3">
          <div className="flex items-center space-x-2">
            <Dumbbell className="h-4 w-4 text-[#bed700]" />
            <span className="text-sm font-medium text-foreground">Status - {currentCompany.name}</span>
          </div>
          <div className="mt-2 text-xs">
            <span className="text-[#bed700] font-medium">{activeAthletes} Atletas Ativos</span>
          </div>
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
