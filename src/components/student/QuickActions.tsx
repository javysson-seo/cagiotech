import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  QrCode, 
  Calendar, 
  CreditCard, 
  Trophy,
  Dumbbell,
  MessageCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: QrCode,
      label: 'Check-in',
      color: 'bg-cagio-green',
      textColor: 'text-white',
      onClick: () => {/* Check-in modal */}
    },
    {
      icon: Calendar,
      label: 'Aulas',
      color: 'bg-blue-500',
      textColor: 'text-white',
      onClick: () => navigate('/student/bookings')
    },
    {
      icon: CreditCard,
      label: 'Pagamentos',
      color: 'bg-purple-500',
      textColor: 'text-white',
      onClick: () => navigate('/student/payments')
    },
    {
      icon: Trophy,
      label: 'Progresso',
      color: 'bg-orange-500',
      textColor: 'text-white',
      onClick: () => navigate('/student/progress')
    },
    {
      icon: Dumbbell,
      label: 'Treinos',
      color: 'bg-red-500',
      textColor: 'text-white',
      onClick: () => navigate('/student/workouts')
    },
    {
      icon: MessageCircle,
      label: 'Suporte',
      color: 'bg-teal-500',
      textColor: 'text-white',
      onClick: () => {/* Support modal */}
    }
  ];

  return (
    <div className="grid grid-cols-3 gap-3 sm:gap-4">
      {actions.map((action) => (
        <Card
          key={action.label}
          onClick={action.onClick}
          className="p-4 sm:p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:scale-105 transition-transform border-0 shadow-md hover:shadow-lg"
        >
          <div className={`${action.color} ${action.textColor} p-3 sm:p-4 rounded-2xl`}>
            <action.icon className="h-5 w-5 sm:h-6 sm:w-6" />
          </div>
          <span className="text-xs sm:text-sm font-medium text-center">
            {action.label}
          </span>
        </Card>
      ))}
    </div>
  );
};
