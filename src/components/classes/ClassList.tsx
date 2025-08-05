
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit, 
  Copy, 
  Trash2, 
  Users, 
  Clock, 
  Calendar,
  MapPin,
  Star
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ClassListProps {
  searchTerm: string;
  modalityFilter: string;
  dateFilter: string;
  onEdit: (classData: any) => void;
}

export const ClassList: React.FC<ClassListProps> = ({
  searchTerm,
  modalityFilter,
  dateFilter,
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
      modality: 'CrossFit',
      startTime: '2024-01-15T06:00:00',
      endTime: '2024-01-15T07:00:00',
      duration: 60,
      capacity: 20,
      booked: 12,
      waitingList: 2,
      price: 15,
      location: 'Sala Principal',
      difficulty: 'Intermediário',
      equipment: ['Kettlebells', 'Barras', 'Boxes'],
      status: 'scheduled',
      recurring: 'weekly'
    },
    {
      id: 2,
      title: 'Yoga Flow',
      description: 'Sequência fluida de posturas para flexibilidade e relaxamento',
      trainer: 'Ana Costa',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      modality: 'Yoga',
      startTime: '2024-01-15T07:30:00',
      endTime: '2024-01-15T08:30:00',
      duration: 60,
      capacity: 15,
      booked: 8,
      waitingList: 0,
      price: 12,
      location: 'Sala de Yoga',
      difficulty: 'Iniciante',
      equipment: ['Tapetes', 'Blocos', 'Straps'],
      status: 'scheduled',
      recurring: 'weekly'
    },
    {
      id: 3,
      title: 'Functional Training',
      description: 'Treino funcional focado em movimentos do dia a dia',
      trainer: 'Pedro Silva',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      modality: 'Functional',
      startTime: '2024-01-15T09:00:00',
      endTime: '2024-01-15T10:00:00',
      duration: 60,
      capacity: 12,
      booked: 12,
      waitingList: 5,
      price: 18,
      location: 'Área Externa',
      difficulty: 'Avançado',
      equipment: ['TRX', 'Medicine Balls', 'Cones'],
      status: 'full',
      recurring: 'daily'
    },
    {
      id: 4,
      title: 'Pilates Clássico',
      description: 'Método tradicional focado em core e postura',
      trainer: 'Ana Costa',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      modality: 'Pilates',
      startTime: '2024-01-16T08:00:00',
      endTime: '2024-01-16T09:00:00',
      duration: 60,
      capacity: 10,
      booked: 6,
      waitingList: 0,
      price: 20,
      location: 'Estúdio Pilates',
      difficulty: 'Intermediário',
      equipment: ['Reformers', 'Cadillac', 'Barris'],
      status: 'scheduled',
      recurring: 'weekly'
    }
  ];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = 
      classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.trainer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.modality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModality = modalityFilter === 'all' || 
      classItem.modality.toLowerCase() === modalityFilter;
    
    // Implementar filtro de data conforme necessário
    
    return matchesSearch && matchesModality;
  });

  const getStatusBadge = (status: string, booked: number, capacity: number) => {
    switch (status) {
      case 'full':
        return <Badge variant="destructive">Lotada</Badge>;
      case 'cancelled':
        return <Badge variant="outline">Cancelada</Badge>;
      default:
        const percentage = (booked / capacity) * 100;
        if (percentage >= 90) {
          return <Badge variant="secondary">Quase Lotada</Badge>;
        } else if (percentage >= 50) {
          return <Badge variant="default">Vagas Limitadas</Badge>;
        }
        return <Badge variant="outline">Disponível</Badge>;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Iniciante': return 'text-green-600 bg-green-50';
      case 'Intermediário': return 'text-orange-600 bg-orange-50';
      case 'Avançado': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getOccupancyColor = (booked: number, capacity: number) => {
    const percentage = (booked / capacity) * 100;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Aulas ({filteredClasses.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredClasses.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={classItem.trainerAvatar} alt={classItem.trainer} />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {classItem.trainer.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{classItem.title}</h3>
                    <p className="text-muted-foreground text-sm mb-1">
                      {classItem.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>Por {classItem.trainer}</span>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {classItem.modality}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {getStatusBadge(classItem.status, classItem.booked, classItem.capacity)}
              </div>

              {/* Informações da aula */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-muted-foreground">Data/Hora</p>
                    <p className="font-medium text-sm">
                      {format(parseISO(classItem.startTime), 'dd/MM', { locale: pt })} às {format(parseISO(classItem.startTime), 'HH:mm')}
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
                  <Users className={`h-4 w-4 ${getOccupancyColor(classItem.booked, classItem.capacity)}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">Ocupação</p>
                    <p className="font-medium text-sm">
                      {classItem.booked}/{classItem.capacity}
                      {classItem.waitingList > 0 && (
                        <span className="text-xs text-orange-600 ml-1">
                          (+{classItem.waitingList} espera)
                        </span>
                      )}
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

              {/* Detalhes adicionais */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(classItem.difficulty)}`}>
                    {classItem.difficulty}
                  </div>
                  <div className="text-sm font-medium">€{classItem.price}</div>
                  {classItem.recurring && (
                    <Badge variant="outline" className="text-xs">
                      {classItem.recurring === 'daily' ? 'Diária' : 
                       classItem.recurring === 'weekly' ? 'Semanal' : 'Única'}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span>4.8</span>
                  <span className="ml-2">({classItem.booked} avaliações)</span>
                </div>
              </div>

              {/* Equipamentos */}
              {classItem.equipment && classItem.equipment.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Equipamentos necessários:</p>
                  <div className="flex flex-wrap gap-1">
                    {classItem.equipment.map((equipment, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {equipment}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(classItem)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicar
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
                
                <Button variant="default" size="sm">
                  Ver Lista de Presença
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
