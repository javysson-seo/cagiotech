import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { User, Mail, Phone, Lock, Key, Save, Loader2, Camera, Edit } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserProfileModal = ({ open, onOpenChange }: UserProfileModalProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar_url: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id || !open) return;
      
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('name, email, phone, avatar_url')
        .eq('id', user.id)
        .single();
      
      if (data && !error) {
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || ''
        });
      }
      setIsLoading(false);
    };
    
    fetchProfile();
  }, [user, open]);

  const handleSaveProfile = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profileData.name,
          phone: profileData.phone
        })
        .eq('id', user.id);

      if (error) throw error;
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Erro ao atualizar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploadingAvatar(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Delete old avatar if exists
      if (profileData.avatar_url) {
        const oldPath = profileData.avatar_url.split('/').pop();
        await supabase.storage
          .from('avatars')
          .remove([`${user.id}/${oldPath}`]);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const newAvatarUrl = urlData.publicUrl;
      
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);

      if (error) throw error;

      setProfileData({ ...profileData, avatar_url: newAvatarUrl });
      toast.success('Foto atualizada com sucesso!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Erro ao fazer upload da foto');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdateEmail = async () => {
    if (!profileData.email) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: profileData.email
      });

      if (error) throw error;
      toast.success('Email de confirmação enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Erro ao atualizar email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!profileData.email) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profileData.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      setShowOtpInput(true);
      toast.success('Código de 6 dígitos enviado para seu email!');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Erro ao enviar código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otpCode.length !== 6) {
      toast.error('Digite o código de 6 dígitos');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: profileData.email,
        token: otpCode,
        type: 'recovery'
      });

      if (error) throw error;

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      toast.success('Senha alterada com sucesso!');
      setShowOtpInput(false);
      setOtpCode('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error('Código inválido ou expirado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Meu Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar with Upload */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <Avatar className="h-32 w-32 border-4 border-primary/10">
                <AvatarImage src={profileData.avatar_url} alt={profileData.name} />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {profileData.name.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <Camera className="h-8 w-8 text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isUploadingAvatar}
                />
              </label>
            </div>
            {isUploadingAvatar && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Enviando foto...
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Clique na foto para alterar
            </p>
          </div>

          {/* Personal Data */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nome Completo
              </Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Seu nome completo"
                disabled={isLoading}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleUpdateEmail}
                  disabled={isLoading}
                  className="h-7 text-xs"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Alterar
                </Button>
              </div>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="seu@email.com"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Será enviado um email de confirmação para o novo endereço
              </p>
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefone
              </Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="+351 912 345 678"
                disabled={isLoading}
              />
            </div>

            <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Dados Pessoais
                </>
              )}
            </Button>
          </div>

          <Separator />

          {/* Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <h3 className="font-semibold">Segurança</h3>
            </div>

            {!showOtpInput ? (
              <div className="space-y-3 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-start gap-3">
                  <Key className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-sm">Redefinir Senha</p>
                    <p className="text-xs text-muted-foreground">
                      Receba um código de 6 dígitos da CagioTech por email para redefinir sua senha
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleSendOtp} 
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar Código por Email
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 p-4 border rounded-lg bg-primary/5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Digite o código de 6 dígitos
                  </Label>
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpCode}
                      onChange={setOtpCode}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Verifique seu email para o código
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <Label htmlFor="newPassword" className="text-sm">
                      Nova Senha
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="text-sm">
                      Confirmar Senha
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Digite a senha novamente"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowOtpInput(false);
                      setOtpCode('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otpCode.length !== 6}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      'Confirmar'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
