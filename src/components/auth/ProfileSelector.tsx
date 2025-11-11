import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, User, GraduationCap, Dumbbell } from 'lucide-react';
import { UserProfile } from '@/hooks/useUserProfiles';

interface ProfileSelectorProps {
  isOpen: boolean;
  profiles: UserProfile[];
  onSelectProfile: (profile: UserProfile) => void;
}

const getProfileIcon = (type: string) => {
  switch (type) {
    case 'box_owner':
      return <Building2 className="h-8 w-8" />;
    case 'personal_trainer':
      return <Dumbbell className="h-8 w-8" />;
    case 'staff_member':
      return <User className="h-8 w-8" />;
    case 'student':
      return <GraduationCap className="h-8 w-8" />;
    default:
      return <User className="h-8 w-8" />;
  }
};

const getProfileLabel = (type: string) => {
  switch (type) {
    case 'box_owner':
      return 'Proprietário';
    case 'personal_trainer':
      return 'Personal Trainer';
    case 'staff_member':
      return 'Colaborador';
    case 'student':
      return 'Atleta/Aluno';
    default:
      return type;
  }
};

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  isOpen,
  profiles,
  onSelectProfile,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Selecione seu Perfil</DialogTitle>
          <DialogDescription className="text-center">
            Detectamos que você possui múltiplos perfis. Escolha qual deseja acessar:
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {profiles.map((profile, index) => (
            <Card
              key={`${profile.type}-${profile.companyId}-${index}`}
              className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
              onClick={() => onSelectProfile(profile)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="text-primary">
                    {getProfileIcon(profile.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {getProfileLabel(profile.type)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {profile.companyName}
                    </p>
                    {profile.roleName && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {profile.roleName}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProfile(profile);
                    }}
                  >
                    Selecionar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
