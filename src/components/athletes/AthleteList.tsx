
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Edit, Mail, Phone, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { type Athlete } from '@/hooks/useAthletes';

interface AthleteListProps {
  athletes: Athlete[];
  loading: boolean;
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
  onView
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inativo</Badge>;
      case 'frozen':
        return <Badge className="bg-orange-100 text-orange-800">Congelado</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredAthletes = athletes.filter(athlete => {
    const matchesSearch = 
      athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (athlete.email && athlete.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (athlete.phone && athlete.phone.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || athlete.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bed700]"></div>
            <span className="ml-2">Carregando atletas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (filteredAthletes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-4">
              <span className="text-4xl">👥</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum atleta encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de pesquisa.'
                : 'Comece adicionando seu primeiro atleta.'}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAthletes.map((athlete) => (
        <Card key={athlete.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${athlete.name}`} />
                  <AvatarFallback className="bg-[#bed700]/10 text-[#bed700] font-semibold">
                    {getInitials(athlete.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-lg">{athlete.name}</h3>
                    {getStatusBadge(athlete.status)}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    {athlete.email && (
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{athlete.email}</span>
                      </div>
                    )}
                    
                    {athlete.phone && (
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{athlete.phone}</span>
                      </div>
                    )}
                    
                    {athlete.birth_date && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {format(parseISO(athlete.birth_date), 'dd/MM/yyyy', { locale: pt })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(athlete)}
                  className="hover:bg-[#bed700]/10 hover:border-[#bed700]"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Ver
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(athlete)}
                  className="bg-[#bed700] hover:bg-[#a5c400] text-white border-[#bed700]"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
