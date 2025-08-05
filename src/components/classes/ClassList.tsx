
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit, 
  Eye, 
  Clock, 
  Users, 
  MapPin, 
  Calendar,
  Euro,
  Repeat
} from 'lucide-react';

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
  // Mock data - will come from API/Supabase
  const classes = [
    {
      id: 1,
      name: 'CrossFit Morning',
      modality: 'crossfit',
      trainer: 'Carlos Santos',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
      date: '2024-01-15',
      startTime: '06:00',
      endTime: '07:00',
      duration: 60,
      maxCapacity: 20,
      enrolled: 16,
      waitlist: 2,
      room: 'Sala 1',
      level: 'Todos os Níveis',
      price: 15,
      recurring: true,
      status: 'scheduled'
    },
    {
      id: 2,
      name: 'Yoga Flow',
      modality: 'yoga',
      trainer: 'Ana Costa',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
      date: '2024-01-15',
      startTime: '07:30',
      endTime: '08:30',
      duration: 60,
      maxCapacity: 15,
      enrolled: 12,
      waitlist: 0,
      room: 'Sala 2',
      level: 'Iniciante',
      price: 12,
      recurring: true,
      status: 'scheduled'
    },
    {
      id: 3,
      name: 'HIIT Avançado',
      modality: 'hiit',
      trainer: 'Pedro Silva',
      trainerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
      date: '2024-01-15',
      startTime: '18:00',
      endTime: '18:45',
      duration: 45,
      maxCapacity: 25,
      enrolled: 23,
      waitlist: 5,
      room: 'Sala 1',
      level: 'Avançado',
      price: 18,
      recurring: false,
      status: 'scheduled'
    }
  ];

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classItem.trainer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModality = modalityFilter === 'all' || classItem.modality === modalityFilter;
    
    // For date filter, we'd implement actual date logic here
    const matchesDate = true; // Placeholder
    
    return matchesSearch && matchesModality && matchesDate;
  });

  const getModalityBadge = (modality: string) => {
    const config = {
      crossfit: { label: 'CrossFit', variant: 'default' as const },
      yoga: { label: 'Yoga', variant: 'secondary' as const },
      hiit: { label: 'HIIT', variant: 'destructive' as const },
      functional: { label: 'Funcional', variant: 'outline' as const },
      pilates: { label: 'Pilates', variant: 'secondary' as const }
    };
    return config[modality as keyof typeof config] || { label: modality, variant: 'outline' as const };
  };

  const getLevelBadge = (level: string) => {
    const config = {
      beginner: { label: 'Iniciante', color: 'bg-green-100 text-green-800' },
      intermediate: { label: 'Intermédio', color: 'bg-yellow-100 text-yellow-800' },
      advanced: { label: 'Avançado', color: 'bg-red-100 text-red-800' },
      all: { label: 'Todos', color: 'bg-blue-100 text-blue-800' }
    };
    return config[level as keyof typeof config] || config.all;
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-4">
      {filteredClasses.map((classItem) => {
        const modalityBadge = getModalityBadge(classItem.modality);
        const levelBadge = getLevelBadge(classItem.level);
        const occupancyPercentage = Math.round((classItem.enrolled / classItem.maxCapacity) * 100);
        
        return (
          <Card key={classItem.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {classItem.name}
                    </h3>
                    <Badge variant={modalityBadge.variant}>
                      {modalityBadge.label}
                    </Badge>
                    <Badge className={levelBadge.color}>
                      {levelBadge.label}
                    </Badge>
                    {classItem.recurring && (
                      <Badge variant="outline" className="flex items-center">
                        <Repeat className="h-3 w-3 mr-1" />
                        Recorrente
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={classItem.trainerAvatar} alt={classItem.trainer} />
                      <AvatarFallback className="text-xs">
                        {classItem.trainer.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">
                      {classItem.trainer}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(classItem)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{new Date(classItem.date).toLocaleDateString('pt-PT')}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{classItem.startTime} - {classItem.endTime}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{classItem.room}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Euro className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">€{classItem.price}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className={`text-sm font-medium ${getOccupancyColor(occupancyPercentage)}`}>
                      {classItem.enrolled}/{classItem.maxCapacity}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({occupancyPercentage}%)
                    </span>
                  </div>
                  
                  {classItem.waitlist > 0 && (
                    <div className="text-sm">
                      <span className="text-orange-600 font-medium">
                        {classItem.waitlist} em lista de espera
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Duração: {classItem.duration}min
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-muted-foreground">Ocupação</span>
                  <span className="text-xs text-muted-foreground">{occupancyPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      occupancyPercentage >= 90 ? 'bg-red-500' :
                      occupancyPercentage >= 75 ? 'bg-orange-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
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
