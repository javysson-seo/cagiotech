import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useMobileDetection = () => {
  const [isMobileApp, setIsMobileApp] = useState(false);
  const [platform, setPlatform] = useState<'web' | 'ios' | 'android'>('web');

  useEffect(() => {
    const isNative = Capacitor.isNativePlatform();
    const currentPlatform = Capacitor.getPlatform();
    
    setIsMobileApp(isNative);
    setPlatform(currentPlatform as 'web' | 'ios' | 'android');
  }, []);

  return {
    isMobileApp,
    platform,
    isWeb: platform === 'web',
    isIOS: platform === 'ios',
    isAndroid: platform === 'android'
  };
};
