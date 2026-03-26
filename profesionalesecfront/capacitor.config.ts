import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tuempresa.profesionalesec',
  appName: 'ProfesionalEs',
  webDir: 'out',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'http://10.0.2.2:3001'
  },
  android: {
    backgroundColor: '#ffffff'
  }
};

export default config;

// para android studio usar http://10.0.2.2:3001 y para ios emulator usar http://localhost:3001