import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, Calendar, MapPin, DollarSign, Upload, Key, FileText, Activity } from 'lucide-react';
import { Staff } from '@/hooks/useStaff';
import { useRoles } from '@/hooks/useRoles';
import { StaffDocumentsSection } from './StaffDocumentsSection';
import { toast } from 'sonner';

interface StaffDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff;
  onSave: (staff: Staff) => void;
  onResetPassword?: (staffId: string, newBirthDate: string) => Promise<string | null>;
}

export const StaffDetailModal: React.FC<StaffDetailModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSave,
  onResetPassword
}) => {
  const { roles } = useRoles();
  const [formData, setFormData] = useState<Staff>(staff);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    setFormData(staff);
  }, [staff]);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  const handleResetPassword = async () => {
    if (!staff.id || !formData.birth_date) {
      toast.error('Data de nascimento é necessária para gerar nova senha');
      return;
    }

    const newPassword = await onResetPassword?.(staff.id, formData.birth_date);
    if (newPassword) {
      toast.success(`Nova senha gerada: ${newPassword}`, { duration: 10000 });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (status?: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-500',
      inactive: 'bg-gray-500',
      vacation: 'bg-blue-500',
      sick_leave: 'bg-red-500'
    };
    const labels: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      vacation: 'Férias',
      sick_leave: 'Baixa Médica'
    };
    return (
      <Badge className={`${colors[status || 'active']} text-white`}>
        {labels[status || 'active']}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Detalhes do Funcionário</DialogTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  Editar
                </Button>
              ) : (
                <>
                  <Button onClick={() => { setFormData(staff); setIsEditing(false); }} variant="outline" size="sm">
                    Cancelar
                  </Button>
                  <Button onClick={handleSave} size="sm">
                    Salvar
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {/* Header Card */}
          <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg mb-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={formData.profile_photo} />
                  <AvatarFallback className="text-2xl">{getInitials(formData.name)}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0">
                    <Upload className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold">{formData.name}</h3>
                  {getStatusBadge(formData.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    {formData.position}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {formData.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {formData.phone || 'Não informado'}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Desde {formData.hire_date ? new Date(formData.hire_date).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">
                <User className="h-4 w-4 mr-2" />
                Pessoal
              </TabsTrigger>
              <TabsTrigger value="professional">
                <Activity className="h-4 w-4 mr-2" />
                Profissional
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Documentos
              </TabsTrigger>
              <TabsTrigger value="security">
                <Key className="h-4 w-4 mr-2" />
                Segurança
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome Completo</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Data de Nascimento</Label>
                  <Input
                    type="date"
                    value={formData.birth_date || ''}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-span-2">
                  <Label>Endereço</Label>
                  <Input
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Contato de Emergência</Label>
                  <Input
                    value={formData.emergency_contact_name || ''}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Telefone de Emergência</Label>
                  <Input
                    value={formData.emergency_contact_phone || ''}
                    onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="professional" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cargo</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => setFormData({ ...formData, position: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal_trainer">Personal Trainer</SelectItem>
                      <SelectItem value="recepcao">Recepção</SelectItem>
                      <SelectItem value="limpeza">Limpeza</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="administracao">Administração</SelectItem>
                      <SelectItem value="gerencia">Gerência</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Departamento</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData({ ...formData, department: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="operacoes">Operações</SelectItem>
                      <SelectItem value="administracao">Administração</SelectItem>
                      <SelectItem value="manutencao">Manutenção</SelectItem>
                      <SelectItem value="atendimento">Atendimento ao Cliente</SelectItem>
                      <SelectItem value="treino">Treino e Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Data de Contratação</Label>
                  <Input
                    type="date"
                    value={formData.hire_date || ''}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select
                    value={formData.status || 'active'}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                      <SelectItem value="vacation">Férias</SelectItem>
                      <SelectItem value="sick_leave">Baixa Médica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Salário (€)</Label>
                  <Input
                    type="number"
                    value={formData.salary || ''}
                    onChange={(e) => setFormData({ ...formData, salary: parseFloat(e.target.value) })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label>Permissão</Label>
                  <Select
                    value={formData.role_id || 'none'}
                    onValueChange={(value) => setFormData({ ...formData, role_id: value === 'none' ? undefined : value })}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem permissão</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label>Observações</Label>
                  <Textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-6">
              {staff.id && <StaffDocumentsSection staffId={staff.id} />}
            </TabsContent>

            <TabsContent value="security" className="space-y-4 mt-6">
              <div className="border rounded-lg p-4 space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Credenciais de Acesso</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email de Login:</span>
                      <span className="font-mono">{formData.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">ID do Usuário:</span>
                      <span className="font-mono text-xs">{formData.user_id || 'Não criado'}</span>
                    </div>
                  </div>
                </div>

                {formData.user_id && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Gerar Nova Senha</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Gera uma nova senha baseada na data de nascimento (formato: DdDDMMAAAA)
                    </p>
                    <Button
                      onClick={handleResetPassword}
                      variant="outline"
                      className="w-full"
                      disabled={!formData.birth_date}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Gerar Nova Senha
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
