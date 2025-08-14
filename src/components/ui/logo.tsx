
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
    : '/lovable-uploads/fee1aacf-ce3c-48a6-be45-4989d5e1b695.png'; // Logo preto para tema claro

  return (
    <img
      src={logoSrc}
      alt="CagioTech"
      className={`${sizeClasses[size]} ${className}`}
    />
  );
};
