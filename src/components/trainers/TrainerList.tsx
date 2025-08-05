
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Edit, Eye, Phone, Mail, Star, Users } from 'lucide-react';

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
  // Mock data - will come from API/Supabase
  const trainers = [
    {
      id: 1,
      name: 'Carlos Santos',
      email: 'carlos@crossfitbenfica.com',
      phone: '+351 912 345 678',
      specialties: ['CrossFit', 'Weightlifting', 'HIIT'],
      status: 'active',
      hourlyRate: 35,
      experience: 8,
      rating: 4.9,
      reviews: 47,
      activeClients: 23,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      joinDate: '2022-03-15'
    },
    {
      id: 2,
      name: 'Ana Costa',
      email: 'ana@crossfitbenfica.com',
      phone: '+351 913 456 789',
      specialties: ['Yoga', 'Pilates', 'Mobility'],
      status: 'active',
      hourlyRate: 30,
      experience: 5,
      rating: 4.8,
      reviews: 32,
      activeClients: 18,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      joinDate: '2023-01-10'
    },
    {
      id: 3,
      name: 'Pedro Silva',
      email: 'pedro@crossfitbenfica.com',
      phone: '+351 914 567 890',
      specialties: ['Functional', 'Calisthenics'],
      status: 'vacation',
      hourlyRate: 28,
      experience: 3,
      rating: 4.6,
      reviews: 18,
      activeClients: 12,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      joinDate: '2023-08-22'
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

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {filteredTrainers.map((trainer) => {
            const statusBadge = getStatusBadge(trainer.status);
            
            return (
              <div key={trainer.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={trainer.avatar} alt={trainer.name} />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      {trainer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {trainer.name}
                      </h3>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{trainer.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {trainer.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {trainer.phone}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {trainer.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                        {trainer.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{trainer.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3 text-sm">
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1 text-blue-600" />
                          <span className="font-medium">{trainer.activeClients}</span>
                        </div>
                        <div className="text-green-600 font-medium">
                          €{trainer.hourlyRate}/h
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(trainer)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(trainer)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {filteredTrainers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhum trainer encontrado com os filtros aplicados.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
