import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  Calendar,
  Settings,
  DollarSign,
  Building2,
  UserCog,
  BarChart3,
  MessageSquare,
  Package,
  CalendarDays,
  ShoppingBag,
  BookOpen,
  Target,
  CreditCard,
  TrendingUp,
  Shield
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCompany } from '@/contexts/CompanyContext';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { user } = useAuth();
  const { currentCompany } = useCompany();
  
  const currentPath = location.pathname;
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path);

  // Admin menu items
  const adminItems = [
    { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Empresas', url: '/admin/companies', icon: Building2 },
    { title: 'Atletas', url: '/admin/athletes', icon: Users },
    { title: 'Relatórios', url: '/admin/reports', icon: BarChart3 },
  ];

  // Box/Company menu items - using clean URLs without company ID
  const boxItems = [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Atletas', url: '/athletes', icon: Users },
    { title: 'Treinadores', url: '/trainers', icon: UserCog },
    { title: 'Aulas', url: '/classes', icon: Calendar },
    { title: 'Treinos', url: '/workouts', icon: Dumbbell },
    { title: 'CRM', url: '/crm', icon: Target },
    { title: 'Comunicação', url: '/communication', icon: MessageSquare },
    { title: 'Financeiro', url: '/financial', icon: DollarSign },
    { title: 'Assinaturas', url: '/subscriptions', icon: CreditCard },
    { title: 'Equipamentos', url: '/equipment', icon: Package },
    { title: 'Loja', url: '/store', icon: ShoppingBag },
    { title: 'Eventos', url: '/events', icon: CalendarDays },
    { title: 'RH', url: '/hr', icon: Users },
    { title: 'Relatórios', url: '/reports', icon: BarChart3 },
    { title: 'Configurações', url: '/settings', icon: Settings },
  ];

  // Trainer menu items
  const trainerItems = [
    { title: 'Dashboard', url: '/trainer/dashboard', icon: LayoutDashboard },
    { title: 'Meus Alunos', url: '/trainer/students', icon: Users },
    { title: 'Planos de Treino', url: '/trainer/workout-plans', icon: Dumbbell },
    { title: 'Planos Nutricionais', url: '/trainer/nutrition-plans', icon: BookOpen },
    { title: 'Treinos', url: '/trainer/workouts', icon: Target },
  ];

  // Student menu items
  const studentItems = [
    { title: 'Dashboard', url: '/student/dashboard', icon: LayoutDashboard },
    { title: 'Meus Treinos', url: '/student/workouts', icon: Dumbbell },
    { title: 'Reservas', url: '/student/bookings', icon: Calendar },
    { title: 'Progresso', url: '/student/progress', icon: TrendingUp },
    { title: 'Pagamentos', url: '/student/payments', icon: CreditCard },
  ];

  // Determine which menu to show based on user role
  let menuItems = boxItems;
  let menuLabel = 'Menu Principal';

  if (user?.role === 'cagio_admin') {
    menuItems = adminItems;
    menuLabel = 'Admin Cagio';
  } else if (user?.role === 'trainer') {
    menuItems = trainerItems;
    menuLabel = 'Personal Trainer';
  } else if (user?.role === 'student') {
    menuItems = studentItems;
    menuLabel = 'Aluno';
  } else if (user?.role === 'box_admin' || user?.role === 'box_owner') {
    menuItems = boxItems;
    menuLabel = currentCompany?.name || 'Empresa';
  }

  return (
    <Sidebar className={collapsed ? 'w-16' : 'w-64'} collapsible="icon">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-lg font-semibold px-4 mb-2">
              {menuLabel}
            </SidebarGroupLabel>
          )}

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-3 hover:bg-accent/50 transition-colors"
                      activeClassName="bg-accent text-accent-foreground font-medium"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Role badge at bottom */}
        {!collapsed && user && (
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span className="capitalize">
                {user.role === 'cagio_admin' ? 'Admin' :
                 user.role === 'box_admin' ? 'Admin Box' :
                 user.role === 'trainer' ? 'Personal' :
                 user.role === 'student' ? 'Aluno' : user.role}
              </span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
