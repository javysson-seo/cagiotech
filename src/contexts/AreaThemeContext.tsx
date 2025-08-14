
import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';
type AreaType = 'box' | 'admin' | 'student' | 'trainer';

interface AreaThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  setAreaTheme: (area: AreaType, theme: ThemeMode) => void;
  getAreaTheme: (area: AreaType) => ThemeMode;
}

const AreaThemeContext = createContext<AreaThemeContextType | undefined>(undefined);

export const useAreaTheme = () => {
  const context = useContext(AreaThemeContext);
  if (context === undefined) {
    throw new Error('useAreaTheme must be used within an AreaThemeProvider');
  }
  return context;
};

interface AreaThemeProviderProps {
  children: React.ReactNode;
  area: AreaType;
}

export const AreaThemeProvider: React.FC<AreaThemeProviderProps> = ({ children, area }) => {
  const [themes, setThemes] = useState<Record<AreaType, ThemeMode>>({
    box: 'light',
    admin: 'light', 
    student: 'light',
    trainer: 'light'
  });

  useEffect(() => {
    // Carrega temas salvos no localStorage para cada área
    const savedThemes = localStorage.getItem('area-themes');
    if (savedThemes) {
      try {
        const parsedThemes = JSON.parse(savedThemes);
        setThemes(parsedThemes);
      } catch (error) {
        console.error('Erro ao carregar temas das áreas:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Aplica o tema específico da área atual
    const currentTheme = themes[area];
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, [themes, area]);

  const setAreaTheme = (targetArea: AreaType, theme: ThemeMode) => {
    const newThemes = { ...themes, [targetArea]: theme };
    setThemes(newThemes);
    localStorage.setItem('area-themes', JSON.stringify(newThemes));
    
    // Se estivermos na área alvo, aplica o tema imediatamente
    if (targetArea === area) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  };

  const toggleTheme = () => {
    const newTheme = themes[area] === 'light' ? 'dark' : 'light';
    setAreaTheme(area, newTheme);
  };

  const getAreaTheme = (targetArea: AreaType): ThemeMode => {
    return themes[targetArea];
  };

  return (
    <AreaThemeContext.Provider 
      value={{ 
        theme: themes[area], 
        toggleTheme, 
        setAreaTheme, 
        getAreaTheme 
      }}
    >
      {children}
    </AreaThemeContext.Provider>
  );
};
