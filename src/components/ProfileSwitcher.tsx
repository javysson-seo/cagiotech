import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shield, Building2, Dumbbell, User, GraduationCap, ChevronDown } from 'lucide-react';

export const ProfileSwitcher: React.FC = () => {
  const { user, switchProfile } = useAuth();

  if (!user?.availableProfiles || user.availableProfiles.length <= 1) {
    return null;
  }

  const getProfileIcon = (type: string) => {
    switch (type) {
      case 'cagio_admin':
        return <Shield className="h-4 w-4" />;
      case 'box_owner':
        return <Building2 className="h-4 w-4" />;
      case 'personal_trainer':
        return <Dumbbell className="h-4 w-4" />;
      case 'staff_member':
        return <User className="h-4 w-4" />;
      case 'student':
        return <GraduationCap className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getProfileLabel = (type: string) => {
    switch (type) {
      case 'cagio_admin':
        return 'Admin Cagio';
      case 'box_owner':
        return 'Proprietário';
      case 'personal_trainer':
        return 'Personal';
      case 'staff_member':
        return 'Colaborador';
      case 'student':
        return 'Atleta';
      default:
        return type;
    }
  };

  const currentProfile = user.availableProfiles.find(p => p.role === user.role);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {currentProfile && getProfileIcon(currentProfile.type)}
          <span className="hidden sm:inline">{currentProfile && getProfileLabel(currentProfile.type)}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Trocar Perfil</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.availableProfiles.map((profile, index) => (
          <DropdownMenuItem
            key={`${profile.type}-${profile.companyId}-${index}`}
            onClick={() => switchProfile(profile)}
            disabled={profile.role === user.role}
            className="gap-2 cursor-pointer"
          >
            {getProfileIcon(profile.type)}
            <div className="flex-1">
              <div className="font-medium">{getProfileLabel(profile.type)}</div>
              <div className="text-xs text-muted-foreground">{profile.companyName}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
