
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
  Users,
  Percent,
  DollarSign,
  Calendar1,
  Timer,
  Key
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

  const getPaymentTypeLabel = (type: string) => {
    const types = {
      hourly: 'Por Hora',
      monthly: 'Mensalidade',
      class: 'Por Aula',
      percentage: 'Percentagem'
    };
    return types[type as keyof typeof types] || 'Não definido';
  };

  const getPaymentValue = () => {
    switch (trainer.paymentType) {
      case 'hourly':
        return `€${trainer.hourlyRate}/hora`;
      case 'monthly':
        return `€${trainer.monthlyRate}/mês`;
      case 'class':
        return `€${trainer.classRate}/aula`;
      case 'percentage':
        return `${trainer.percentageRate}%`;
      default:
        return 'Não definido';
    }
  };

  const getPaymentIcon = () => {
    switch (trainer.paymentType) {
      case 'hourly':
        return Timer;
      case 'monthly':
        return Calendar1;
      case 'class':
        return DollarSign;
      case 'percentage':
        return Percent;
      default:
        return Euro;
    }
  };

  const statusBadge = getStatusBadge(trainer.status);
  const PaymentIcon = getPaymentIcon();

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

  // Mock data para atletas vinculados
  const linkedAthletesData = [
    { id: '1', name: 'Ana Silva', email: 'ana@email.com' },
    { id: '2', name: 'João Santos', email: 'joao@email.com' },
    { id: '3', name: 'Maria Costa', email: 'maria@email.com' }
  ].filter(athlete => trainer.linkedAthletes?.includes(athlete.id));

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

        {/* Sistema de Acesso */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground flex items-center">
            <Key className="h-4 w-4 mr-1" />
            Sistema de Acesso
          </h4>
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm">Status de acesso:</span>
              <Badge variant="default">Ativo</Badge>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm">Último login:</span>
              <span className="text-sm text-muted-foreground">
                {trainer.lastLogin || 'Nunca'}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Sistema de Pagamento */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground flex items-center">
            <PaymentIcon className="h-4 w-4 mr-1" />
            Sistema de Pagamento
          </h4>
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Tipo de Pagamento:</span>
              <Badge variant="secondary">{getPaymentTypeLabel(trainer.paymentType)}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Valor:</span>
              <span className="text-lg font-semibold text-cagio-green">
                {getPaymentValue()}
              </span>
            </div>
            {trainer.paymentType === 'percentage' && (
              <p className="text-xs text-muted-foreground mt-2">
                Percentagem sobre a receita das aulas/treinos
              </p>
            )}
          </div>
        </div>

        <Separator />

        {/* Categorias de Exercícios */}
        {trainer.exerciseCategories && trainer.exerciseCategories.length > 0 && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground flex items-center">
                <Target className="h-4 w-4 mr-1" />
                Categorias de Exercícios
              </h4>
              <div className="flex flex-wrap gap-2">
                {trainer.exerciseCategories.map((category: string, index: number) => (
                  <Badge key={index} variant="default" className="bg-cagio-green hover:bg-cagio-green/90">
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Atletas Vinculados */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground flex items-center">
            <Users className="h-4 w-4 mr-1" />
            Atletas Vinculados ({linkedAthletesData.length})
          </h4>
          {linkedAthletesData.length > 0 ? (
            <div className="space-y-2">
              {linkedAthletesData.map((athlete) => (
                <div key={athlete.id} className="flex items-center space-x-3 p-2 bg-muted rounded-lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                      {athlete.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{athlete.name}</p>
                    <p className="text-xs text-muted-foreground">{athlete.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum atleta vinculado
            </p>
          )}
        </div>

        <Separator />

        {/* Especialidades */}
        {trainer.specialties && trainer.specialties.length > 0 && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Especialidades</h4>
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
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm font-medium">{linkedAthletesData.length}</p>
              <p className="text-xs text-muted-foreground">Atletas</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium">{trainer.classesThisMonth || 42}</p>
              <p className="text-xs text-muted-foreground">Aulas/mês</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Euro className="h-4 w-4 text-cagio-green" />
              </div>
              <p className="text-sm font-medium">€{trainer.monthlyEarnings || 2400}</p>
              <p className="text-xs text-muted-foreground">Este mês</p>
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
