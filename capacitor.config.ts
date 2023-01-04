import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.posture',
  appName: 'healthUapp Posture Check',
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
