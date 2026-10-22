import { defineConfig, devices } from '@playwright/test';

/** Saved login session, created once by tests/specs/auth.setup.ts and reused by every test. */
export const AUTH_FILE = 'playwright/.auth/user.json';

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
  /* Three browsers in parallel against the dev server get flaky on a laptop, so keep it low. */
  workers: process.env.CI ? 1 : 2,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'reports/playwright-results.json' }],
  ],
  /* The slowest flow (v2 product list, 4s) plus order placement (2s) needs headroom. */
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: 'http://localhost:5173',
    /* Always capture, so passing runs also have evidence in the HTML report. */
    screenshot: 'on',
    trace: 'on',
    video: 'retain-on-failure',
  },

  projects: [
    /* Logs in once and saves the session to AUTH_FILE. */
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    /* Every browser starts already logged in as standard_user.
       Tests that need a logged-out user (login, redirect) opt out with:
       test.use({ storageState: { cookies: [], origins: [] } }) */
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: AUTH_FILE },
      dependencies: ['setup'],
      testIgnore: /.*\.setup\.ts/,
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
