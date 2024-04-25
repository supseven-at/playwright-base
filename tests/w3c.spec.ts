import { expect, test } from '@playwright/test';
import {getOptions, setCookie, validateHTML} from '../functions/global-functions';

test('w3c checks of key templates', async ({ page, context }) => {
    await setCookie(context);
    const opts = await getOptions();

    for (let [key, option] of Object.entries(opts)) {
        await page.goto(option.url);
        const h1 = await page.$$('#content h1');
        expect(h1.length).toBe(1);

        const pageContent = await page.content();
        const validationResult = await validateHTML(pageContent);

        // wenn es nötig ist, meldungen zu entfernen, weil der aufwand, diese zu fixen, zu gross ist
        // oder nicht in unserer hand liegt (externe dinge zb)
        /*
        if (validationResult.messages.length > 0) {
            validationResult.messages = validationResult.messages.filter((k: any) => {
                return (
                    k.message !==
                    'Attribute “aria-required” is unnecessary for elements that have attribute “required”.'
                );
            });
        }
        */

        if (validationResult.messages.length > 0) {
            console.log(`Validation Error at ${option.url}: `, validationResult.messages);
        }

        expect(validationResult.messages.length).toBe(0);
    }
});
