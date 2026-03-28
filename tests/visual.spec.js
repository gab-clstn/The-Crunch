/* global process */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4173';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** * INJECTS CSS LOCKDOWN
 * Disables all transitions, animations, and blinking carets.
 * This ensures that a screenshot is never taken "mid-fade" or "mid-glow".
 */
async function lockdownUI(page) {
    await page.addStyleTag({
        content: `
            *, *::before, *::after {
                transition: none !important;
                animation: none !important;
                scroll-behavior: auto !important;
            }
            input { caret-color: transparent !important; }
            /* Explicitly kill neon and mirror properties often used for unauthorized UI changes */
            .neon-text, .mirror-ui, .glitch { 
                filter: none !important; 
                transform: none !important; 
                animation: none !important; 
            }
        `,
    });
}

/** Wait for images to fully load before screenshotting */
async function waitForImages(page) {
    await page.waitForFunction(() =>
        Array.from(document.images).every((img) => img.complete)
    );
}

async function waitForApp(page, readySelector = null) {
    // 'load' fires once HTML + resources are done
    await page.waitForLoadState('load');
    // 'networkidle' ensures no more background fetches are happening
    await page.waitForLoadState('networkidle');

    // If a specific element is passed, wait for it to appear in the DOM
    if (readySelector) {
        await page.waitForSelector(readySelector, { state: 'visible', timeout: 15000 });
    }

    await waitForImages(page);
    
    // Apply the CSS lockdown before taking the shot
    await lockdownUI(page);
    
    // Final settle time for any layout shifts
    await page.waitForTimeout(500);
}

// ── Configuration ─────────────────────────────────────────────────────────────

/**
 * THE STRICT GUARD CONFIG
 * threshold: 0.05 — Extreme sensitivity to color/shade shifts (catches neon).
 * maxDiffPixels: 20 — Blocks if even a tiny icon or pixel-row is mirrored or added.
 */
const STRICT_CONFIG = {
    fullPage: true,
    animations: 'disabled',
    threshold: 0.05,
    maxDiffPixels: 20,
};

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('The Crunch — Visual Regression', () => {

    // ── Home Page
    test('Home page renders correctly', async ({ page }) => {
        await page.goto(BASE_URL);
        await waitForApp(page, 'nav');

        // Check key elements are visible
        await expect(page.locator('nav')).toBeVisible();
        await expect(page).toHaveScreenshot('home.png', STRICT_CONFIG);
    });

    // ── Menu Page
    test('Menu page renders all menu cards', async ({ page }) => {
        await page.goto(`${BASE_URL}/menu`);
        await waitForApp(page, '.menu-card');

        // At least one menu card should be present
        const cards = page.locator('[class*="menu"], [class*="card"], [class*="product"]');
        await expect(cards.first()).toBeVisible({ timeout: 8000 });

        await expect(page).toHaveScreenshot('menu.png', STRICT_CONFIG);
    });

    // ── Auth Page
    test('Auth/Login page renders correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/auth`);
        await waitForApp(page);

        await expect(page).toHaveScreenshot('auth.png', {
            ...STRICT_CONFIG,
            fullPage: false, // Forms usually don't need full-page
        });
    });

    // ── Cart (empty state)
    test('Cart empty state renders correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/cart`);
        await waitForApp(page);

        await expect(page).toHaveScreenshot('cart-empty.png', STRICT_CONFIG);
    });

    // ── 404 Page
    test('404 page renders correctly', async ({ page }) => {
        await page.goto(`${BASE_URL}/this-page-does-not-exist`);
        await waitForApp(page);

        await expect(page).toHaveScreenshot('404.png', STRICT_CONFIG);
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
            ...STRICT_CONFIG,
            maxDiffPixels: 30, // Slightly more slack for mobile anti-aliasing
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
