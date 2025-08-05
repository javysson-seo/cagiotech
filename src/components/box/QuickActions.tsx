
import React from 'react';
import { Plus, UserPlus, Calendar, CreditCard, FileText, Users, TrendingUp, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
  bgColor: string;
}

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const quickActions: QuickAction[] = [
    {
      id: 'novo-atleta',
      title: 'Novo Atleta',
      description: 'Registar novo membro',
      icon: UserPlus,
      path: '/box/athletes/new',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100'
    },
    {
      id: 'nova-aula',
      title: 'Nova Aula',
      description: 'Agendar nova sessão',
      icon: Calendar,
      path: '/box/classes/new',
      color: 'text-green-600',
      bgColor: 'bg-green-50 hover:bg-green-100'
    },
    {
      id: 'lancar-despesa',
      title: 'Lançar Despesa',
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
    },
    {
      id: 'gerir-trainers',
      title: 'Gerir Trainers',
      description: 'Ver personal trainers',
      icon: Users,
      path: '/box/trainers',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100'
    },
    {
      id: 'relatorios',
      title: 'Relatórios',
      description: 'Ver métricas e análises',
      icon: TrendingUp,
      path: '/box/reports',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 hover:bg-indigo-100'
    },
    {
      id: 'configuracoes',
      title: 'Configurações',
      description: 'Configurar a BOX',
      icon: Settings,
      path: '/box/settings',
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    },
    {
      id: 'adicionar-mais',
      title: 'Ver Mais',
      description: 'Outras funcionalidades',
      icon: Plus,
      path: '/box/dashboard',
      color: 'text-gray-500',
      bgColor: 'bg-gray-50 hover:bg-gray-100'
    }
  ];

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Plus className="h-5 w-5 mr-2 text-blue-600" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            
            return (
              <Button
                key={action.id}
                variant="outline"
                className={`h-auto p-4 border-0 shadow-sm transition-all duration-200 ${action.bgColor}`}
                onClick={() => navigate(action.path)}
              >
                <div className="flex flex-col items-center space-y-2 text-center">
                  <div className={`p-2 rounded-full bg-white shadow-sm`}>
                    <Icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-foreground">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
