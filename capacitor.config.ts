import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.healthUapp.posture',
  appName: 'Posture: AI Medical Assistant',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins:{
    SplashScreen: {
      launchShowDuration: 4000,
    }
  }
};

export default config;
