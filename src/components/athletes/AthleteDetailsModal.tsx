import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  AlertCircle,
  FileText,
  CreditCard,
  Activity,
  Plus,
  Download,
  X,
  Heart
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import { type Athlete } from '@/hooks/useAthletes';
import { toast } from 'sonner';

interface AthleteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: Athlete | null;
  onEdit: () => void;
  onDelete: (athlete: Athlete) => void;
}

export const AthleteDetailsModal: React.FC<AthleteDetailsModalProps> = ({
  isOpen,
  onClose,
  athlete,
  onEdit,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState('profile');

  if (!athlete) return null;

  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'inactive':
        return <Badge variant="destructive">Inativo</Badge>;
      case 'frozen':
        return <Badge className="bg-orange-100 text-orange-800">Congelado</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pendente</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock data para demonstração
  const mockDocuments = [
    { id: 1, name: 'Atestado Médico.pdf', type: 'medical', uploadDate: '2024-01-15', size: '2.3 MB' },
    { id: 2, name: 'Termo de Responsabilidade.pdf', type: 'legal', uploadDate: '2024-01-10', size: '1.8 MB' },
    { id: 3, name: 'Foto de Identificação.jpg', type: 'photo', uploadDate: '2024-01-05', size: '856 KB' }
  ];

  const mockPaymentHistory = [
    { id: 1, date: '2024-01-15', amount: 80, status: 'paid', plan: 'Premium', method: 'Cartão', installment: '1/12' },
    { id: 2, date: '2024-02-15', amount: 80, status: 'pending', plan: 'Premium', method: 'Cartão', installment: '2/12' },
    { id: 3, date: '2024-03-15', amount: 80, status: 'pending', plan: 'Premium', method: 'Cartão', installment: '3/12' }
  ];

  const mockActivityHistory = [
    { id: 1, date: '2024-01-20T10:30:00', action: 'Dados atualizados', user: 'João Admin', details: 'Telefone alterado' },
    { id: 2, date: '2024-01-15T14:15:00', action: 'Plano alterado', user: 'Maria Gestora', details: 'De Básico para Premium' },
    { id: 3, date: '2024-01-10T09:00:00', action: 'Atleta cadastrado', user: 'João Admin', details: 'Cadastro inicial' }
  ];

  const handleDeleteDocument = (docId: number) => {
    toast.success('Documento excluído com sucesso');
  };

  const handleCreateNutritionalPlan = () => {
    toast.success('Redirecionando para criação de plano nutricional...');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${athlete.name}`} />
                <AvatarFallback className="bg-[#bed700]/10 text-[#bed700] font-semibold text-lg">
                  {getInitials(athlete.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{athlete.name}</DialogTitle>
                <div className="flex items-center space-x-3 mt-2">
                  {getStatusBadge(athlete.status)}
                  <span className="text-sm text-muted-foreground">
                    Membro desde {athlete.created_at ? format(parseISO(athlete.created_at), 'MMMM yyyy', { locale: pt }) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                onClick={onEdit}
                className="bg-[#bed700] hover:bg-[#a5c400] text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o atleta <strong>{athlete.name}</strong>? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => onDelete(athlete)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="flex border-b">
          {[
            { id: 'profile', label: 'Perfil', icon: User },
            { id: 'documents', label: 'Documentos', icon: FileText },
            { id: 'payments', label: 'Pagamentos', icon: CreditCard },
            { id: 'history', label: 'Histórico', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#bed700] text-[#bed700]'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informações Pessoais */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {athlete.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{athlete.email}</span>
                    </div>
                  )}
                  
                  {athlete.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{athlete.phone}</span>
                    </div>
                  )}
                  
                  {athlete.birth_date && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{format(parseISO(athlete.birth_date), 'dd/MM/yyyy', { locale: pt })}</span>
                    </div>
                  )}

                  {athlete.gender && (
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{athlete.gender === 'male' ? 'Masculino' : athlete.gender === 'female' ? 'Feminino' : 'Outro'}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contatos de Emergência */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Contato de Emergência
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {athlete.emergency_contact_name ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{athlete.emergency_contact_name}</span>
                      </div>
                      {athlete.emergency_contact_phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span>{athlete.emergency_contact_phone}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted-foreground">Nenhum contato de emergência cadastrado</p>
                  )}
                </CardContent>
              </Card>

              {/* Observações Médicas */}
              {athlete.medical_notes && (
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Observações Médicas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{athlete.medical_notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Plano Nutricional */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Plano Nutricional
                    </span>
                    <Button 
                      onClick={handleCreateNutritionalPlan}
                      className="bg-[#bed700] hover:bg-[#a5c400] text-white"
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Plano
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Nenhum plano nutricional ativo</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Documentos Anexados</h3>
                <Button className="bg-[#bed700] hover:bg-[#a5c400] text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Documento
                </Button>
              </div>

              {mockDocuments.map((doc) => (
                <Card key={doc.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h4 className="font-medium">{doc.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {doc.size} • Enviado em {format(parseISO(doc.uploadDate), 'dd/MM/yyyy', { locale: pt })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Excluir Documento</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir o documento "{doc.name}"?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Histórico de Pagamentos</h3>
              
              {mockPaymentHistory.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <h4 className="font-medium">{payment.plan} - {payment.installment}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(parseISO(payment.date), 'dd/MM/yyyy', { locale: pt })} • {payment.method}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold">€{payment.amount}</p>
                      <Badge 
                        className={payment.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                      >
                        {payment.status === 'paid' ? 'Pago' : 'Pendente'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Histórico de Atividades</h3>
              
              {mockActivityHistory.map((activity) => (
                <Card key={activity.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{activity.action}</h4>
                      <span className="text-sm text-muted-foreground">
                        {format(parseISO(activity.date), 'dd/MM/yyyy HH:mm', { locale: pt })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Por: {activity.user} • {activity.details}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
