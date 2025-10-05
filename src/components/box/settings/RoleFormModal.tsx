import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Save, X, CheckSquare, Square } from 'lucide-react';
import { Role, PERMISSION_MODULES } from '@/hooks/useRoles';
import { toast } from 'sonner';

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  onSave: (roleData: Omit<Role, 'id'>) => void;
}

const COLOR_OPTIONS = [
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#f97316', label: 'Laranja' },
  { value: '#f59e0b', label: 'Amarelo' },
  { value: '#10b981', label: 'Verde' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#8b5cf6', label: 'Roxo' },
  { value: '#ec4899', label: 'Rosa' },
  { value: '#6b7280', label: 'Cinza' }
];

export const RoleFormModal: React.FC<RoleFormModalProps> = ({
  isOpen,
  onClose,
  role,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#3b82f6',
    permissions: [] as string[]
  });

  useEffect(() => {
    if (isOpen && role) {
      setFormData({
        name: role.name,
        description: role.description,
        color: role.color,
        permissions: [...role.permissions]
      });
    } else if (isOpen && !role) {
      setFormData({
        name: '',
        description: '',
        color: '#3b82f6',
        permissions: []
      });
    }
  }, [isOpen, role?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Por favor, insira o nome do cargo');
      return;
    }

    if (formData.permissions.length === 0) {
      toast.error('Selecione pelo menos uma permissão');
      return;
    }

    onSave({
      name: formData.name,
      description: formData.description,
      color: formData.color,
      permissions: formData.permissions
    });
    onClose();
  };

  const togglePermission = (permissionKey: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionKey)
        ? prev.permissions.filter(p => p !== permissionKey)
        : [...prev.permissions, permissionKey]
    }));
  };

  const toggleModule = (moduleKey: string) => {
    const module = PERMISSION_MODULES[moduleKey as keyof typeof PERMISSION_MODULES];
    const modulePermissions = module.permissions.map(p => p.key);
    const allSelected = modulePermissions.every(p => formData.permissions.includes(p));

    if (allSelected) {
      // Remove all module permissions
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => !modulePermissions.includes(p))
      }));
    } else {
      // Add all module permissions
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...modulePermissions])]
      }));
    }
  };

  const isModuleFullySelected = (moduleKey: string) => {
    const module = PERMISSION_MODULES[moduleKey as keyof typeof PERMISSION_MODULES];
    return module.permissions.every(p => formData.permissions.includes(p.key));
  };

  const isModulePartiallySelected = (moduleKey: string) => {
    const module = PERMISSION_MODULES[moduleKey as keyof typeof PERMISSION_MODULES];
    const selectedCount = module.permissions.filter(p => formData.permissions.includes(p.key)).length;
    return selectedCount > 0 && selectedCount < module.permissions.length;
  };

  const selectAllPermissions = () => {
    const allPermissions = Object.values(PERMISSION_MODULES)
      .flatMap(m => m.permissions.map(p => p.key));
    setFormData(prev => ({ ...prev, permissions: allPermissions }));
  };

  const clearAllPermissions = () => {
    setFormData(prev => ({ ...prev, permissions: [] }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {role ? 'Editar Cargo' : 'Criar Novo Cargo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <ScrollArea className="h-[calc(90vh-200px)] pr-4">
            {/* Informações Básicas */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">Informações Básicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome do Cargo *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Gerente, Trainer Sênior..."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cor do Cargo</Label>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                          className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-110 ${
                            formData.color === color.value ? 'border-foreground scale-110' : 'border-border'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva as responsabilidades deste cargo..."
                    rows={2}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Permissões Selecionadas</p>
                    <p className="text-sm text-muted-foreground">
                      {formData.permissions.length} de {Object.values(PERMISSION_MODULES).reduce((acc, m) => acc + m.permissions.length, 0)} permissões
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAllPermissions}
                    >
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Selecionar Todas
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={clearAllPermissions}
                    >
                      <Square className="h-4 w-4 mr-2" />
                      Limpar Tudo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissões por Módulo */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Permissões por Área</h3>
                <Badge variant="secondary">
                  {Object.keys(PERMISSION_MODULES).length} módulos
                </Badge>
              </div>

              {Object.entries(PERMISSION_MODULES).map(([moduleKey, module]) => {
                const isFullySelected = isModuleFullySelected(moduleKey);
                const isPartiallySelected = isModulePartiallySelected(moduleKey);

                return (
                  <Card key={moduleKey} className={`transition-all ${
                    isFullySelected ? 'ring-2 ring-primary' : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{module.icon}</span>
                          <div>
                            <CardTitle className="text-base">{module.label}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                              {module.permissions.length} permissões disponíveis
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant={isFullySelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleModule(moduleKey)}
                        >
                          {isFullySelected ? (
                            <>
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Todas Selecionadas
                            </>
                          ) : isPartiallySelected ? (
                            <>
                              <CheckSquare className="h-4 w-4 mr-2" />
                              Parcial ({module.permissions.filter(p => formData.permissions.includes(p.key)).length})
                            </>
                          ) : (
                            <>
                              <Square className="h-4 w-4 mr-2" />
                              Selecionar Todas
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {module.permissions.map((permission) => (
                          <div
                            key={permission.key}
                            className={`flex items-start space-x-3 p-3 rounded-lg border transition-all hover:bg-muted/50 cursor-pointer ${
                              formData.permissions.includes(permission.key)
                                ? 'bg-primary/5 border-primary/50'
                                : 'border-border'
                            }`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                togglePermission(permission.key);
                              }
                            }}
                            onClick={() => togglePermission(permission.key)}
                          >
                            <Checkbox
                              checked={formData.permissions.includes(permission.key)}
                              onCheckedChange={() => togglePermission(permission.key)}
                              onClick={(e) => e.stopPropagation()}
                              className="mt-0.5"
                            />
                            <div className="flex-1 min-w-0">
                              <Label className="font-medium cursor-pointer">
                                {permission.label}
                              </Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              {role ? 'Atualizar Cargo' : 'Criar Cargo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
