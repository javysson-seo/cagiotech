
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { ptTranslations } from './locales/pt';
import { enTranslations } from './locales/en';

const initI18n = async () => {
  await i18n
    .use(initReactI18next)
    .init({
      resources: {
        pt: { translation: ptTranslations },
        en: { translation: enTranslations }
      },
      lng: localStorage.getItem('language') || 'pt',
      fallbackLng: 'pt',
      interpolation: {
        escapeValue: false
      },
      react: {
        useSuspense: false,
        bindI18n: 'languageChanged loaded',
        bindI18nStore: 'added removed',
        transEmptyNodeValue: '',
        transSupportBasicHtmlNodes: true,
        transKeepBasicHtmlNodesFor: ['br', 'strong', 'i']
      },
      debug: false
    });

  // Listen for language change events
  window.addEventListener('languageChanged', (event: any) => {
    i18n.changeLanguage(event.detail);
  });
};

// Initialize i18n immediately
initI18n();

export default i18n;
