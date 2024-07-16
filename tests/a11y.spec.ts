import { expect, test } from '@playwright/test';
import { getOptions, setCookie } from '../functions/global-functions';
import AxeBuilder from '@axe-core/playwright';

const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];

test('key templates', async ({ page, context }) => {
    await setCookie(context);
    const opts = await getOptions();

    for (let [key, option] of Object.entries(opts)) {
        await page.goto(option.url);

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

        expect(accessibilityScanResults.violations).toEqual([]);
    }
});
