import React, { useState } from 'react';
import { Bell, Search, User, LogOut, Settings, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAreaTheme } from '@/contexts/AreaThemeContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserProfileModal } from '@/components/UserProfileModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TrialBanner } from '@/components/subscription/TrialBanner';
import { useCompany } from '@/contexts/CompanyContext';
import { CompanyLogo } from '@/components/ui/company-logo';
import { useCompanyNotifications } from '@/hooks/useCompanyNotifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const BoxHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { language, changeLanguage } = useLanguage();
  const { theme, toggleTheme } = useAreaTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { currentCompany } = useCompany();
  const { notifications, isLoading } = useCompanyNotifications(currentCompany?.id || '');
  const queryClient = useQueryClient();

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('company_notifications')
        .update({ is_active: false })
        .eq('id', notificationId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-notifications'] });
    },
  });

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

  const handleNotificationClick = (notification: any) => {
    markAsReadMutation.mutate(notification.id);
    
    if (notification.type === 'new_registration' && notification.data?.athlete_id) {
      navigate(`/${currentCompany?.id}/athletes`);
    }
  };

  const unreadCount = notifications?.length || 0;

  return (
    <>
      <TrialBanner />
      <header className="sticky top-0 z-40 bg-card border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex items-center space-x-4 flex-1 max-w-md">
            <CompanyLogo 
              logoUrl={currentCompany?.logo_url}
              companyName={currentCompany?.name}
              size="sm"
              className="hidden md:block"
            />
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Pesquisar..."
                className="pl-10 bg-muted/50"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button variant="ghost" size="sm" onClick={toggleTheme}>
              {theme === 'dark' ? (
                <div className="h-4 w-4 rounded-full bg-white border"></div>
              ) : (
                <div className="h-4 w-4 rounded-full bg-black"></div>
              )}
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
                      variant="destructive"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 p-0 bg-background z-50">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Notificações</h3>
                  {unreadCount > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {unreadCount} {unreadCount === 1 ? 'nova notificação' : 'novas notificações'}
                    </p>
                  )}
                </div>
                <ScrollArea className="h-[400px]">
                  {!notifications || notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Nenhuma notificação</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notification: any) => (
                        <div
                          key={notification.id}
                          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-start justify-between">
                              <p className="font-medium text-sm">{notification.title}</p>
                              {notification.is_urgent && (
                                <Badge variant="destructive" className="text-xs">
                                  Urgente
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(notification.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background z-50">
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
                <DropdownMenuItem onClick={() => navigate(`/${currentCompany?.id}/settings`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background z-50">
                <div className="flex items-center gap-3 p-2">
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(`/${currentCompany?.id}/settings`)}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <UserProfileModal open={isProfileOpen} onOpenChange={setIsProfileOpen} />
      </header>
    </>
  );
};
