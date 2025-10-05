import React, { useState } from 'react';
import { Bell, Search, Settings, Globe, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

export const StudentHeader: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
            placeholder="Pesquisar..."
            className="pl-10 text-sm"
          />
        </div>
      </div>

      {/* Actions - responsive */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-500 hover:bg-red-600 p-0 flex items-center justify-center">
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-w-[90vw]">
            <div className="p-4">
              <h4 className="font-semibold mb-2">Notificações</h4>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium">Aula confirmada!</p>
                  <p className="text-xs text-muted-foreground">
                    CrossFit Morning - Hoje às 06:00
                  </p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium">Pagamento pendente</p>
                  <p className="text-xs text-muted-foreground">
                    Mensalidade de Janeiro
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Settings & User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center space-x-2">
              <Avatar className="h-6 w-6 md:h-8 md:w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Settings className="h-4 w-4 md:block hidden" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
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
