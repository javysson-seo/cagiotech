import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Eye, EyeOff, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useRoles } from '@/hooks/useRoles';
import { staffSchema } from '@/lib/validation-schemas';
import { z } from 'zod';

interface StaffMember {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  birth_date?: string;
  hire_date?: string;
  status?: string;
  role_id?: string;
}

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: StaffMember | null;
  onSave: (staff: StaffMember) => void;
}

export const StaffFormModal: React.FC<StaffFormModalProps> = ({
  isOpen,
  onClose,
  staff,
  onSave
}) => {
  const { roles } = useRoles();
  const [formData, setFormData] = useState<StaffMember>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    birth_date: '',
    hire_date: new Date().toISOString().split('T')[0],
    status: 'active',
    role_id: undefined
  });

  const [showCredentials, setShowCredentials] = useState(false);
  const [validationErrors, setValidationErrors] = useState<z.ZodError | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (staff) {
        setFormData(staff);
      } else {
        setFormData({
          name: '',
          email: '',
          phone: '',
          position: '',
          department: '',
          birth_date: '',
          hire_date: new Date().toISOString().split('T')[0],
          status: 'active',
          role_id: undefined
        });
      }
    }
  }, [staff, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate with Zod schema
    const validation = staffSchema.safeParse({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || undefined,
      position: formData.position,
      department: formData.department,
      hire_date: formData.hire_date,
      salary: undefined, // Not in this form
    });
    
    if (!validation.success) {
      setValidationErrors(validation.error);
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setValidationErrors(null);
    onSave({ ...formData, ...validation.data });
  };

  const generatePasswordFromDate = (date: string): string => {
    if (!date) return '';
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear().toString();
    // Format: Dd[day][month][year] - e.g., Dd01012000
    return `Dd${day}${month}${year}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência.');
  };

  const generatedPassword = formData.birth_date ? generatePasswordFromDate(formData.birth_date) : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {staff ? 'Editar Funcionário' : 'Novo Funcionário'}
          </DialogTitle>
        </DialogHeader>

        {validationErrors && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.errors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error.path.join('.')}: {error.message}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Digite o nome completo"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="funcionario@empresa.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+351 000 000 000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birth_date">Data de Nascimento</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date || ''}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo *</Label>
              <Select
                value={formData.position}
                onValueChange={(value) => setFormData({ ...formData, position: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
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
              {validationErrors?.errors.find(e => e.path.join('.') === 'position') && (
                <p className="text-sm text-destructive">{validationErrors.errors.find(e => e.path.join('.') === 'position')?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento *</Label>
              <Select
                value={formData.department}
                onValueChange={(value) => setFormData({ ...formData, department: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="operacoes">Operações</SelectItem>
                  <SelectItem value="administracao">Administração</SelectItem>
                  <SelectItem value="manutencao">Manutenção</SelectItem>
                  <SelectItem value="atendimento">Atendimento ao Cliente</SelectItem>
                  <SelectItem value="treino">Treino e Fitness</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors?.errors.find(e => e.path.join('.') === 'department') && (
                <p className="text-sm text-destructive">{validationErrors.errors.find(e => e.path.join('.') === 'department')?.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hire_date">Data de Contratação</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date || ''}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || 'active'}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
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

            <div className="space-y-2">
              <Label htmlFor="role_id">Permissão</Label>
              <Select
                value={formData.role_id || 'none'}
                onValueChange={(value) => setFormData({ ...formData, role_id: value === 'none' ? undefined : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione permissão" />
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
              <p className="text-xs text-muted-foreground">
                Define as permissões que o funcionário terá no sistema
              </p>
            </div>
          </div>

          {/* Credenciais de Acesso */}
          {formData.birth_date && formData.email && !staff && (
            <Card className="border-cagio-green bg-cagio-green-light">
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between text-cagio-green">
                  Credenciais de Acesso
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCredentials(!showCredentials)}
                    className="text-cagio-green hover:bg-cagio-green/10"
                  >
                    {showCredentials ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert>
                  <AlertDescription>
                    Estas credenciais serão criadas automaticamente para o funcionário aceder ao sistema.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Email de Login:</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        value={formData.email}
                        readOnly
                        className="bg-white"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(formData.email)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Password:</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type={showCredentials ? "text" : "password"}
                        value={generatedPassword}
                        readOnly
                        className="bg-white"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(generatedPassword)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Alert>
                  <AlertDescription className="text-sm">
                    A password é gerada automaticamente no formato <strong>DdDDMMAAAA</strong> (ex: Dd01012000). 
                    O funcionário poderá e deverá alterar a password após o primeiro login.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-cagio-green hover:bg-cagio-green-dark text-white">
              {staff ? 'Atualizar' : 'Criar'} Funcionário
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};