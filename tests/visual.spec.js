// tests/visual.spec.js
// Visual regression tests for The Crunch
// These tests screenshot key pages and compare them against baselines.
// Run: npx playwright test tests/visual.spec.js
// Update baselines: npx playwright test --update-snapshots

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4173';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Wait for images to fully load before screenshotting */
async function waitForImages(page) {
    await page.waitForFunction(() =>
        Array.from(document.images).every((img) => img.complete)
    );
}

async function waitForApp(page, readySelector = null) {
    // 'load' fires once HTML + resources are done — doesn't wait for XHR/fetch
    await page.waitForLoadState('load');

    // If a specific element is passed, wait for it to appear in the DOM
    if (readySelector) {
        await page.waitForSelector(readySelector, { timeout: 15000 });
    }

    await waitForImages(page);
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('The Crunch — Visual Regression', () => {

    // ── Home Page
    test('Home page renders correctly', async ({ page }) => {
        await page.goto(BASE_URL);
        await waitForApp(page, 'nav');

        // Check key elements are visible
        await expect(page.locator('nav')).toBeVisible();
        await expect(page).toHaveScreenshot('home.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.02, // allow 2% pixel difference (font rendering, etc.)
        });
    });

    // ── Menu Page
    test('Menu page renders all menu cards', async ({ page }) => {
        await page.goto(`${BASE_URL}/menu`);
        await waitForApp(page, '.menu-card');

        // At least one menu card should be present
        const cards = page.locator('[class*="menu"], [class*="card"], [class*="product"]');
        await expect(cards.first()).toBeVisible({ timeout: 8000 });

        await expect(page).toHaveScreenshot('menu.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.02,
        });
    });

    // ── Auth Page
    test('Auth/Login page renders correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/auth`);
        await waitForApp(page);

        await expect(page).toHaveScreenshot('auth.png', {
            maxDiffPixelRatio: 0.02,
        });
    });

    // ── Cart (empty state)
    test('Cart empty state renders correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/cart`);
        await waitForApp(page);

        await expect(page).toHaveScreenshot('cart-empty.png', {
            maxDiffPixelRatio: 0.02,
        });
    });

    // ── 404 Page
    test('404 page renders correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/this-page-does-not-exist`);
        await waitForApp(page);

        await expect(page).toHaveScreenshot('404.png', {
            maxDiffPixelRatio: 0.02,
        });
    });

    // ── Navbar always visible
    test('Navbar is present on all main routes', async ({ page }) => {
        const routes = ['/', '/menu', '/cart'];

        for (const route of routes) {
            await page.goto(`${BASE_URL}${route}`);
            await waitForApp(page, 'nav');

            await expect(
                page.locator('nav'),
                `Navbar missing on route: ${route}`
            ).toBeVisible();
        }
    });

    // ── Mobile viewport — check no overflow / broken layout
    test('Menu page looks correct on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 }); // iPhone 14
        await page.goto(`${BASE_URL}/menu`);
        await waitForApp(page, '.menu-card');

        await expect(page).toHaveScreenshot('menu-mobile.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.03,
        });
    });

    // ── Check for horizontal overflow (broken layout indicator)
    test('No horizontal overflow on Home page', async ({ page }) => {
        await page.goto(BASE_URL);
        await waitForApp(page, 'nav');

        const overflows = await page.evaluate(() => {
            const docWidth = document.documentElement.scrollWidth;
            const viewWidth = document.documentElement.clientWidth;
            return docWidth > viewWidth;
        });

        expect(overflows, 'Horizontal overflow detected — layout may be broken').toBe(false);
    });
});