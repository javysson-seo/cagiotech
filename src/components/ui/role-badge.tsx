
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Building2, Dumbbell, User } from 'lucide-react';
import { UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'md';
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  showIcon = false,
  variant = 'default',
  size = 'md',
  className
}) => {
  const roleConfig = {
    cagio_admin: {
      label: 'Admin Cagio',
      icon: Shield,
      className: 'bg-purple-100 text-purple-800 border-purple-200',
      iconColor: 'text-purple-600'
    },
    box_admin: {
      label: 'Admin BOX',
      icon: Building2,
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      iconColor: 'text-blue-600'
    },
    trainer: {
      label: 'Trainer',
      icon: Dumbbell,
      className: 'bg-green-100 text-green-800 border-green-200',
      iconColor: 'text-green-600'
    },
    student: {
      label: 'Aluno',
      icon: User,
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      iconColor: 'text-gray-600'
    }
  };

  const config = roleConfig[role];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'text-xs h-5',
    md: 'text-sm h-6'
  };

  return (
    <Badge
      variant={variant === 'default' ? 'secondary' : variant}
      className={cn(
        sizeClasses[size],
        variant === 'default' && config.className,
        'inline-flex items-center gap-1 font-medium',
        className
      )}
    >
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </Badge>
  );
};
