
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Edit, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  Star,
  Clock,
  Euro,
  Award,
  Target,
  Users
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Ativo', variant: 'default' as const },
      vacation: { label: 'Em Férias', variant: 'secondary' as const },
      absent: { label: 'Ausente', variant: 'outline' as const }
    };
    return config[status as keyof typeof config] || config.active;
  };

  const statusBadge = getStatusBadge(trainer.status);

  const getAvailableDays = () => {
    if (!trainer.availability) return [];
    
    const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    return dayKeys
      .filter(key => trainer.availability[key]?.available)
      .map((key, index) => ({
        day: days[dayKeys.indexOf(key)],
        start: trainer.availability[key].start,
        end: trainer.availability[key].end
      }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Perfil do Trainer</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Header do Trainer */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={trainer.avatar} alt={trainer.name} />
            <AvatarFallback className="bg-purple-100 text-purple-600 text-lg">
              {trainer.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground">
              {trainer.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={statusBadge.variant}>
                {statusBadge.label}
              </Badge>
              {trainer.experience && (
                <Badge variant="outline">{trainer.experience} anos exp.</Badge>
              )}
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{trainer.rating || '4.8'}</span>
              <span className="text-sm text-muted-foreground">
                ({trainer.reviews || 24} avaliações)
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Informações de Contacto */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground">Contacto</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{trainer.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{trainer.phone}</span>
            </div>
            {trainer.address && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{trainer.address}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Dados Profissionais */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground">Dados Profissionais</h4>
          <div className="space-y-2">
            {trainer.hourlyRate && (
              <div className="flex items-center justify-between">
                <span className="text-sm flex items-center">
                  <Euro className="h-3 w-3 mr-1" />
                  Taxa Horária:
                </span>
                <span className="text-sm font-medium text-green-600">
                  €{trainer.hourlyRate}/hora
                </span>
              </div>
            )}
            {trainer.experience && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Experiência:</span>
                <span className="text-sm font-medium">{trainer.experience} anos</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm">Trainer desde:</span>
              <span className="text-sm">
                {trainer.joinDate ? new Date(trainer.joinDate).toLocaleDateString() : 'Jan 2024'}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Especialidades */}
        {trainer.specialties && trainer.specialties.length > 0 && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Especialidades
              </h4>
              <div className="flex flex-wrap gap-2">
                {trainer.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Certificações */}
        {trainer.certifications && trainer.certifications.length > 0 && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Certificações
              </h4>
              <div className="space-y-2">
                {trainer.certifications.map((cert: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <Award className="h-3 w-3 text-blue-600" />
                    <span>{cert}</span>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Disponibilidade */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Disponibilidade
          </h4>
          <div className="space-y-1">
            {getAvailableDays().map((day, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span>{day.day}</span>
                <span className="text-muted-foreground">
                  {day.start} - {day.end}
                </span>
              </div>
            ))}
            {getAvailableDays().length === 0 && (
              <p className="text-sm text-muted-foreground">
                Disponibilidade não configurada
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Biografia */}
        {trainer.bio && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Biografia</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {trainer.bio}
              </p>
            </div>
            <Separator />
          </>
        )}

        {/* Estatísticas */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground">Atividade</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm font-medium">{trainer.activeClients || 15}</p>
              <p className="text-xs text-muted-foreground">Clientes ativos</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium">{trainer.classesThisMonth || 42}</p>
              <p className="text-xs text-muted-foreground">Aulas este mês</p>
            </div>
          </div>
        </div>

        {/* Notas Internas */}
        {trainer.notes && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Notas Internas</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {trainer.notes}
              </p>
            </div>
          </>
        )}

        {/* Botão Editar */}
        <Button onClick={onEdit} className="w-full">
          <Edit className="h-4 w-4 mr-2" />
          Editar Trainer
        </Button>
      </CardContent>
    </Card>
  );
};
