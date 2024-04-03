import { expect, test } from '@playwright/test';
import { setCookie } from '../functions/global-functions';

test('has title', async ({ page, context }) => {
    await setCookie(context);

    await page.goto('/');
    await expect(page).toHaveTitle(process.env.TEST_TITLE);
});

test('consent', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('#supi__overlay')).toBeVisible();
    await expect(page.locator('#supi__banner')).toBeVisible();
    await expect(page.locator('#supi__individualSwitchTo')).toBeVisible();
    await expect(page.locator('#supi__dismiss')).toBeVisible();
    await expect(page.locator('#supi__allow')).toBeVisible();
    await page.click('#supi__allow');
    await expect(page.locator('#supi__overlay')).toBeHidden();

    const cookies = await page.context().cookies();
    let found = false;

    for (let cookie of cookies) {
        if (cookie.name === process.env.COOKIE_NAME) {
            found = true;
            break;
        }
    }

    expect(found).toBe(true);
});

test('has 404 page', async ({ page, context }) => {
    await setCookie(context);
    const response = await page.goto('/i-dont-exist');
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
    expect(response.status() === 404);
});

test('has robots.txt', async ({ page, context }) => {
    await setCookie(context);

    const response = await page.goto('/robots.txt');
    let correctRobotsFileContent = false;

    if (response.status() === 200) {
        const txt = await response.text();

        if (txt.length > 0) {
            correctRobotsFileContent = true;
        }

        if (txt.includes('User-agent: *') && txt.includes('Disallow:')) {
            correctRobotsFileContent = true;
        }
    }

    expect(correctRobotsFileContent).toBe(true);
});

test('has sitemap.xml', async ({ page, context }) => {
    await setCookie(context);
    const response = await page.goto('/sitemap.xml');
    expect(response.status() === 200).toBe(true);
});
