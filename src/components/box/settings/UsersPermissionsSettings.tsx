import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Edit,
  Trash2,
  Copy,
  Shield,
  Crown,
  Briefcase,
  User,
  CheckSquare
} from 'lucide-react';
import { useRoles, PERMISSION_MODULES } from '@/hooks/useRoles';
import { RoleFormModal } from './RoleFormModal';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export const UsersPermissionsSettings: React.FC = () => {
  const { roles, createRole, updateRole, deleteRole, duplicateRole } = useRoles();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const handleEdit = (role: any) => {
    setEditingRole(role);
    setIsFormOpen(true);
  };

  const handleSave = (roleData: any) => {
    if (editingRole) {
      updateRole(editingRole.id, roleData);
    } else {
      createRole(roleData);
    }
    setIsFormOpen(false);
    setEditingRole(null);
  };

  const getRoleIcon = (color: string) => {
    return (
      <div 
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <Shield className="h-5 w-5" style={{ color }} />
      </div>
    );
  };

  const getPermissionModuleLabel = (permissionKey: string) => {
    const moduleKey = permissionKey.split('.')[0];
    const module = PERMISSION_MODULES[moduleKey as keyof typeof PERMISSION_MODULES];
    return module?.label || moduleKey;
  };

  const groupPermissionsByModule = (permissions: string[]) => {
    const grouped: Record<string, number> = {};
    permissions.forEach(perm => {
      const moduleKey = perm.split('.')[0];
      grouped[moduleKey] = (grouped[moduleKey] || 0) + 1;
    });
    return grouped;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Gestão de Cargos</h2>
            <p className="text-sm text-muted-foreground">
              Crie cargos e defina permissões por área de atuação
            </p>
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingRole(null);
            setIsFormOpen(true);
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Criar Novo Cargo
        </Button>
      </div>

      {/* Info Card */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Como funciona o sistema de cargos?
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Crie cargos personalizados e atribua permissões específicas por módulo. 
                Cada cargo define o que seus colaboradores podem fazer no sistema. 
                As permissões são organizadas por áreas como Atletas, Aulas, Financeiro, etc.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Cargos</p>
                <p className="text-2xl font-bold">{roles.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cargos do Sistema</p>
                <p className="text-2xl font-bold">{roles.filter(r => r.isSystem).length}</p>
              </div>
              <Crown className="h-8 w-8 text-yellow-500 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cargos Personalizados</p>
                <p className="text-2xl font-bold">{roles.filter(r => !r.isSystem).length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roles.map((role) => {
          const permissionsByModule = groupPermissionsByModule(role.permissions);
          
          return (
            <Card 
              key={role.id} 
              className="hover:shadow-lg transition-all border-l-4 animate-fade-in"
              style={{ borderLeftColor: role.color }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {getRoleIcon(role.color)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        {role.isSystem && (
                          <Badge variant="secondary" className="text-xs">
                            Sistema
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {role.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Permission Summary */}
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <CheckSquare className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Permissões Ativas</span>
                    </div>
                    <Badge variant="outline">{role.permissions.length}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(permissionsByModule).map(([moduleKey, count]) => {
                      const module = PERMISSION_MODULES[moduleKey as keyof typeof PERMISSION_MODULES];
                      if (!module) return null;
                      
                      return (
                        <Badge 
                          key={moduleKey} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {module.icon} {module.label} ({count})
                        </Badge>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(role)}
                    className="flex-1"
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Editar
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => duplicateRole(role.id)}
                  >
                    <Copy className="h-3 w-3 mr-2" />
                    Duplicar
                  </Button>

                  {!role.isSystem && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o cargo <strong>{role.name}</strong>?
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteRole(role.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {roles.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Nenhum cargo criado</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Crie seu primeiro cargo para começar a organizar sua equipe
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Cargo
            </Button>
          </CardContent>
        </Card>
      )}

      <RoleFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingRole(null);
        }}
        role={editingRole}
        onSave={handleSave}
      />
    </div>
  );
};
