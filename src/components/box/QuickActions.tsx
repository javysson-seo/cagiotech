
import React from 'react';
import { Plus, UserPlus, Calendar, CreditCard, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'novo-atleta',
      title: 'Novo Atleta',
      description: 'Registar novo membro',
      icon: UserPlus,
      path: '/box/athletes/new',
      color: 'text-[#bed700]',
      bgColor: 'bg-[#bed700]/10 hover:bg-[#bed700]/20'
    },
    {
      id: 'nova-aula',
      title: 'Nova Aula',
      description: 'Agendar nova sessão',
      icon: Calendar,
      path: '/box/classes/new',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'lancar-despesa',
      title: 'Lançar Despesas',
      description: 'Registar nova despesa',
      icon: CreditCard,
      path: '/box/financial/expenses/new',
      color: 'text-red-600',
      bgColor: 'bg-red-50 hover:bg-red-100'
    },
    {
      id: 'ver-pagamentos',
      title: 'Pagamentos',
      description: 'Ver pagamentos pendentes',
      icon: FileText,
      path: '/box/financial/payments',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100'
    }
  ];

  return (
    <div className="space-y-3">
      {quickActions.map((action) => {
        const Icon = action.icon;
        
        return (
          <Button
            key={action.id}
            variant="outline"
            className={`w-full h-auto p-4 border-0 shadow-sm transition-all duration-200 ${action.bgColor} justify-start`}
            onClick={() => navigate(action.path)}
          >
            <div className="flex items-center space-x-3 w-full">
              <div className={`p-2 rounded-full bg-white shadow-sm`}>
                <Icon className={`h-5 w-5 ${action.color}`} />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm text-foreground">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
            </div>
          </Button>
        );
      })}
    </div>
  );
};
