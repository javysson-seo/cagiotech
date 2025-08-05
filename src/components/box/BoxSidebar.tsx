
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCheck,
  CreditCard,
  MessageSquare,
  BarChart,
  Settings,
  FileText,
  Crown,
  Building,
  Phone,
  Euro
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/box/dashboard', icon: LayoutDashboard },
  { name: 'Atletas', href: '/box/athletes', icon: Users },
  { name: 'Trainers', href: '/box/trainers', icon: UserCheck },
  { name: 'Aulas', href: '/box/classes', icon: Calendar },
  { name: 'Planos', href: '/box/plans', icon: Crown },
  { name: 'Documentos', href: '/box/documents', icon: FileText },
  { name: 'Financeiro', href: '/box/financial', icon: Euro },
  { name: 'Comunicação', href: '/box/communication', icon: MessageSquare },
  { name: 'CRM', href: '/box/crm', icon: Phone },
  { name: 'Relatórios', href: '/box/reports', icon: BarChart },
  { name: 'Definições', href: '/box/settings', icon: Settings }
];

export const BoxSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-gray-50 lg:border-r">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center h-16 flex-shrink-0 px-4 bg-white border-b">
          <Building className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">CagioTech</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
