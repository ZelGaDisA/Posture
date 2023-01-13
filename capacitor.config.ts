import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.healthUapp.posture',
  appName: 'Posture Check',
  webDir: 'build',
  bundledWebRuntime: false,
  plugins:{
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#ffffffff',
      launchAutoHide: true,
      androidSplashResourceName: 'launch_splash',
    }
  }
};

export default config;
