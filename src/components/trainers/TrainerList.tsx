
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit, 
  Eye, 
  Star, 
  Users, 
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

interface TrainerListProps {
  searchTerm: string;
  statusFilter: string;
  onEdit: (trainer: any) => void;
  onView: (trainer: any) => void;
}

export const TrainerList: React.FC<TrainerListProps> = ({
  searchTerm,
  statusFilter,
  onEdit,
  onView,
}) => {
  // Mock data - em produção virá da API/Supabase
  const trainers = [
    {
      id: 1,
      name: 'Carlos Santos',
      email: 'carlos@crossfitporto.com',
      phone: '+351 912 345 678',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      status: 'active',
      specialties: ['CrossFit', 'Olympic Lifting', 'Mobility'],
      assignedAthletes: 25,
      rating: 4.9,
      totalClasses: 156,
      joinDate: '2023-01-15',
      paymentType: 'fixed',
      monthlyPay: 1500,
      availability: 'Segunda-Sexta: 06:00-22:00',
      certifications: ['CrossFit L2', 'Olympic Lifting']
    },
    {
      id: 2,
      name: 'Ana Costa',
      email: 'ana@crossfitporto.com',
      phone: '+351 987 654 321',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      status: 'active',
      specialties: ['Functional Training', 'Yoga', 'Nutrition'],
      assignedAthletes: 18,
      rating: 4.8,
      totalClasses: 89,
      joinDate: '2023-03-10',
      paymentType: 'per_class',
      payPerClass: 25,
      availability: 'Segunda-Sexta: 09:00-18:00',
      certifications: ['Functional Training', 'Yoga RYT200']
    },
    {
      id: 3,
      name: 'Pedro Silva',
      email: 'pedro@crossfitporto.com',
      phone: '+351 654 987 321',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      status: 'vacation',
      specialties: ['CrossFit', 'Powerlifting'],
      assignedAthletes: 12,
      rating: 4.7,
      totalClasses: 67,
      joinDate: '2023-06-01',
      paymentType: 'percentage',
      percentage: 40,
      availability: 'Terça-Sábado: 07:00-15:00',
      certifications: ['CrossFit L1', 'Powerlifting']
    }
  ];

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trainer.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || trainer.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const },
      vacation: { label: 'Em Férias', variant: 'secondary' as const },
      absent: { label: 'Ausente', variant: 'outline' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  const renderPaymentInfo = (trainer: any) => {
    switch (trainer.paymentType) {
      case 'fixed':
        return `€${trainer.monthlyPay}/mês`;
      case 'per_class':
        return `€${trainer.payPerClass}/aula`;
      case 'percentage':
        return `${trainer.percentage}% receita`;
      default:
        return 'N/A';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Personal Trainers ({filteredTrainers.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTrainers.map((trainer) => {
          const statusBadge = getStatusBadge(trainer.status);
          
          return (
            <Card key={trainer.id} className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={trainer.avatar} alt={trainer.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {trainer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold text-lg">{trainer.name}</h3>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{trainer.rating}</span>
                        <span>•</span>
                        <span>{trainer.totalClasses} aulas</span>
                      </div>
                    </div>
                  </div>
                  
                  <Badge variant={statusBadge.variant}>
                    {statusBadge.label}
                  </Badge>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {trainer.email}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="h-4 w-4 mr-2" />
                    {trainer.phone}
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Especialidades:</p>
                  <div className="flex flex-wrap gap-1">
                    {trainer.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold">{trainer.assignedAthletes}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Atletas</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">{renderPaymentInfo(trainer)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Remuneração</p>
                  </div>
                </div>

                {/* Availability */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">
                    <strong>Disponibilidade:</strong> {trainer.availability}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(trainer)}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalhes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(trainer)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTrainers.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum trainer encontrado com os filtros aplicados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
