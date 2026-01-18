import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'test',
  timeout: 30000,
  use: {
    browserName: 'chromium',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
});