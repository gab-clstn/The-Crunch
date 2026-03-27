/* eslint-env node */
/* global process */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 30_000,
    retries: 1,

    use: {
        baseURL: process.env.TEST_BASE_URL || 'http://localhost:4173',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'on-first-retry',
    },

    projects: [
        {
            name: 'chromium',
            snapshotDir: 'tests/__snapshots__/chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile-chrome',
            snapshotDir: 'tests/__snapshots__/mobile-chrome',
            use: { ...devices['Pixel 5'] },
        },
    ],

    expect: {
        toHaveScreenshot: {
            animations: 'disabled',
            maxDiffPixelRatio: 0.02,
        },
    },

    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list'],
    ],
});