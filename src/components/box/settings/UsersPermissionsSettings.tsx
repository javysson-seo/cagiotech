import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Copy, 
  Trash2,
  Edit,
  Crown,
  User,
  Briefcase,
  Loader2,
  Settings
} from 'lucide-react';
import { useStaff, Staff } from '@/hooks/useStaff';
import { StaffFormModal } from '@/components/hr/StaffFormModal';
import { toast } from 'sonner';

const PERMISSION_DEFINITIONS = [
  { key: 'manage_athletes', label: 'Gerir Atletas', description: 'Criar, editar e remover atletas' },
  { key: 'view_athletes', label: 'Ver Atletas', description: 'Visualizar informações dos atletas' },
  { key: 'manage_classes', label: 'Gerir Aulas', description: 'Criar e modificar aulas' },
  { key: 'view_reports', label: 'Ver Relatórios', description: 'Acesso a relatórios e métricas' },
  { key: 'manage_finances', label: 'Gerir Financeiro', description: 'Acesso ao módulo financeiro' },
  { key: 'manage_bookings', label: 'Gerir Reservas', description: 'Gerenciar reservas de aulas' },
  { key: 'check_in_athletes', label: 'Check-in Atletas', description: 'Realizar check-in de atletas' },
  { key: 'manage_equipment', label: 'Gerir Equipamentos', description: 'Gerenciar equipamentos' },
  { key: 'manage_settings', label: 'Gerir Configurações', description: 'Acesso às configurações' },
  { key: 'delete_data', label: 'Excluir Dados', description: 'Permissão para excluir registros' }
];

const ROLE_OPTIONS = [
  { value: 'personal_trainer', label: 'Trainer', icon: Briefcase },
  { value: 'recepcao', label: 'Recepcionista', icon: User },
  { value: 'gerencia', label: 'Gerente', icon: Crown }
];

export const UsersPermissionsSettings: React.FC = () => {
  const { staff, loading, saveStaff, deleteStaff } = useStaff();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('personal_trainer');

  const handleEdit = (member: Staff) => {
    setEditingStaff(member);
    setIsFormOpen(true);
  };

  const handleDelete = async (staffId: string) => {
    if (confirm('Tem certeza que deseja remover este membro?')) {
      await deleteStaff(staffId);
    }
  };

  const handleSave = async (staffData: Staff) => {
    await saveStaff(staffData);
    setIsFormOpen(false);
    setEditingStaff(null);
  };

  const getRoleIcon = (position: string) => {
    const roleOption = ROLE_OPTIONS.find(r => r.value === position);
    if (roleOption) {
      const Icon = roleOption.icon;
      return <Icon className="h-4 w-4" />;
    }
    return <User className="h-4 w-4" />;
  };

  const getRoleLabel = (position: string) => {
    const roleOption = ROLE_OPTIONS.find(r => r.value === position);
    return roleOption?.label || position;
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/auth/staff-register`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Link de convite copiado!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredStaff = staff.filter(s => s.position === selectedRole);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Users className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Recursos Humanos</h2>
      </div>

      {/* Convidar Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Adicionar Membro da Equipe</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Adicionar novo colaborador</p>
              <p className="text-sm text-muted-foreground">
                Clique no botão para adicionar um novo membro à equipe
              </p>
            </div>
            <Button onClick={() => {
              setEditingStaff(null);
              setIsFormOpen(true);
            }}>
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Membro
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Link de Convite Rápido</p>
              <p className="text-sm text-muted-foreground">
                Compartilhe este link para que novos membros se registrem
              </p>
            </div>
            <Button variant="outline" onClick={copyInviteLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filtro por Cargo */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Cargo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {ROLE_OPTIONS.map((role) => {
              const Icon = role.icon;
              const count = staff.filter(s => s.position === role.value).length;
              return (
                <Button
                  key={role.value}
                  variant={selectedRole === role.value ? 'default' : 'outline'}
                  onClick={() => setSelectedRole(role.value)}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{role.label}</span>
                  <Badge variant="secondary" className="ml-2">{count}</Badge>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Membros */}
      <Card>
        <CardHeader>
          <CardTitle>
            {getRoleLabel(selectedRole)} ({filteredStaff.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredStaff.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum {getRoleLabel(selectedRole).toLowerCase()} cadastrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStaff.map((member) => (
                <div key={member.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {getRoleIcon(member.position)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{member.name}</h4>
                          <Badge variant="secondary">
                            {getRoleLabel(member.position)}
                          </Badge>
                          <Badge variant={member.status === 'active' ? 'default' : 'outline'}>
                            {member.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Departamento: {member.department}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(member)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700" 
                        onClick={() => member.id && handleDelete(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Definições de Permissões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Sistema de Permissões</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-4">
              O sistema de permissões permite controlar o acesso de cada membro da equipe às diferentes funcionalidades da plataforma.
              As permissões são atribuídas através da tabela <code className="bg-muted px-2 py-1 rounded">staff_permissions</code>.
            </p>
            {PERMISSION_DEFINITIONS.map((perm) => (
              <div key={perm.key} className="flex items-start space-x-3 p-3 rounded-lg border">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium">{perm.label}</h4>
                  <p className="text-sm text-muted-foreground">{perm.description}</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded mt-1 inline-block">
                    {perm.key}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <StaffFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStaff(null);
        }}
        staff={editingStaff}
        onSave={handleSave}
      />
    </div>
  );
};
