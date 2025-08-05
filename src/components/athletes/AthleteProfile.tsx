
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
  User,
  FileText,
  Activity,
  MessageCircle
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview');

  // Mock additional data
  const athleteData = {
    ...athlete,
    address: 'Rua da República, 123, 4º Esq.',
    city: 'Porto',
    postalCode: '4000-123',
    birthDate: '1990-05-15',
    joinDate: '2024-01-15',
    emergencyContact: 'Ana Silva',
    emergencyPhone: '+351 912 345 678',
    medicalConditions: 'Nenhuma',
    goals: 'Perder 5kg, aumentar força',
    notes: 'Muito dedicado, chega sempre cedo',
    documents: [
      { name: 'Termo Responsabilidade', status: 'approved', date: '2024-01-15' },
      { name: 'Questionário PAR-Q', status: 'approved', date: '2024-01-15' },
      { name: 'RGPD Consent', status: 'approved', date: '2024-01-15' }
    ],
    attendance: [
      { date: '2024-03-01', class: 'CrossFit WOD', trainer: 'Carlos Santos' },
      { date: '2024-02-28', class: 'Functional Training', trainer: 'Ana Costa' },
      { date: '2024-02-26', class: 'CrossFit WOD', trainer: 'Carlos Santos' }
    ],
    payments: [
      { date: '2024-03-01', amount: 75, status: 'paid', method: 'Débito Direto' },
      { date: '2024-02-01', amount: 75, status: 'paid', method: 'Débito Direto' },
      { date: '2024-01-15', amount: 75, status: 'paid', method: 'Transferência' }
    ]
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'default' as const },
      inactive: { label: 'Inativo', variant: 'secondary' as const },
      frozen: { label: 'Congelado', variant: 'outline' as const },
      pending: { label: 'Pendente', variant: 'destructive' as const }
    };
    
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const getPaymentBadge = (status: string) => {
    return status === 'paid' ? 
      { label: 'Pago', variant: 'default' as const } : 
      { label: 'Pendente', variant: 'destructive' as const };
  };

  const statusBadge = getStatusBadge(athleteData.status);
  const paymentBadge = getPaymentBadge(athleteData.paymentStatus);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Perfil do Atleta</CardTitle>
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
            <AvatarImage src={athleteData.avatar} alt={athleteData.name} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
              {athleteData.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <h3 className="font-semibold text-lg">{athleteData.name}</h3>
          
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Badge variant={statusBadge.variant}>
              {statusBadge.label}
            </Badge>
            <Badge variant={paymentBadge.variant}>
              {paymentBadge.label}
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="overview">Info</TabsTrigger>
            <TabsTrigger value="attendance">Aulas</TabsTrigger>
            <TabsTrigger value="payments">€ Pag.</TabsTrigger>
            <TabsTrigger value="documents">Docs</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{athleteData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{athleteData.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{athleteData.address}, {athleteData.city}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Membro desde {new Date(athleteData.joinDate).toLocaleDateString('pt-PT')}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Trainer: {athleteData.trainer}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Euro className="h-4 w-4 text-muted-foreground" />
                <span>Plano: {athleteData.plan} (€{athleteData.monthlyFee}/mês)</span>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-sm mb-2">Contacto de Emergência</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>{athleteData.emergencyContact}</p>
                <p>{athleteData.emergencyPhone}</p>
              </div>
            </div>

            {/* Medical & Goals */}
            {athleteData.goals && (
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-sm mb-2">Objetivos</h4>
                <p className="text-sm text-muted-foreground">{athleteData.goals}</p>
              </div>
            )}

            {athleteData.notes && (
              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-sm mb-2">Notas</h4>
                <p className="text-sm text-muted-foreground">{athleteData.notes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="attendance" className="space-y-3 mt-4">
            <h4 className="font-medium text-sm">Últimas Aulas</h4>
            {athleteData.attendance.map((record: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 border border-border rounded text-sm">
                <div>
                  <p className="font-medium">{record.class}</p>
                  <p className="text-muted-foreground text-xs">{record.trainer}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(record.date).toLocaleDateString('pt-PT')}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="payments" className="space-y-3 mt-4">
            <h4 className="font-medium text-sm">Histórico de Pagamentos</h4>
            {athleteData.payments.map((payment: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 border border-border rounded text-sm">
                <div>
                  <p className="font-medium">€{payment.amount}</p>
                  <p className="text-muted-foreground text-xs">{payment.method}</p>
                </div>
                <div className="text-right">
                  <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'} className="text-xs">
                    {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(payment.date).toLocaleDateString('pt-PT')}
                  </p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="documents" className="space-y-3 mt-4">
            <h4 className="font-medium text-sm">Documentos</h4>
            {athleteData.documents.map((doc: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 border border-border rounded text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>{doc.name}</span>
                </div>
                <div className="text-right">
                  <Badge variant={doc.status === 'approved' ? 'default' : 'destructive'} className="text-xs">
                    {doc.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="flex space-x-2 mt-6 pt-6 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle className="h-4 w-4 mr-2" />
            Mensagem
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Activity className="h-4 w-4 mr-2" />
            Nova Aula
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
