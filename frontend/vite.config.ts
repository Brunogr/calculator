import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(frontendRoot, '..');

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, projectRoot, '');
  const backendPort = env.BACKEND_PORT || process.env.BACKEND_PORT || '3000';
  const frontendPort = env.FRONTEND_PORT || process.env.FRONTEND_PORT || '5173';
  const apiBaseUrl =
    env.VITE_API_BASE_URL ||
    process.env.VITE_API_BASE_URL ||
    `http://localhost:${backendPort}`;

  return {
  plugins: [react()],
  envDir: projectRoot,
  define:
    mode === 'test'
      ? undefined
      : {
          'import.meta.env.VITE_API_BASE_URL': JSON.stringify(apiBaseUrl),
        },
  server: {
    host: true,
    port: Number(frontendPort),
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true,
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/test/**', 'src/**/*.test.{ts,tsx}', 'src/vite-env.d.ts'],
      thresholds: {
        lines: 80,
        statements: 80,
      },
    },
  },
};
});
