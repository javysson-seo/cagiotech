
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAreaTheme } from '@/contexts/AreaThemeContext';

interface AreaThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  showText?: boolean;
}

export const AreaThemeToggle: React.FC<AreaThemeToggleProps> = ({ 
  variant = 'ghost', 
  size = 'sm',
  showText = false 
}) => {
  const { theme, toggleTheme } = useAreaTheme();

  return (
    <Button variant={variant} size={size} onClick={toggleTheme}>
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {showText && (
        <span className="ml-2">
          {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
        </span>
      )}
    </Button>
  );
};
