
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
  Dumbbell,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

export const ResponsiveTrainerSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

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
      id: 'workout-plans',
      label: 'Planos de Treino',
      icon: Dumbbell,
      path: '/trainer/workout-plans'
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

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">Personal Trainer</h2>
            <p className="text-sm text-muted-foreground">Portal do Trainer</p>
          </div>
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
                  active && "bg-primary/10 text-primary border-r-2 border-primary"
                )}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="h-4 w-4 mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          CagioTech v1.0 - Trainer
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
            <Menu className="h-4 w-4" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[85vh]">
          <div className="flex flex-col h-full">
            <DrawerHeader>
              <DrawerTitle className="sr-only">Menu de Navegação</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 flex flex-col">
              <SidebarContent />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop sidebar
  return (
    <div className={cn(
      "bg-card border-r border-border flex flex-col transition-all duration-300 w-64"
    )}>
      <SidebarContent />
    </div>
  );
};
