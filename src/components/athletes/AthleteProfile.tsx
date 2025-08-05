
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
  Heart, 
  Target,
  Euro,
  Clock,
  Activity
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AthleteProfileProps {
  athlete: any;
  onEdit: () => void;
  onClose: () => void;
}

export const AthleteProfile: React.FC<AthleteProfileProps> = ({
  athlete,
  onEdit,
  onClose,
}) => {
  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Ativo', variant: 'default' as const },
      inactive: { label: 'Inativo', variant: 'secondary' as const },
      frozen: { label: 'Congelado', variant: 'outline' as const },
      pending: { label: 'Pendente', variant: 'destructive' as const }
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const statusBadge = getStatusBadge(athlete.status);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Perfil do Atleta</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Header do Atleta */}
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={athlete.avatar} alt={athlete.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
              {athlete.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-foreground">
              {athlete.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={statusBadge.variant}>
                {statusBadge.label}
              </Badge>
              <Badge variant="outline">{athlete.plan}</Badge>
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
              <span>{athlete.email}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{athlete.phone}</span>
            </div>
            {athlete.address && (
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{athlete.address}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Dados Pessoais */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground">Dados Pessoais</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {athlete.dateOfBirth && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(athlete.dateOfBirth).toLocaleDateString()}</span>
              </div>
            )}
            {athlete.gender && (
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{athlete.gender === 'male' ? 'Masculino' : athlete.gender === 'female' ? 'Feminino' : 'Outro'}</span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Subscrição */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground">Subscrição</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Plano:</span>
              <Badge variant="outline">{athlete.plan}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Personal Trainer:</span>
              <span className="text-sm font-medium">{athlete.trainer}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm flex items-center">
                <Euro className="h-3 w-3 mr-1" />
                Mensalidade:
              </span>
              <span className="text-sm font-medium text-green-600">
                €{athlete.monthlyFee}/mês
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Membro desde:</span>
              <span className="text-sm">
                {new Date(athlete.joinDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contacto de Emergência */}
        {athlete.emergencyContact && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Emergência</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{athlete.emergencyContact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{athlete.emergencyPhone}</span>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Informações de Saúde */}
        {athlete.medicalConditions && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Saúde</h4>
              <div className="text-sm bg-muted p-3 rounded-md">
                <div className="flex items-start space-x-2">
                  <Heart className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{athlete.medicalConditions}</span>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Objetivos */}
        {athlete.goals && athlete.goals.length > 0 && (
          <>
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Objetivos</h4>
              <div className="flex flex-wrap gap-2">
                {athlete.goals.map((goal: string, index: number) => (
                  <div key={index} className="flex items-center space-x-1 text-sm">
                    <Target className="h-3 w-3 text-blue-600" />
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Estatísticas Rápidas */}
        <div className="space-y-3">
          <h4 className="font-medium text-muted-foreground">Atividade</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Activity className="h-4 w-4 text-blue-600" />
              </div>
              <p className="text-sm font-medium">28</p>
              <p className="text-xs text-muted-foreground">Aulas este mês</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Clock className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-medium">92%</p>
              <p className="text-xs text-muted-foreground">Taxa presença</p>
            </div>
          </div>
        </div>

        {/* Notas */}
        {athlete.notes && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium text-muted-foreground">Notas</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                {athlete.notes}
              </p>
            </div>
          </>
        )}

        {/* Botão Editar */}
        <Button onClick={onEdit} className="w-full">
          <Edit className="h-4 w-4 mr-2" />
          Editar Atleta
        </Button>
      </CardContent>
    </Card>
  );
};
