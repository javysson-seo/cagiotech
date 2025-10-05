
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Calendar, 
  CreditCard, 
  User, 
  Target, 
  Settings, 
  LogOut,
  Dumbbell,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

export const ResponsiveStudentSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: Home },
    { name: 'Meus Exercícios', href: '/student/workouts', icon: Dumbbell },
    { name: 'Reservar Aulas', href: '/student/bookings', icon: Calendar },
    { name: 'Meus Pagamentos', href: '/student/payments', icon: CreditCard },
    { name: 'Progresso', href: '/student/progress', icon: Target },
    { name: 'Perfil', href: '/student/profile', icon: User },
    { name: 'Configurações', href: '/student/settings', icon: Settings },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-cagio-green/20 bg-cagio-green-light/30">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cagio-green">
            <Dumbbell className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold text-cagio-green">CagioTech</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cagio-green to-cagio-green-dark flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
              {user?.email?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold text-foreground">
              {user?.email?.split('@')[0]}
            </p>
            <p className="text-sm text-muted-foreground">
              Atleta
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
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all',
                isActive
                  ? 'bg-cagio-green text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-border">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => {
            logout();
            setOpen(false);
          }}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button 
            size="icon" 
            className="fixed top-4 left-4 z-50 bg-cagio-green hover:bg-cagio-green-dark text-white shadow-lg"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[90vh]">
          <div className="flex flex-col h-full">
            <DrawerHeader>
              <DrawerTitle className="sr-only">Menu de Navegação</DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop sidebar
  return (
    <div className="flex flex-col w-64 bg-card border-r border-cagio-green/20">
      <SidebarContent />
    </div>
  );
};
