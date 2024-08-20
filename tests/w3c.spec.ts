import { expect, test } from '@playwright/test';
import { getOptions, setCookie, validateHTML } from '../functions/global-functions';
import * as fs from 'fs';
import { Option } from '../types/types';

test('w3c checks of key templates', async ({ page, context }) => {
    await setCookie(context);

    const fromSitemap = process.env.TESTFROMSITEMAP === 'true';
    const opts: Option[] = await getOptions(fromSitemap);

    type Validations = {
        message?: string[];
        extract?: string[];
        urls?: string[];
    };

    const validations: {
        [key: string]: Validations;
    } = {};

    // wenn es nötig ist, meldungen zu entfernen, weil der aufwand, diese zu fixen, zu gross ist
    // oder nicht in unserer hand liegt (externe dinge zb)
    // reguläre ausdrücke oder normale strings
    const ignoredMessages = [
        // /^Attribute “pid” not allowed on element/,
        // /^Attribute “element-type” not allowed on element/,
        // /^Duplicate ID/,
        // /^The first occurrence/,
        // /^Element “style” not allowed as child of element/,
        // 'Bad value “” for attribute “id” on element “script”: An ID must not be the empty string.',
        // 'The “type” attribute is unnecessary for JavaScript resources.',
        // /^Bad value “(.*)” for attribute “autocomplete”/,
        // 'Text run is not in Unicode Normalization Form C.',
    ];

    // use own ddev service container to test, when you have to test more than 10 pages
    if (Object.keys(opts).length > 10) {
        const w3cService = new URL(process.env.W3C_URL);
        expect(w3cService.host).not.toBe('validator.w3.org');
    }

    for (let [key, option] of Object.entries(opts)) {
        await page.goto(option.url);
        await setCookie(context);

        const h1 = await page.$$('#content h1');
        const pageContent = await page.content();
        const validationResult = await validateHTML(pageContent);

        if (validationResult.messages.length > 0) {
            validationResult.messages = validationResult.messages.filter(
                (k: any) =>
                    !ignoredMessages.some((ignoredMessage: any) =>
                        ignoredMessage instanceof RegExp
                            ? ignoredMessage.test(k.message)
                            : ignoredMessage === k.message,
                    ),
            );

            validationResult.messages.forEach((message: any) => {
                if (!validations[message.type]) {
                    validations[message.type] = {
                        message: [],
                        extract: [],
                        urls: [],
                    };
                }

                if (!validations[message.type]['message'].includes(message.message)) {
                    validations[message.type]['message'].push(message.message);
                }

                if (!validations[message.type]['extract'].includes(message.extract)) {
                    validations[message.type]['extract'].push(message.extract);
                }

                if (!validations[message.type]['urls'].includes(option.url)) {
                    validations[message.type]['urls'].push(option.url);
                }
            });
        }

        if (h1.length !== 1) {
            if (!validations['heading']) {
                validations['heading'] = {
                    urls: [],
                };
            }

            if (!validations['heading']['urls']) {
                validations['heading']['urls'] = [];
            }

            validations['heading']['urls'].push(option.url + ' (Anzahl: ' + h1.length + ')');
        }
    }

    if (Object.keys(validations).length > 0) {
        if (!fs.existsSync('./w3c-reports')) {
            fs.mkdirSync('./w3c-reports');
        }

        fs.writeFileSync('./w3c-reports/w3c-audit-compact.json', JSON.stringify(validations, null, 2));
    }

    expect(validations['error']).toBeUndefined();
    expect(validations['heading']).toBeUndefined();
});
