
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  Calendar, 
  Euro, 
  MessageCircle, 
  Settings, 
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

export const BoxSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/box/dashboard'
    },
    {
      id: 'atletas',
      label: 'Atletas/Membros',
      icon: Users,
      path: '/box/athletes',
      badge: 5
    },
    {
      id: 'trainers',
      label: 'Personal Trainers',
      icon: UserCheck,
      path: '/box/trainers'
    },
    {
      id: 'aulas',
      label: 'Aulas & Serviços',
      icon: Calendar,
      path: '/box/classes'
    },
    {
      id: 'financeiro',
      label: 'Financeiro',
      icon: Euro,
      path: '/box/financial',
      badge: 3
    },
    {
      id: 'comunicacao',
      label: 'Comunicação',
      icon: MessageCircle,
      path: '/box/communication'
    },
    {
      id: 'configuracoes',
      label: 'Configurações',
      icon: Settings,
      path: '/box/settings'
    }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="font-semibold text-foreground">CrossFit Porto</h2>
              <p className="text-sm text-muted-foreground">BOX Admin</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Button
                key={item.id}
                variant={active ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start relative",
                  isCollapsed && "justify-center px-2",
                  active && "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            CagioTech v1.0
          </div>
        </div>
      )}
    </div>
  );
};
