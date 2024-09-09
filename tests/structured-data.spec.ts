import { expect, test } from '@playwright/test';
import { setCookie } from '../functions/global-functions';
import { structuredDataTest } from 'structured-data-testing-tool';

test('check structured data using structured-data-testing-tool', async ({ page, context }) => {
    await page.goto('/aktuelles');
    await setCookie(context);
    const htmlContent = await page.content();

    // see https://github.com/iaincollins/structured-data-testing-tool
    // for more infos and options
    const results = await structuredDataTest(htmlContent, {
        schemas: ['Article'],
    });

    expect(results.passed.length).toBeGreaterThan(0);
    expect(results.failed.length).toBe(0);
});
