import { expect, test } from '@playwright/test';
import { getOptions, parseA11yJson, setCookie } from '../functions/global-functions';
import AxeBuilder from '@axe-core/playwright';
import fs from 'fs';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

test('key templates', async ({ page, context }) => {
    await setCookie(context);
    const opts = await getOptions();

    type Errors = {
        url?: string;
        violations?: {
            id?: string;
        };
    };

    const errors: {
        [key: number]: Errors;
    } = {};

    for (let [key, option] of Object.entries(opts)) {
        await page.goto(option.url);

        // activate reduced motion
        await page.emulateMedia({ reducedMotion: 'reduce' });

        const accessibilityScanResults = await new AxeBuilder({ page })
            // exclude elements from checks
            // .exclude('#content > .container')

            // check only this elements
            // .include('.classname')

            // disable several rules, when they can not be fixed
            // e.g. color-contrast
            // .disableRules([])
            .withTags(tags)
            .analyze();

        if (accessibilityScanResults.violations.length > 0) {
            errors[key] = errors[key] || {};
            errors[key]['url'] = process.env.BASE_URL + option.url;
            errors[key]['violations'] = accessibilityScanResults.violations;
        }
    }

    if (Object.keys(errors).length > 0) {
        const errorsComplete = JSON.stringify(errors, null, 2);
        fs.writeFileSync('a11y-audit-complete.json', errorsComplete);
        fs.writeFileSync('a11y-audit-compact.json', parseA11yJson(errors));
    }

    expect(Object.keys(errors).length).toEqual(0);
});
