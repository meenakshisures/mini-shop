import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the Mini Shop POC.
 * Specs are generated into tests/specs, Page Objects into tests/pages.
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/specs',
  /* Screenshots, traces and videos for each run are written here. */
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  /* No automatic retries: the agent controls retries and records each attempt. */
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  /* The slowest flow (v2 product list, 4s) plus order placement (2s) needs headroom. */
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Start the Mini Shop dev server automatically if it is not already running. */
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
