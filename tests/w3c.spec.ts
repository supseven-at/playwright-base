import { expect, test } from '@playwright/test';
import { setCookie, validateHTML } from '../functions/global-functions';

test('w3c checks of key templates', async ({ page, context }) => {
    await setCookie(context);

    const urls = process.env.KEY_URLS.split(',');

    for (const url of urls) {
        await page.goto(url);
        const h1 = await page.$$('#content h1');
        expect(h1.length).toBe(1);

        const pageContent = await page.content();
        const validationResult = await validateHTML(pageContent);

        if (validationResult.messages.length > 0) {
            console.log(`Validation Error at ${url}: `, validationResult.messages);
        }

        expect(validationResult.messages.length).toBe(0);
    }
});
