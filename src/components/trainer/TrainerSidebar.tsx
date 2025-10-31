
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText,
  BookOpen,
  BarChart3,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Dumbbell
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

export const TrainerSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/trainer/dashboard'
    },
    {
      id: 'students',
      label: 'Meus Alunos',
      icon: Users,
      path: '/trainer/students',
      badge: 3
    },
    {
      id: 'schedule',
      label: 'Agenda',
      icon: Calendar,
      path: '/trainer/schedule'
    },
    {
      id: 'workouts',
      label: 'Planos de Treino',
      icon: Dumbbell,
      path: '/trainer/workouts'
    },
    {
      id: 'nutrition-plans',
      label: 'Planos Nutricionais',
      icon: BookOpen,
      path: '/trainer/nutrition-plans'
    },
    {
      id: 'progress',
      label: 'Progressos',
      icon: BarChart3,
      path: '/trainer/progress'
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: FileText,
      path: '/trainer/reports'
    },
    {
      id: 'messages',
      label: 'Mensagens',
      icon: MessageCircle,
      path: '/trainer/messages',
      badge: 2
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      path: '/trainer/settings'
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
              <h2 className="font-semibold text-foreground">Personal Trainer</h2>
              <p className="text-sm text-muted-foreground">Portal do Trainer</p>
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
                  active && "bg-green-50 text-green-600 border-r-2 border-green-600"
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
            CagioTech v1.0 - Trainer
          </div>
        </div>
      )}
    </div>
  );
};
