import { expect, test } from '@playwright/test';
import { setCookie, getFileName, getOptions } from '../functions/global-functions';

test.describe.serial('visual regression', () => {
    test('reference (might fail in the first run)', async ({ page, context }, testInfo) => {
        await setCookie(context, process.env.COOKIE_VALUE, process.env.LIVE_BASE_URL);
        const opts = await getOptions();

        for (let [key, option] of Object.entries(opts)) {
            await page.goto(process.env.LIVE_BASE_URL + option.url);
            await page.waitForLoadState('networkidle');
            const fileName = (await getFileName(option.url)) + '.png';

            if (!option.disabled) {
                expect(
                    await page.screenshot({
                        fullPage: true,
                        mask: [page.locator('.slider > div'), page.locator('.top-bar__logo')],
                    }),
                ).toMatchSnapshot('reference-' + fileName);
            }
        }
    });

    test('test', async ({ page, context }, testInfo) => {
        await setCookie(context);
        const opts = await getOptions();

        for (let [key, option] of Object.entries(opts)) {
            const fileName = (await getFileName(option.url)) + '.png';

            await page.goto(option.url);
            await page.waitForLoadState('networkidle');
            await page.evaluate(() => {
                document.body.classList.remove('develop');
            });

            if (!option.disabled) {
                expect(
                    await page.screenshot({
                        fullPage: true,
                        mask: [page.locator('.slider > div'), page.locator('.top-bar__logo')],
                    }),
                ).toMatchSnapshot('reference-' + fileName, {
                    maxDiffPixelRatio: option.maxDiffPixelRatio ?? undefined,
                    maxDiffPixels: option.maxDiffPixels ?? undefined,
                });
            }
        }
    });
});
