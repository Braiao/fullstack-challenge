import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import path from 'path';

export default defineConfig({
  plugins: [react(), TanStackRouterVite()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@repo/types': path.resolve(__dirname, '../../packages/types/src'),
      '@repo/utils': path.resolve(__dirname, '../../packages/utils/src'),
    },
  },
  server: {
    host: true,
    port: 3000,
  },
});
