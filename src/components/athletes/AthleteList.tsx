
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Eye, Phone, Mail, Euro } from 'lucide-react';

interface AthleteListProps {
  athletes: any[];
  searchTerm: string;
  statusFilter: string;
  onEdit: (athlete: any) => void;
  onView: (athlete: any) => void;
}

export const AthleteList: React.FC<AthleteListProps> = ({
  athletes,
  searchTerm,
  statusFilter,
  onEdit,
  onView,
}) => {
  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = 
      athlete.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.phone?.includes(searchTerm);
    
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

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {filteredAthletes.map((athlete) => {
            const statusBadge = getStatusBadge(athlete.status);
            
            return (
              <div key={athlete.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={athlete.profile_photo} alt={athlete.name} />
                    <AvatarFallback className="bg-cagio-green-light text-cagio-green-dark">
                      {athlete.name.split(' ').map((n: string) => n[0]).join('')}
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
                        {athlete.plan && (
                          <>
                            <span className="text-muted-foreground">Plano:</span>
                            <span className="ml-1 font-medium">{athlete.plan}</span>
                            <span className="mx-2">•</span>
                          </>
                        )}
                        {athlete.trainer && (
                          <>
                            <span className="text-muted-foreground">Trainer:</span>
                            <span className="ml-1 font-medium">{athlete.trainer}</span>
                          </>
                        )}
                      </div>
                      
                      {athlete.monthly_fee > 0 && (
                        <div className="flex items-center text-sm">
                          <Euro className="h-3 w-3 mr-1 text-cagio-green" />
                          <span className="font-medium">€{athlete.monthly_fee}/mês</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(athlete)}
                      className="hover:bg-cagio-green-light hover:text-cagio-green-dark"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(athlete)}
                      className="hover:bg-cagio-green-light hover:text-cagio-green-dark"
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
