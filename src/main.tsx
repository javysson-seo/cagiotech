
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './i18n/config';
import App from './App.tsx';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { ToastProvider } from './components/ui/toast-system';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);
