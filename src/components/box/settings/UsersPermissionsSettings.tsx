
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Copy, 
  Check,
  Trash2,
  Edit,
  Crown,
  User,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { toast } from 'sonner';

export const UsersPermissionsSettings: React.FC = () => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('trainer');
  const [autoApproval, setAutoApproval] = useState(false);

  const [users] = useState([
    {
      id: '1',
      name: 'João Silva',
      email: 'joao@crossfitbenfica.com',
      role: 'box_admin',
      status: 'active',
      lastLogin: '2024-01-15T10:30:00'
    },
    {
      id: '2',
      name: 'Carlos Trainer',
      email: 'carlos@crossfitbenfica.com',
      role: 'trainer',
      status: 'active',
      lastLogin: '2024-01-14T16:45:00'
    },
    {
      id: '3',
      name: 'Maria Rececionista',
      email: 'maria@crossfitbenfica.com',
      role: 'receptionist',
      status: 'pending',
      lastLogin: null
    }
  ]);

  const [permissions, setPermissions] = useState({
    trainer: {
      viewAthletes: true,
      manageOwnClasses: true,
      viewSchedule: true,
      checkInAthletes: true,
      viewReports: false,
      manageEquipment: false
    },
    receptionist: {
      viewAthletes: true,
      managePayments: true,
      checkInAthletes: true,
      viewSchedule: true,
      manageBookings: true,
      viewReports: false
    }
  });

  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error('Por favor, insira um email válido');
      return;
    }
    
    toast.success(`Convite enviado para ${inviteEmail}`);
    console.log('Enviando convite:', { email: inviteEmail, role: inviteRole });
    setInviteEmail('');
  };

  const copyInviteLink = () => {
    const inviteLink = `https://suabox.com/join?token=abc123&role=${inviteRole}`;
    navigator.clipboard.writeText(inviteLink);
    toast.success('Link de convite copiado!');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'box_admin': return <Crown className="h-4 w-4" />;
      case 'trainer': return <Briefcase className="h-4 w-4" />;
      case 'receptionist': return <User className="h-4 w-4" />;
      default: return <GraduationCap className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'box_admin': return 'BOX Admin';
      case 'trainer': return 'Trainer';
      case 'receptionist': return 'Rececionista';
      case 'student': return 'Aluno';
      default: return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'box_admin': return 'default';
      case 'trainer': return 'secondary';
      case 'receptionist': return 'outline';
      default: return 'outline';
    }
  };

  const updatePermission = (role: string, permission: string, value: boolean) => {
    setPermissions({
      ...permissions,
      [role]: {
        ...permissions[role as keyof typeof permissions],
        [permission]: value
      }
    });
    toast.success('Permissão atualizada');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Users className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Usuários & Permissões</h2>
      </div>

      {/* Convidar Usuários */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5" />
            <span>Convidar Usuários</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inviteEmail">Email do Convidado</Label>
              <Input
                id="inviteEmail"
                type="email"
                placeholder="email@exemplo.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="inviteRole">Função</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trainer">
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4" />
                      <span>Trainer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="receptionist">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Rececionista</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button onClick={handleInvite} className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Convite
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Link de Convite Rápido</p>
              <p className="text-sm text-muted-foreground">
                Copie este link para convidar usuários diretamente
              </p>
            </div>
            <Button variant="outline" onClick={copyInviteLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar Link
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Aprovação Automática de Novos Usuários</Label>
              <p className="text-sm text-muted-foreground">
                Usuários convidados são aprovados automaticamente
              </p>
            </div>
            <Switch
              checked={autoApproval}
              onCheckedChange={setAutoApproval}
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Usuários */}
      <Card>
        <CardHeader>
          <CardTitle>Usuários Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{user.name}</h4>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                      {user.status === 'pending' && (
                        <Badge variant="outline" className="text-orange-600">
                          Pendente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.lastLogin && (
                      <p className="text-xs text-muted-foreground">
                        Último login: {new Date(user.lastLogin).toLocaleDateString('pt-PT')}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user.status === 'pending' && (
                    <Button size="sm" variant="outline">
                      <Check className="h-4 w-4 mr-1" />
                      Aprovar
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {user.role !== 'box_admin' && (
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Configuração de Permissões */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Configuração de Permissões</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Permissões para Trainers */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Trainers</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              {Object.entries(permissions.trainer).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm">
                    {key === 'viewAthletes' ? 'Ver Atletas' :
                     key === 'manageOwnClasses' ? 'Gerir Próprias Aulas' :
                     key === 'viewSchedule' ? 'Ver Horários' :
                     key === 'checkInAthletes' ? 'Check-in Atletas' :
                     key === 'viewReports' ? 'Ver Relatórios' :
                     key === 'manageEquipment' ? 'Gerir Equipamentos' : key}
                  </Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => updatePermission('trainer', key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Permissões para Rececionistas */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Rececionistas</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
              {Object.entries(permissions.receptionist).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label className="text-sm">
                    {key === 'viewAthletes' ? 'Ver Atletas' :
                     key === 'managePayments' ? 'Gerir Pagamentos' :
                     key === 'checkInAthletes' ? 'Check-in Atletas' :
                     key === 'viewSchedule' ? 'Ver Horários' :
                     key === 'manageBookings' ? 'Gerir Reservas' :
                     key === 'viewReports' ? 'Ver Relatórios' : key}
                  </Label>
                  <Switch
                    checked={value}
                    onCheckedChange={(checked) => updatePermission('receptionist', key, checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
