import React, { useState } from 'react';
import { Bell, Search, Settings, Globe, LogOut, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Logo } from '@/components/ui/logo';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserProfileModal } from '@/components/UserProfileModal';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const TrainerHeader: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { notifications, unreadCount, isLoading } = useNotifications();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const handleLanguageChange = async (newLang: 'pt' | 'en') => {
    try {
      await changeLanguage(newLang);
      await i18n.changeLanguage(newLang);
      toast.success(newLang === 'pt' ? 'Idioma alterado para Português' : 'Language changed to English');
    } catch (error) {
      toast.error('Erro ao alterar idioma');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logout realizado com sucesso');
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
      {/* Logo + Search - responsive */}
      <div className="flex items-center space-x-4 flex-1 max-w-xs md:max-w-md">
        <Logo size="sm" className="md:w-8 md:h-8" />
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Pesquisar atletas, aulas..."
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Actions - responsive */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Quick Schedule Access */}
        <Button variant="ghost" size="sm" className="hidden md:flex">
          <Calendar className="h-4 w-4 mr-2" />
          Agenda
        </Button>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-blue-500 hover:bg-blue-600 p-0 flex items-center justify-center">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-w-[90vw]">
            <div className="p-4 border-b">
              <h4 className="font-semibold">Notificações</h4>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
                </p>
              )}
            </div>
            <ScrollArea className="max-h-80">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Carregando...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-6 text-center">
                  <Bell className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Nenhuma notificação
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="p-3">
                      <div className="flex items-start gap-2">
                        {notification.is_urgent && (
                          <div className="h-2 w-2 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                              locale: ptBR
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings & User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Avatar className="h-6 w-6 md:h-8 md:w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-green-100 text-green-600 text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Settings className="h-4 w-4 md:block hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.boxName}</p>
              <p className="text-xs text-green-600">Personal Trainer</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="md:hidden">
              <Calendar className="mr-2 h-4 w-4" />
              Minha Agenda
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'dark' ? (
                <>
                  <div className="mr-2 h-4 w-4 rounded-full bg-white border"></div>
                  Tema Claro
                </>
              ) : (
                <>
                  <div className="mr-2 h-4 w-4 rounded-full bg-black"></div>
                  Tema Escuro
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleLanguageChange(language === 'pt' ? 'en' : 'pt')}
            >
              <Globe className="mr-2 h-4 w-4" />
              {language === 'pt' ? 'English' : 'Português'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <UserProfileModal open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </header>
  );
};
