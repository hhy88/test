import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.laws.software',
  appName: '软件工程法则',
  webDir: 'dist',
  android: {
    backgroundColor: '#faf9f7'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#5c6bc0',
      showSpinner: false
    }
  }
};

export default config;
