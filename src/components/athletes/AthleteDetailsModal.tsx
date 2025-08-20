import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Edit, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  User, 
  Heart,
  Euro,
  Clock,
  Activity,
  Upload,
  FileText,
  Download,
  History,
  CreditCard,
  Plus,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { type Athlete } from '@/hooks/useAthletes';

interface AthleteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: Athlete | null;
  onEdit: () => void;
  onDelete?: (athlete: Athlete) => void;
}

export const AthleteDetailsModal: React.FC<AthleteDetailsModalProps> = ({
  isOpen,
  onClose,
  athlete,
  onEdit,
  onDelete,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Contrato.pdf', size: '2.1 MB', uploaded: '2024-01-15', uploadedBy: 'Admin' },
    { id: 2, name: 'Atestado_Medico.jpg', size: '1.8 MB', uploaded: '2024-01-20', uploadedBy: 'Carlos Santos' }
  ]);

  if (!athlete) return null;

  const getStatusBadge = (status: string) => {
    const config = {
      active: { label: 'Ativo', variant: 'default' as const },
      inactive: { label: 'Inativo', variant: 'secondary' as const },
      frozen: { label: 'Congelado', variant: 'outline' as const },
      pending: { label: 'Pendente', variant: 'destructive' as const }
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].size > 5 * 1024 * 1024) {
          toast.error(`O arquivo ${files[i].name} excede o limite de 5MB`);
          return;
        }
      }
      setSelectedFiles(files);
      // Simular upload
      Array.from(files).forEach(file => {
        const newDoc = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          uploaded: new Date().toLocaleDateString('pt-PT'),
          uploadedBy: 'Utilizador Atual'
        };
        setDocuments(prev => [...prev, newDoc]);
      });
      toast.success('Documentos enviados com sucesso!');
      console.log('Uploading files:', files);
    }
  };

  const handleDeleteDocument = (docId: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    toast.success('Documento excluído com sucesso');
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(athlete);
      onClose();
    }
  };

  const handleCreateNutritionalPlan = () => {
    toast.success('Redirecionando para criação de plano nutricional...');
    // Aqui implementaria a navegação para criação de plano nutricional
  };

  const statusBadge = getStatusBadge(athlete.status || 'active');

  // Histórico de atividades do atleta (expandido)
  const athleteHistory = [
    { date: '2024-01-15', action: 'Cadastro realizado', user: 'Admin', details: 'Atleta registrado no sistema' },
    { date: '2024-01-20', action: 'Plano atualizado para Premium', user: 'Carlos Santos', details: 'Mudança de Básico para Premium' },
    { date: '2024-02-01', action: 'Dados pessoais atualizados', user: 'Admin', details: 'Telefone e endereço alterados' },
    { date: '2024-02-15', action: 'Documento anexado', user: 'Ana Silva', details: 'Contrato de adesão enviado' },
    { date: '2024-03-01', action: 'Pagamento realizado', user: 'Sistema', details: 'Mensalidade de Março paga' }
  ];

  // Histórico de pagamentos baseado no plano (com parcelas)
  const paymentHistory = [
    { 
      id: 1,
      date: '2024-03-01', 
      amount: 80, 
      status: 'Pago', 
      method: 'Cartão',
      planName: 'Premium',
      installment: '3/12',
      dueDate: '2024-03-01'
    },
    { 
      id: 2,
      date: '2024-02-01', 
      amount: 80, 
      status: 'Pago', 
      method: 'Transferência',
      planName: 'Premium',
      installment: '2/12',
      dueDate: '2024-02-01'
    },
    { 
      id: 3,
      date: '2024-01-01', 
      amount: 80, 
      status: 'Pago', 
      method: 'Cartão',
      planName: 'Premium',
      installment: '1/12',
      dueDate: '2024-01-01'
    },
    { 
      id: 4,
      date: '', 
      amount: 80, 
      status: 'Pendente', 
      method: 'Cartão',
      planName: 'Premium',
      installment: '4/12',
      dueDate: '2024-04-01'
    },
    { 
      id: 5,
      date: '', 
      amount: 80, 
      status: 'Pendente', 
      method: 'Cartão',
      planName: 'Premium',
      installment: '5/12',
      dueDate: '2024-05-01'
    }
  ];

  const totalPaid = paymentHistory.filter(p => p.status === 'Pago').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = paymentHistory.filter(p => p.status === 'Pendente');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Detalhes do Atleta</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header do Atleta */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={athlete.profile_photo} alt={athlete.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xl">
                {athlete.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                {athlete.name}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant={statusBadge.variant}>
                  {statusBadge.label}
                </Badge>
                {athlete.plan && <Badge variant="outline">{athlete.plan}</Badge>}
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                {athlete.email && (
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    {athlete.email}
                  </span>
                )}
                {athlete.phone && (
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    {athlete.phone}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button onClick={onEdit} className="bg-emerald-600 hover:bg-emerald-700">
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o atleta <strong>{athlete.name}</strong>? 
                      Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Excluir Atleta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <Separator />

          {/* Tabs de Conteúdo */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Resumo</TabsTrigger>
              <TabsTrigger value="documents">Documentos</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
              <TabsTrigger value="payments">Pagamentos</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrição</TabsTrigger>
            </TabsList>

            {/* Tab Resumo */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações Pessoais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {athlete.birth_date && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{new Date(athlete.birth_date).toLocaleDateString('pt-PT')}</span>
                      </div>
                    )}
                    {athlete.gender && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{athlete.gender === 'male' ? 'Masculino' : athlete.gender === 'female' ? 'Feminino' : 'Outro'}</span>
                      </div>
                    )}
                    {athlete.address && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{athlete.address}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plano e Treinamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Plano:</span>
                      <Badge variant="outline">{athlete.plan}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Personal Trainer:</span>
                      <span className="font-medium">{athlete.trainer}</span>
                    </div>
                    {athlete.group && (
                      <div className="flex items-center justify-between">
                        <span>Grupo:</span>
                        <span className="font-medium">{athlete.group}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Euro className="h-3 w-3 mr-1" />
                        Mensalidade:
                      </span>
                      <span className="font-semibold text-emerald-600">
                        €{athlete.monthly_fee}/mês
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">28</p>
                    <p className="text-sm text-muted-foreground">Aulas este mês</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">92%</p>
                    <p className="text-sm text-muted-foreground">Taxa presença</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Euro className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">€{totalPaid}</p>
                    <p className="text-sm text-muted-foreground">Total pago</p>
                  </CardContent>
                </Card>
              </div>

              {/* Informações Médicas e Objetivos */}
              {athlete.medical_notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Heart className="h-5 w-5 mr-2" />
                      Informações de Saúde
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{athlete.medical_notes}</p>
                  </CardContent>
                </Card>
              )}

              {athlete.goals && athlete.goals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Objetivos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {athlete.goals.map((goal: string, index: number) => (
                        <Badge key={index} variant="secondary">{goal}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab Documentos */}
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upload de Documentos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Clique para selecionar ou arraste arquivos aqui
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Máximo 5MB por arquivo (PDF, JPG, PNG, DOC)
                      </p>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <Button variant="outline" size="sm" asChild>
                          <span>Selecionar Arquivos</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documentos Anexados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium">{doc.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {doc.size} • Enviado em {doc.uploaded} por {doc.uploadedBy}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
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
                                  Tem certeza que deseja excluir o documento <strong>{doc.name}</strong>?
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
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <History className="h-5 w-5 mr-2" />
                    Histórico de Atividades
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {athleteHistory.map((entry, index) => (
                      <div key={index} className="flex items-start space-x-4 pb-4 border-b last:border-b-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium">{entry.action}</p>
                          <p className="text-sm text-muted-foreground mt-1">{entry.details}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <span>{new Date(entry.date).toLocaleDateString('pt-PT')}</span>
                            <span>•</span>
                            <span>por {entry.user}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Histórico de Pagamentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Resumo de pagamentos pendentes */}
                  {pendingPayments.length > 0 && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                      <h4 className="font-medium text-orange-800 mb-2">
                        Parcelas Pendentes ({pendingPayments.length})
                      </h4>
                      <div className="space-y-2">
                        {pendingPayments.map((payment) => (
                          <div key={payment.id} className="flex justify-between items-center text-sm">
                            <span>Parcela {payment.installment} - {payment.planName}</span>
                            <div className="flex items-center space-x-2">
                              <span>Vencimento: {new Date(payment.dueDate).toLocaleDateString('pt-PT')}</span>
                              <Badge variant="destructive">€{payment.amount}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Euro className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="font-medium">
                              €{payment.amount} - {payment.planName} (Parcela {payment.installment})
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {payment.date ? new Date(payment.date).toLocaleDateString('pt-PT') : `Vencimento: ${new Date(payment.dueDate).toLocaleDateString('pt-PT')}`} • {payment.method}
                            </p>
                          </div>
                        </div>
                        <Badge variant={payment.status === 'Pago' ? 'default' : 'destructive'}>
                          {payment.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Pago:</span>
                        <span className="text-xl font-bold text-green-600">€{totalPaid}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Pendente:</span>
                        <span className="text-xl font-bold text-orange-600">
                          €{pendingPayments.reduce((sum, p) => sum + p.amount, 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Plano Nutricional</CardTitle>
                </CardHeader>
                <CardContent>
                  {athlete.nutrition_preview ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm">{athlete.nutrition_preview}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1">
                          <FileText className="h-4 w-4 mr-2" />
                          Ver Plano Completo
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar Plano
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">
                        Este atleta ainda não possui um plano nutricional
                      </p>
                      <Button 
                        onClick={handleCreateNutritionalPlan}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Criar Plano Nutricional
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
