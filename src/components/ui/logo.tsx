
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const { theme } = useTheme();
  
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const logoSrc = theme === 'dark' 
    ? '/lovable-uploads/ceef2c27-35ec-471c-a76f-fa4cbb07ecaa.png' // Logo verde para tema escuro
    : '/lovable-uploads/f11d946f-1e84-4046-8622-ffeb54bba33e.png'; // Novo logo verde para tema claro

  return (
    <img
      src={logoSrc}
      alt="CagioTech"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};
