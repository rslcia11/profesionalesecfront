import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuempresa.profesionalesec',
  appName: 'ProfesionalEs',
  webDir: 'out',
  server: {
    url: 'http://10.0.2.2:3001'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;
