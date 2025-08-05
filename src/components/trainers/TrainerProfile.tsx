
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Edit, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Euro, 
  Star,
  Users,
  Award,
  Clock,
  MessageCircle
} from 'lucide-react';

interface TrainerProfileProps {
  trainer: any;
  onEdit: () => void;
  onClose: () => void;
}

export const TrainerProfile: React.FC<TrainerProfileProps> = ({
  trainer,
  onEdit,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock additional data
  const trainerData = {
    ...trainer,
    address: 'Rua da Constituição, 456, 2º Dto.',
    city: 'Porto',
    postalCode: '4200-192',
    birthDate: '1985-08-20',
    joinDate: '2023-01-15',
    bio: 'Personal trainer certificado com mais de 8 anos de experiência em CrossFit e Olympic Lifting. Especialista em trabalhar com atletas de todos os níveis.',
    recentClasses: [
      { date: '2024-03-01', class: 'CrossFit WOD', students: 15 },
      { date: '2024-02-29', class: 'Olympic Lifting', students: 8 },
      { date: '2024-02-28', class: 'CrossFit WOD', students: 12 }
    ],
    performance: {
      avgRating: 4.9,
      totalRatings: 156,
      punctuality: 98,
      retention: 85
    },
    athletes: [
      { name: 'João Silva', plan: 'Unlimited', since: '2023-06-01' },
      { name: 'Maria Santos', plan: '8x Month', since: '2023-08-15' },
      { name: 'Pedro Costa', plan: 'Unlimited', since: '2023-12-01' }
    ]
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const },
      vacation: { label: 'Em Férias', variant: 'secondary' as const },
      absent: { label: 'Ausente', variant: 'outline' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
  };

  const renderPaymentInfo = () => {
    switch (trainerData.paymentType) {
      case 'fixed':
        return `€${trainerData.monthlyPay}/mês`;
      case 'per_class':
        return `€${trainerData.payPerClass}/aula`;
      case 'percentage':
        return `${trainerData.percentage}% receita`;
      default:
        return 'N/A';
    }
  };

  const statusBadge = getStatusBadge(trainerData.status);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Perfil do Trainer</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Header Info */}
        <div className="text-center mb-6">
          <Avatar className="h-20 w-20 mx-auto mb-3">
            <AvatarImage src={trainerData.avatar} alt={trainerData.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
              {trainerData.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-semibold text-lg">{trainerData.name}</h3>
          
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Badge variant={statusBadge.variant}>
              {statusBadge.label}
            </Badge>
            <div className="flex items-center text-sm">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{trainerData.rating}</span>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="overview">Info</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="athletes">Atletas</TabsTrigger>
            <TabsTrigger value="schedule">Horários</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{trainerData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{trainerData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{trainerData.address}, {trainerData.city}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Trainer desde {new Date(trainerData.joinDate).toLocaleDateString('pt-PT')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span>Remuneração: {renderPaymentInfo()}</span>
              </div>
            </div>

            {/* Specialties */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-sm mb-2">Especialidades</h4>
              <div className="flex flex-wrap gap-1">
                {trainerData.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-sm mb-2">Certificações</h4>
              <div className="space-y-2">
                {trainerData.certifications.map((cert: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Award className="h-3 w-3 text-blue-600" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            {trainerData.bio && (
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-sm mb-2">Biografia</h4>
                <p className="text-sm text-muted-foreground">{trainerData.bio}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="performance" className="space-y-4 mt-4">
            <h4 className="font-medium text-sm">Métricas de Performance</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-semibold">{trainerData.performance.avgRating}</span>
                </div>
                <p className="text-xs text-muted-foreground">Rating Médio</p>
                <p className="text-xs text-muted-foreground">
                  {trainerData.performance.totalRatings} avaliações
                </p>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-center space-x-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="font-semibold">{trainerData.performance.punctuality}%</span>
                </div>
                <p className="text-xs text-muted-foreground">Pontualidade</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-sm mb-2">Últimas Aulas</h4>
              {trainerData.recentClasses.map((classItem: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 border border-border rounded text-sm mb-2">
                  <div>
                    <p className="font-medium">{classItem.class}</p>
                    <p className="text-muted-foreground text-xs">
                      {classItem.students} participantes
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(classItem.date).toLocaleDateString('pt-PT')}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="athletes" className="space-y-3 mt-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">Atletas Designados</h4>
              <Badge variant="secondary">{trainerData.assignedAthletes}</Badge>
            </div>
            
            {trainerData.athletes.map((athlete: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 border border-border rounded text-sm">
                <div>
                  <p className="font-medium">{athlete.name}</p>
                  <p className="text-muted-foreground text-xs">{athlete.plan}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Desde {new Date(athlete.since).toLocaleDateString('pt-PT')}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-3 mt-4">
            <h4 className="font-medium text-sm">Disponibilidade</h4>
            
            <div className="text-sm text-muted-foreground">
              <p><strong>Horário:</strong> {trainerData.availability}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-sm mb-2">Próximas Aulas</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border border-border rounded text-sm">
                  <div>
                    <p className="font-medium">CrossFit WOD</p>
                    <p className="text-muted-foreground text-xs">Hoje, 18:00</p>
                  </div>
                  <Badge variant="outline">12/15 inscritos</Badge>
                </div>
                
                <div className="flex items-center justify-between p-2 border border-border rounded text-sm">
                  <div>
                    <p className="font-medium">Olympic Lifting</p>
                    <p className="text-muted-foreground text-xs">Amanhã, 19:00</p>
                  </div>
                  <Badge variant="outline">6/10 inscritos</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="flex space-x-2 mt-6 pt-6 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Mensagem
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Calendar className="h-4 w-4 mr-2" />
            Ver Agenda
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
