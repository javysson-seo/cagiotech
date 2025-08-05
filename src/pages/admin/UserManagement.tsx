
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  UserCheck, 
  UserX,
  Shield,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { toast } from 'sonner';

export const UserManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data - em produção virá da API/Supabase
  const users = [
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@crossfitbenfica.com',
      phone: '+351 912 345 678',
      role: 'box_admin',
      status: 'active',
      boxName: 'CrossFit Benfica',
      registeredAt: '2024-01-10',
      lastLogin: '2024-01-14',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@functionalgym.pt',
      phone: '+351 918 765 432',
      role: 'box_admin',
      status: 'pending',
      boxName: 'Functional Gym Porto',
      registeredAt: '2024-01-08',
      lastLogin: '2024-01-12',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria'
    },
    {
      id: 3,
      name: 'Carlos Trainer',
      email: 'carlos@crossfitbenfica.com',
      phone: '+351 915 555 123',
      role: 'trainer',
      status: 'active',
      boxName: 'CrossFit Benfica',
      registeredAt: '2023-12-15',
      lastLogin: '2024-01-14',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos'
    },
    {
      id: 4,
      name: 'Ana Atleta',
      email: 'ana@email.com',
      phone: '+351 917 888 999',
      role: 'student',
      status: 'active',
      boxName: 'CrossFit Benfica',
      registeredAt: '2023-11-20',
      lastLogin: '2024-01-14',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana'
    },
    {
      id: 5,
      name: 'Pedro Costa',
      email: 'pedro@elitecrossfit.com',
      phone: '+351 913 444 555',
      role: 'box_admin',
      status: 'suspended',
      boxName: 'Elite CrossFit',
      registeredAt: '2024-01-05',
      lastLogin: '2024-01-10',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro'
    }
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'cagio_admin':
        return <Badge className="bg-purple-100 text-purple-800">Admin Cagio</Badge>;
      case 'box_admin':
        return <Badge className="bg-blue-100 text-blue-800">Admin BOX</Badge>;
      case 'trainer':
        return <Badge className="bg-green-100 text-green-800">Trainer</Badge>;
      case 'student':
        return <Badge variant="outline">Aluno</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Ativo</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-800">Pendente</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspenso</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleActivateUser = (userId: number) => {
    toast.success('Utilizador ativado com sucesso!');
  };

  const handleSuspendUser = (userId: number) => {
    toast.warning('Utilizador suspenso');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background flex">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Gestão de Utilizadores</h1>
                <p className="text-muted-foreground mt-1">
                  Gerir todos os utilizadores da plataforma
                </p>
              </div>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Utilizador
              </Button>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Procurar por nome ou email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as Funções</SelectItem>
                      <SelectItem value="box_admin">Admin BOX</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="student">Aluno</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Estados</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="suspended">Suspenso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle>Utilizadores ({filteredUsers.length})</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{user.name}</h4>
                            {getRoleBadge(user.role)}
                            {getStatusBadge(user.status)}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Mail className="h-3 w-3" />
                              <span>{user.email}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Phone className="h-3 w-3" />
                              <span>{user.phone}</span>
                            </div>
                            {user.boxName && (
                              <span>BOX: {user.boxName}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Registado: {user.registeredAt}</span>
                            </div>
                            <span>Último login: {user.lastLogin}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                        
                        {user.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleActivateUser(user.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Ativar
                          </Button>
                        )}
                        
                        {user.status === 'active' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSuspendUser(user.id)}
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Suspender
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">
                      Nenhum utilizador encontrado
                    </h3>
                    <p className="text-muted-foreground">
                      Tente ajustar os filtros ou adicionar um novo utilizador.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
