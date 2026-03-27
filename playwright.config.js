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

    // ── Browsers to test against
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'mobile-chrome',
            use: { ...devices['Pixel 7'] },
        },
    ],

    // ── Snapshot configuration
    snapshotPathTemplate: '{testDir}/__snapshots__/{testFilePath}/{arg}{ext}',
    expect: {
        toHaveScreenshot: {
            animations: 'disabled',       // freeze CSS animations for stable snapshots
            maxDiffPixelRatio: 0.02,
        },
    },

    reporter: [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list'],
    ],
});