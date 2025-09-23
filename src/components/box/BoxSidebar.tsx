
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
  Euro
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';
import { Logo } from '@/components/ui/logo';

export const BoxSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { companySlug } = useParams<{ companySlug: string }>();
  const { currentCompany } = useCompany();

  if (!companySlug || !currentCompany) {
    return null;
  }

  const navigation = [
    { name: 'Dashboard', href: `/${companySlug}`, icon: Home },
    { name: 'Atletas', href: `/${companySlug}/athletes`, icon: Users },
    { name: 'Trainers', href: `/${companySlug}/trainers`, icon: UserCheck },
    { name: 'Aulas', href: `/${companySlug}/classes`, icon: Calendar },
    { name: 'Relatórios', href: `/${companySlug}/reports`, icon: BarChart3 },
    { name: 'CRM', href: `/${companySlug}/crm`, icon: UserPlus },
    { name: 'Comunicação', href: `/${companySlug}/communication`, icon: MessageSquare },
    { name: 'Financeiro', href: `/${companySlug}/financial`, icon: Euro },
    { name: 'Configurações', href: `/${companySlug}/settings`, icon: Settings },
  ];

  return (
    <div className="flex flex-col w-64 bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Logo size="md" />
          <span className="text-xl font-bold text-foreground">CAGIO</span>
          <Badge className="bg-[#bed700] text-black text-xs font-medium">BOX</Badge>
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
            <span className="text-sm font-medium text-foreground">Status da BOX</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
            <div>
              <span className="text-[#bed700] font-medium">47 Atletas</span>
            </div>
            <div>
              <span className="text-[#bed700] font-medium">3 Trainers</span>
            </div>
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
