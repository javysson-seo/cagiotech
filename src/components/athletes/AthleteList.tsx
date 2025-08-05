
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Eye, Phone, Mail, Euro } from 'lucide-react';

interface AthleteListProps {
  searchTerm: string;
  statusFilter: string;
  onEdit: (athlete: any) => void;
  onView: (athlete: any) => void;
}

export const AthleteList: React.FC<AthleteListProps> = ({
  searchTerm,
  statusFilter,
  onEdit,
  onView,
}) => {
  // Mock data - will come from API/Supabase
  const athletes = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '+351 912 345 678',
      plan: 'Ilimitado',
      status: 'active',
      paymentStatus: 'paid',
      joinDate: '2024-01-15',
      trainer: 'Carlos Santos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
      monthlyFee: 75
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '+351 913 456 789',
      plan: '8x Semana',
      status: 'active',
      paymentStatus: 'pending',
      joinDate: '2024-02-01',
      trainer: 'Ana Costa',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
      monthlyFee: 50
    },
    {
      id: 3,
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      phone: '+351 914 567 890',
      plan: '4x Semana',
      status: 'frozen',
      paymentStatus: 'paid',
      joinDate: '2023-11-10',
      trainer: 'Carlos Santos',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      monthlyFee: 35
    }
  ];

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         athlete.phone.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || athlete.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const },
      inactive: { label: 'Inativo', variant: 'secondary' as const },
      frozen: { label: 'Congelado', variant: 'outline' as const },
      pending: { label: 'Pendente', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getPaymentBadge = (status: string) => {
    return status === 'paid' ? 
      { label: 'Pago', variant: 'default' as const } : 
      { label: 'Pendente', variant: 'destructive' as const };
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {filteredAthletes.map((athlete) => {
            const statusBadge = getStatusBadge(athlete.status);
            const paymentBadge = getPaymentBadge(athlete.paymentStatus);
            
            return (
              <div key={athlete.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={athlete.avatar} alt={athlete.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {athlete.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {athlete.name}
                      </h3>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                      <Badge variant={paymentBadge.variant}>
                        {paymentBadge.label}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {athlete.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {athlete.phone}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Plano:</span>
                        <span className="ml-1 font-medium">{athlete.plan}</span>
                        <span className="mx-2">•</span>
                        <span className="text-muted-foreground">Trainer:</span>
                        <span className="ml-1 font-medium">{athlete.trainer}</span>
                      </div>
                      
                      <div className="flex items-center text-sm">
                        <Euro className="h-3 w-3 mr-1 text-green-600" />
                        <span className="font-medium">{athlete.monthlyFee}/mês</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(athlete)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(athlete)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredAthletes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum atleta encontrado com os filtros aplicados.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
