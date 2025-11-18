import React from 'react';
import { Building2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface CompanyLogoProps {
  logoUrl?: string | null;
  companyName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showFallbackIcon?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

const iconSizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

/**
 * CompanyLogo - Exibe o logo da empresa com fallback para logo da CagioTech
 * 
 * @param logoUrl - URL do logo da empresa (pode ser null/undefined)
 * @param companyName - Nome da empresa (usado no alt)
 * @param size - Tamanho do logo (sm, md, lg, xl)
 * @param className - Classes CSS adicionais
 * @param showFallbackIcon - Se true, mostra ícone ao invés do logo padrão quando não há logo
 * 
 * @example
 * <CompanyLogo logoUrl={company.logo_url} companyName={company.name} size="md" />
 */
export const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName = 'Empresa',
  size = 'md',
  className,
  showFallbackIcon = false,
}) => {
  const defaultLogo = '/lovable-uploads/f11d946f-1e84-4046-8622-ffeb54bba33e.png';
  const displayLogo = logoUrl || defaultLogo;

  if (showFallbackIcon && !logoUrl) {
    return (
      <Avatar className={cn('rounded-lg', sizeClasses[size], className)}>
        <AvatarFallback className="rounded-lg bg-primary/10">
          <Building2 className={cn('text-primary', iconSizeClasses[size])} />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={cn('rounded-lg', sizeClasses[size], className)}>
      <AvatarImage 
        src={displayLogo} 
        alt={`${companyName} Logo`}
        className="object-contain"
      />
      <AvatarFallback className="rounded-lg bg-primary/10">
        <Building2 className={cn('text-primary', iconSizeClasses[size])} />
      </AvatarFallback>
    </Avatar>
  );
};

/**
 * CompanyLogoImage - Versão simplificada que retorna apenas uma tag <img>
 * Útil para headers e lugares onde não precisa do Avatar wrapper
 */
interface CompanyLogoImageProps {
  logoUrl?: string | null;
  companyName?: string;
  className?: string;
}

export const CompanyLogoImage: React.FC<CompanyLogoImageProps> = ({
  logoUrl,
  companyName = 'Empresa',
  className,
}) => {
  const defaultLogo = '/lovable-uploads/f11d946f-1e84-4046-8622-ffeb54bba33e.png';
  const displayLogo = logoUrl || defaultLogo;

  return (
    <img 
      src={displayLogo} 
      alt={`${companyName} Logo`}
      className={cn('object-contain', className)}
      onError={(e) => {
        // Se falhar ao carregar, usa o logo padrão
        const target = e.target as HTMLImageElement;
        if (target.src !== defaultLogo) {
          target.src = defaultLogo;
        }
      }}
    />
  );
};
