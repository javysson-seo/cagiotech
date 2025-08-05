
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  language: 'pt' | 'en';
  changeLanguage: (lang: 'pt' | 'en') => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'pt' | 'en'>('pt');
  const { i18n } = useTranslation();

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as 'pt' | 'en';
    if (storedLang && (storedLang === 'pt' || storedLang === 'en')) {
      setLanguage(storedLang);
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  const changeLanguage = async (lang: 'pt' | 'en') => {
    try {
      setLanguage(lang);
      localStorage.setItem('language', lang);
      await i18n.changeLanguage(lang);
      
      // Force re-render by dispatching a custom event
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    } catch (error) {
      console.error('Error changing language:', error);
      throw error;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
