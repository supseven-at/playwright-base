import { expect, test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import { getOptions, setCookie } from '../functions/global-functions';
import { config } from '../lighthouse.config';

test('lighthouse', async ({ page, context }) => {
    await setCookie(context);
    const opts = await getOptions();

    for (let [key, option] of Object.entries(opts)) {
        await page.goto(option.url);

        await playAudit({
            page: page,
            port: 9222,
            config: config,
            thresholds: {
                performance: 90,
                accessibility: 90,
                'best-practices': 90,
                seo: 90,
            },
            disableLogs: true,
        });
    }
});
