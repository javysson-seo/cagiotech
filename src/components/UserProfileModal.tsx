import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Lock, Key, Save, Loader2 } from 'lucide-react';
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
  const [isSendingReset, setIsSendingReset] = useState(false);
  
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

  const handlePasswordReset = async () => {
    if (!profileData.email) return;

    setIsSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(profileData.email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;
      toast.success('Email enviado! Verifique sua caixa de entrada para o código de 6 dígitos.');
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('Erro ao enviar email');
    } finally {
      setIsSendingReset(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Meu Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center justify-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profileData.avatar_url} alt={profileData.name} />
              <AvatarFallback className="text-2xl">
                {profileData.name.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
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
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                value={profileData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground mt-1">
                O email não pode ser alterado
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

            <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-start gap-3">
                <Key className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm">Redefinir Senha</p>
                  <p className="text-xs text-muted-foreground">
                    Receba um código de 6 dígitos da CagioTech por email para redefinir sua senha de forma segura
                  </p>
                </div>
              </div>
              <Button 
                onClick={handlePasswordReset} 
                disabled={isSendingReset}
                variant="outline"
                className="w-full"
              >
                {isSendingReset ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Email de Redefinição
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
