import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e15d0864240b4aa494a5dda8699cde5b',
  appName: 'CagioTech',
  webDir: 'dist',
  server: {
    url: 'https://e15d0864-240b-4aa4-94a5-dda8699cde5b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false
    }
  }
};

export default config;
