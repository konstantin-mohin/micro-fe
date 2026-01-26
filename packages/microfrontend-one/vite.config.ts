import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'microfrontend-one',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button.tsx',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
  server: {
    port: 5174,
  },
  build: {
    target: 'esnext',
  },
});
