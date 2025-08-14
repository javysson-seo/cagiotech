
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  Users, 
  MapPin, 
  Edit, 
  Trash2,
  Calendar,
  Euro,
  Star
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ClassListProps {
  searchTerm: string;
  modalityFilter: string;
  onEdit: (classData: any) => void;
}

export const ClassList: React.FC<ClassListProps> = ({
  searchTerm,
  modalityFilter,
  onEdit,
}) => {
  // Mock data - em produção virá da API/Supabase
  const classes = [
    {
      id: 1,
      title: 'CrossFit Morning',
      description: 'Treino funcional de alta intensidade para começar bem o dia',
      trainer: 'Carlos Santos',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      trainerRating: 4.8,
      modality: 'CrossFit',
      modalityColor: '#3B82F6',
      startTime: '2024-01-15T06:00:00',
      endTime: '2024-01-15T07:00:00',
      duration: 60,
      capacity: 20,
      booked: 12,
      price: 15,
      credits: 1,
      location: 'Sala Principal',
      difficulty: 'Intermediário',
      status: 'active',
      recurring: 'weekly'
    },
    {
      id: 2,
      title: 'Yoga Flow',
      description: 'Sequência fluida de posturas para flexibilidade e relaxamento',
      trainer: 'Ana Costa',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      trainerRating: 4.9,
      modality: 'Yoga',
      modalityColor: '#10B981',
      startTime: '2024-01-15T07:30:00',
      endTime: '2024-01-15T08:30:00',
      duration: 60,
      capacity: 15,
      booked: 8,
      price: 12,
      credits: 1,
      location: 'Sala de Yoga',
      difficulty: 'Iniciante',
      status: 'active',
      recurring: 'daily'
    },
    {
      id: 3,
      title: 'Functional Training',
      description: 'Treino funcional focado em movimentos do dia a dia',
      trainer: 'Pedro Silva',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      trainerRating: 4.7,
      modality: 'Functional',
      modalityColor: '#F59E0B',
      startTime: '2024-01-15T09:00:00',
      endTime: '2024-01-15T10:00:00',
      duration: 60,
      capacity: 12,
      booked: 12,
      price: 18,
      credits: 1,
      location: 'Área Externa',
      difficulty: 'Avançado',
      status: 'cancelled',
      recurring: 'weekly'
    }
  ];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = 
      classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.modality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModality = modalityFilter === 'all' || 
      classItem.modality.toLowerCase() === modalityFilter;
    
    return matchesSearch && matchesModality;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'bg-green-100 text-green-800';
      case 'Intermediário': return 'bg-orange-100 text-orange-800';
      case 'Avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'full': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Ativa';
      case 'cancelled': return 'Cancelada';
      case 'full': return 'Lotada';
      default: return status;
    }
  };

  const getAvailabilityColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 100) return 'text-red-600';
    if (percentage >= 80) return 'text-orange-600';
    return 'text-green-600';
  };

  const handleDeleteClass = (classId: number) => {
    console.log('Deletar aula:', classId);
    // Implementar lógica de exclusão
  };

  return (
    <div className="space-y-4">
      {filteredClasses.map((classItem) => (
        <Card key={classItem.id} className="hover:shadow-lg transition-all duration-200">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: classItem.modalityColor }}
                />
                <div>
                  <h3 className="font-semibold text-lg">{classItem.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {classItem.modality}
                    </Badge>
                    <Badge className={getDifficultyColor(classItem.difficulty)}>
                      {classItem.difficulty}
                    </Badge>
                    <Badge className={getStatusColor(classItem.status)}>
                      {getStatusLabel(classItem.status)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(classItem)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteClass(classItem.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4">
              {classItem.description}
            </p>

            {/* Trainer Info */}
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={classItem.trainerAvatar} alt={classItem.trainer} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {classItem.trainer.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <p className="font-medium text-sm">{classItem.trainer}</p>
                <div className="flex items-center space-x-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-muted-foreground">{classItem.trainerRating}</span>
                </div>
              </div>
            </div>

            {/* Class Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Data/Hora</p>
                  <p className="font-medium text-sm">
                    {format(parseISO(classItem.startTime), 'dd/MM HH:mm', { locale: pt })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Duração</p>
                  <p className="font-medium text-sm">{classItem.duration} min</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Users className={`h-4 w-4 ${getAvailabilityColor(classItem.booked, classItem.capacity)}`} />
                <div>
                  <p className="text-xs text-muted-foreground">Ocupação</p>
                  <p className="font-medium text-sm">
                    {classItem.booked}/{classItem.capacity}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-xs text-muted-foreground">Local</p>
                  <p className="font-medium text-sm">{classItem.location}</p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <div className="text-sm font-medium flex items-center">
                  <Euro className="h-3 w-3 mr-1" />
                  {classItem.price}
                </div>
                <div className="text-sm text-muted-foreground">
                  ou {classItem.credits} crédito
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Recorrência: {classItem.recurring === 'daily' ? 'Diária' : 
                             classItem.recurring === 'weekly' ? 'Semanal' : 'Única'}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {filteredClasses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Nenhuma aula encontrada com os filtros aplicados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
