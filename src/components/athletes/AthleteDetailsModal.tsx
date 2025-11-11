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
  X, 
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
  Trash2,
  Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import { CheckInDialog } from './CheckInDialog';
import { BlockAthleteDialog } from './BlockAthleteDialog';
import { PhysicalAssessmentModal } from './PhysicalAssessmentModal';
import { WorkoutAssignmentDialog } from './WorkoutAssignmentDialog';
import { AthleteWorkoutHistory } from './AthleteWorkoutHistory';
import { AthleteNutritionPlans } from './AthleteNutritionPlans';

interface AthleteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  athlete: any;
  onEdit: () => void;
  onDelete?: (athlete: any) => void;
}

export const AthleteDetailsModal: React.FC<AthleteDetailsModalProps> = ({
  isOpen,
  onClose,
  athlete,
  onEdit,
  onDelete,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [checkInDialogOpen, setCheckInDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [physicalAssessmentOpen, setPhysicalAssessmentOpen] = useState(false);
  const [workoutAssignmentOpen, setWorkoutAssignmentOpen] = useState(false);

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

  const statusBadge = getStatusBadge(athlete.status);

  // Dados reais virão do banco de dados via props
  const athleteHistory: any[] = [];
  const paymentHistory: any[] = [];

  const totalPaid = 0;
  const pendingPayments: any[] = [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalhes do Atleta</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header do Atleta */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={athlete.profile_photo} alt={athlete.name} />
              <AvatarFallback className="bg-cagio-green-light text-cagio-green-dark text-xl">
                {athlete.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                {athlete.name}
              </h2>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant={statusBadge.variant}>
                  {statusBadge.label}
                </Badge>
                <Badge variant="outline">{athlete.plan || 'Sem plano'}</Badge>
                {athlete.tags && athlete.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <div className="flex flex-col gap-1 mt-3 text-sm text-muted-foreground">
                {athlete.email && (
                  <span className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    {athlete.email}
                  </span>
                )}
                {athlete.phone && (
                  <span className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {athlete.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button onClick={() => setCheckInDialogOpen(true)} variant="outline" size="sm">
              <Clock className="h-4 w-4 mr-2" />
              Check-in
            </Button>
            
            <Button onClick={() => setWorkoutAssignmentOpen(true)} variant="outline" size="sm" style={{ borderColor: '#aeca12', color: '#aeca12' }}>
              <Trophy className="h-4 w-4 mr-2" />
              Atribuir Treino
            </Button>
            
            <Button onClick={() => setPhysicalAssessmentOpen(true)} variant="outline" size="sm">
              <Activity className="h-4 w-4 mr-2" />
              Avaliação Física
            </Button>
            
            <Button onClick={() => setBlockDialogOpen(true)} variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
              Bloquear Acesso
            </Button>
            
            <Button onClick={onEdit} className="bg-cagio-green hover:bg-cagio-green-dark text-white" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
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

          <Separator />

          {/* Tabs de Conteúdo */}
          <Tabs defaultValue="overview" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Resumo</TabsTrigger>
              <TabsTrigger value="workouts">Treinos</TabsTrigger>
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
                    <div className="grid grid-cols-2 gap-4">
                      {athlete.birth_date && (
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground mb-1">Data de Nascimento</span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                            {new Date(athlete.birth_date).toLocaleDateString('pt-PT')}
                          </span>
                        </div>
                      )}
                      {athlete.gender && (
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground mb-1">Género</span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-muted-foreground" />
                            {athlete.gender === 'male' ? 'Masculino' : athlete.gender === 'female' ? 'Feminino' : 'Outro'}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {athlete.address && (
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground mb-1">Morada</span>
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {athlete.address}
                        </span>
                      </div>
                    )}

                    <Separator className="my-3" />
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Documentos (Portugal)</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {athlete.nif && (
                          <div className="flex flex-col p-2 bg-muted/50 rounded">
                            <span className="text-xs text-muted-foreground">NIF</span>
                            <span className="font-medium">{athlete.nif}</span>
                          </div>
                        )}
                        {athlete.niss && (
                          <div className="flex flex-col p-2 bg-muted/50 rounded">
                            <span className="text-xs text-muted-foreground">NISS</span>
                            <span className="font-medium">{athlete.niss}</span>
                          </div>
                        )}
                        {athlete.cc_number && (
                          <div className="flex flex-col p-2 bg-muted/50 rounded">
                            <span className="text-xs text-muted-foreground">Cartão de Cidadão</span>
                            <span className="font-medium">{athlete.cc_number}</span>
                          </div>
                        )}
                        {athlete.cc_expiry_date && (
                          <div className="flex flex-col p-2 bg-muted/50 rounded">
                            <span className="text-xs text-muted-foreground">Validade CC</span>
                            <span className="font-medium">{new Date(athlete.cc_expiry_date).toLocaleDateString('pt-PT')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Plano e Treinamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Plano:</span>
                      <Badge variant="outline">{athlete.plan || 'Sem plano'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Personal Trainer:</span>
                      <span className="font-medium">{athlete.trainer || 'Não atribuído'}</span>
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
                      <span className="font-semibold text-cagio-green">
                        €{athlete.monthly_fee || 0}/mês
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Estatísticas - Dados virão do banco de dados */}
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Aulas este mês</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">0%</p>
                    <p className="text-sm text-muted-foreground">Taxa presença</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Euro className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold">€0</p>
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

            {/* Tab Treinos */}
            <TabsContent value="workouts" className="space-y-6">
              <AthleteWorkoutHistory athleteId={athlete.id} />
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
                  {documents.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum documento anexado ainda
                    </p>
                  ) : (
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
                  )}
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
                  {athleteHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhuma atividade registada ainda
                    </p>
                  ) : (
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
                  )}
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
                  {paymentHistory.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      Nenhum pagamento registado ainda
                    </p>
                  ) : (
                    <>
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
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="nutrition" className="space-y-4">
              <AthleteNutritionPlans 
                athleteId={athlete.id}
                athleteName={athlete.name}
              />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>

      <CheckInDialog
        isOpen={checkInDialogOpen}
        onClose={() => setCheckInDialogOpen(false)}
        athlete={athlete}
        onSuccess={onClose}
      />

      <BlockAthleteDialog
        isOpen={blockDialogOpen}
        onClose={() => setBlockDialogOpen(false)}
        athlete={athlete}
        onSuccess={onClose}
      />

      <PhysicalAssessmentModal
        isOpen={physicalAssessmentOpen}
        onClose={() => setPhysicalAssessmentOpen(false)}
        athlete={athlete}
        onSuccess={() => {
          setPhysicalAssessmentOpen(false);
          toast.success('Avaliação física salva com sucesso!');
        }}
      />

      <WorkoutAssignmentDialog
        open={workoutAssignmentOpen}
        onOpenChange={setWorkoutAssignmentOpen}
        athleteId={athlete.id}
      />
    </Dialog>
  );
};
