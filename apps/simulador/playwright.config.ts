import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    // CORREÇÃO: URL Base limpa, sem o caminho /simulador
    baseURL: 'http://localhost:3000', 
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm --filter simulador dev',
    // O servidor responde nesta URL, mas a home é /simulador
    url: 'http://localhost:3000/simulador', 
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});