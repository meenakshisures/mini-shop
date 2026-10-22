import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/**
 * Same tests, but visible: one headed Chromium window, one test at a time, slowed down
 * so you can watch items being added to the cart and the checkout being filled in.
 * Used by `npm run test:watch`.
 */
export default defineConfig({
  ...base,
  workers: 1,
  projects: base.projects?.filter((project) => ['setup', 'chromium'].includes(project.name ?? '')),
  use: {
    ...base.use,
    headless: false,
    launchOptions: { slowMo: 700 },
  },
});
