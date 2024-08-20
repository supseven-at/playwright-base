import { expect, test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';
import { getOptions, setCookie } from '../functions/global-functions';
import { config } from '../lighthouse.config';
import { Option } from '../types/types';

test('lighthouse', async ({ page, context }) => {
    const opts: Option[] = await getOptions();

    for (let [key, option] of Object.entries(opts)) {
        if (option.lighthouse === true) {
            await setCookie(context);
            await page.goto(option.url);

            await playAudit({
                page: page,
                port: 9222,
                config: config,
                thresholds: {
                    performance: 100,
                    accessibility: 100,
                    'best-practices': 100,
                    seo: 100,
                },
                disableLogs: false,
            });
        }
    }
});
