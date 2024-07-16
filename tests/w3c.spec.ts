import { expect, test } from '@playwright/test';
import { getOptions, setCookie, validateHTML } from '../functions/global-functions';

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
            const ignoredMessages = [
                /^Attribute “pid” not allowed on element/,
                /^Attribute “element-type” not allowed on element/,
                /^Duplicate ID/,
                /^The first occurrence/,
                /^Element “style” not allowed as child of element/,
                'Bad value “” for attribute “id” on element “script”: An ID must not be the empty string.',
                'The “type” attribute is unnecessary for JavaScript resources.',
                /^Bad value “(.*)” for attribute “autocomplete”/,
                'Text run is not in Unicode Normalization Form C.',
            ];

            validationResult.messages = validationResult.messages.filter((k: any) =>
                !ignoredMessages.some((ignoredMessage: any) =>
                    ignoredMessage instanceof RegExp ? ignoredMessage.test(k.message) : ignoredMessage === k.message
                )
            );
        }
        */

        if (validationResult.messages.length > 0) {
            console.log(`Validation Error at ${option.url}: `, validationResult.messages);
        }

        expect(validationResult.messages.length).toBe(0);
    }
});
