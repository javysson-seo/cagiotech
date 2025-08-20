
import React from 'react';
import { Eye, Edit, Trash2, Phone, Mail, Euro } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { type Athlete } from '@/hooks/useAthletes';

interface AthleteListProps {
  athletes: Athlete[];
  loading?: boolean;
  searchTerm: string;
  statusFilter: string;
  onEdit: (athlete: Athlete) => void;
  onView: (athlete: Athlete) => void;
}

export const AthleteList: React.FC<AthleteListProps> = ({
  athletes,
  loading,
  searchTerm,
  statusFilter,
  onEdit,
  onView,
}) => {
  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Ativo', variant: 'default' as const },
      inactive: { label: 'Inativo', variant: 'secondary' as const },
      frozen: { label: 'Congelado', variant: 'outline' as const },
      pending: { label: 'Pendente', variant: 'destructive' as const }
    };
    return config[status as keyof typeof config] || config.active;
  };

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = !searchTerm || 
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      athlete.phone?.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || athlete.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando atletas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredAthletes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-2">
              {searchTerm || statusFilter !== 'all' ? 'Nenhum atleta encontrado com os filtros aplicados' : 'Nenhum atleta cadastrado'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <p className="text-sm text-muted-foreground">
                Clique em "Novo Atleta" para começar
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAthletes.map((athlete) => {
        const statusBadge = getStatusBadge(athlete.status || 'active');
        
        return (
          <Card key={athlete.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={athlete.profile_photo} alt={athlete.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-600">
                      {athlete.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {athlete.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      {athlete.email && (
                        <span className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {athlete.email}
                        </span>
                      )}
                      {athlete.phone && (
                        <span className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {athlete.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                      {athlete.plan && (
                        <Badge variant="outline">{athlete.plan}</Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {athlete.trainer && (
                        <span>Trainer: {athlete.trainer}</span>
                      )}
                      {athlete.monthly_fee && (
                        <span className="flex items-center font-medium text-emerald-600">
                          <Euro className="h-3 w-3 mr-1" />
                          {athlete.monthly_fee}/mês
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onView(athlete)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEdit(athlete)}
                      className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
