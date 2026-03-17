import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 15_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL: 'http://localhost:4200',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4200',
    reuseExistingServer: true,
  },
});
