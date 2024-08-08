import { expect, test } from '@playwright/test';
import { getOptions, parseA11yJson, sanitizeString, setCookie } from '../functions/global-functions';
import AxeBuilder from '@axe-core/playwright';
// @ts-ignore
import fs from 'fs';
import { createHtmlReport } from 'axe-html-reporter';

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

    const pages: string[] = [];

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

            createHtmlReport({
                results: { violations: accessibilityScanResults.violations },
                options: {
                    projectKey: 'MERA: ' + option.url,
                    outputDir: 'a11y-reports',
                    reportFileName: `${sanitizeString(option.url)}.html`,
                },
            });

            pages.push(`${sanitizeString(option.url)}.html`);
        }
    }

    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>All Reports</title>
        </head>
        <body>
            <ul>
                ${pages.map((page) => `<li><a href="${page}">${page}</a></li>`).join('\n')}
            </ul>
        </body>
        </html>
    `;

    if (Object.keys(errors).length > 0) {
        const errorsComplete = JSON.stringify(errors, null, 2);
        fs.writeFileSync('./a11y-reports/a11y-audit-complete.json', errorsComplete);
        fs.writeFileSync('./a11y-reports/a11y-audit-compact.json', parseA11yJson(errors));
    }

    fs.writeFileSync('./a11y-reports/index.html', htmlContent);

    expect(Object.keys(errors).length).toEqual(0);
});
