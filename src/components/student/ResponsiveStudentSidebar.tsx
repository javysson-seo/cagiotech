
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
      <div className="flex items-center h-16 px-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">CAGIO</span>
        </div>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-medium">
              {user?.name?.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-sm text-muted-foreground capitalize">
              {user?.role === 'student' ? 'Aluno' : user?.role}
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
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
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
    <div className="flex flex-col w-64 bg-card border-r border-border">
      <SidebarContent />
    </div>
  );
};
