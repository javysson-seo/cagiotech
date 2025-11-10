import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { z } from 'zod';
import { StaffTermsAcceptanceModal } from '@/components/hr/StaffTermsAcceptanceModal';

interface ForcePasswordChangeModalProps {
  isOpen: boolean;
  staffId: string;
  onPasswordChanged: () => void;
}

const passwordSchema = z.string()
  .min(8, 'Senha deve ter pelo menos 8 caracteres')
  .regex(/[A-Z]/, 'Senha deve conter pelo menos uma letra maiúscula')
  .regex(/[a-z]/, 'Senha deve conter pelo menos uma letra minúscula')
  .regex(/[0-9]/, 'Senha deve conter pelo menos um número')
  .regex(/[^A-Za-z0-9]/, 'Senha deve conter pelo menos um caractere especial (!@#$%^&*)');

export const ForcePasswordChangeModal: React.FC<ForcePasswordChangeModalProps> = ({
  isOpen,
  staffId,
  onPasswordChanged
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  const validatePasswords = () => {
    const newErrors: Record<string, string> = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }

    try {
      passwordSchema.parse(newPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        newErrors.newPassword = error.errors[0].message;
      }
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword = 'A nova senha deve ser diferente da senha atual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswords()) {
      toast.error('Por favor, corrija os erros no formulário');
      return;
    }

    setLoading(true);

    try {
      // First verify current password by trying to sign in
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        throw new Error('Usuário não encontrado');
      }

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword
      });

      if (signInError) {
        setErrors({ currentPassword: 'Senha atual incorreta' });
        toast.error('Senha atual incorreta');
        setLoading(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        throw updateError;
      }

      // Update staff record to mark first_login as false
      const { error: staffError } = await supabase
        .from('staff')
        .update({
          first_login: false,
          password_changed_at: new Date().toISOString()
        })
        .eq('id', staffId);

      if (staffError) {
        console.error('Error updating staff record:', staffError);
      }

      // Get company_id to send notification
      const { data: staffData } = await supabase
        .from('staff')
        .select('company_id')
        .eq('id', staffId)
        .single();

      // Send notification email to admin
      if (staffData?.company_id) {
        try {
          await supabase.functions.invoke('notify-staff-activation', {
            body: {
              staff_id: staffId,
              company_id: staffData.company_id
            }
          });
          console.log('Admin notification sent successfully');
        } catch (emailError) {
          console.error('Error sending admin notification:', emailError);
          // Don't fail the password change if email fails
        }
      }

      toast.success('Senha alterada com sucesso!');
      setPasswordChanged(true);
      
      // Mostrar modal de termos
      setShowTermsModal(true);

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});

    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Erro ao alterar senha');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const configs = [
      { strength: 1, label: 'Muito Fraca', color: 'bg-red-500' },
      { strength: 2, label: 'Fraca', color: 'bg-orange-500' },
      { strength: 3, label: 'Média', color: 'bg-yellow-500' },
      { strength: 4, label: 'Forte', color: 'bg-lime-500' },
      { strength: 5, label: 'Muito Forte', color: 'bg-green-500' }
    ];

    return configs[strength - 1] || configs[0];
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleTermsCompleted = () => {
    setShowTermsModal(false);
    onPasswordChanged();
  };

  return (
    <>
      {showTermsModal && (
        <StaffTermsAcceptanceModal
          isOpen={showTermsModal}
          staffId={staffId}
          onCompleted={handleTermsCompleted}
        />
      )}
    <Dialog open={isOpen} onOpenChange={() => {}} modal>
      <DialogContent 
        className="max-w-md" 
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Lock className="h-6 w-6 text-cagio-green" />
            Alterar Senha Obrigatório
          </DialogTitle>
          <DialogDescription>
            Por segurança, você deve alterar sua senha padrão antes de continuar.
          </DialogDescription>
        </DialogHeader>

        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-900 dark:text-amber-100">
            Esta é sua primeira vez no sistema. Crie uma senha forte e única.
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Senha Atual *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="Digite sua senha atual"
                className="pl-10 pr-10"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nova Senha *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                placeholder="Digite sua nova senha"
                className="pl-10 pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {newPassword && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{passwordStrength.label}</span>
                </div>
              </div>
            )}
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nova Senha *</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Digite novamente a nova senha"
                className="pl-10 pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {confirmPassword && newPassword === confirmPassword && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-sm">As senhas coincidem</span>
              </div>
            )}
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Password Requirements */}
          <Alert>
            <AlertDescription className="text-xs space-y-1">
              <p className="font-semibold mb-2">Sua senha deve conter:</p>
              <ul className="list-disc list-inside space-y-1">
                <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                  Pelo menos 8 caracteres
                </li>
                <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                  Uma letra maiúscula (A-Z)
                </li>
                <li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>
                  Uma letra minúscula (a-z)
                </li>
                <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                  Um número (0-9)
                </li>
                <li className={/[^A-Za-z0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                  Um caractere especial (!@#$%^&*)
                </li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button
            type="submit"
            className="w-full bg-cagio-green hover:bg-cagio-green-dark text-white"
            disabled={loading}
          >
            {loading ? 'Alterando senha...' : 'Alterar Senha'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};
