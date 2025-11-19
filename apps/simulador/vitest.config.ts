import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [], // Adicione setupFiles se precisar de mocks globais
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@goldenbear/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
});