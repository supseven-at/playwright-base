import { expect, test } from '@playwright/test';

// beispiel test um strukturierte daten zu testen.
// aktuell gibts keine api für das automatisierte testen, man muss also händisch einen
// test gegen das gefetchte json schreiben.
test('EXAMPLE: structured data', async ({ page, context }) => {
    await page.goto('/karriere/offene-stellen/detail/verkaufsberaterin-im-aussendienst-kaernten-und-steiermark/');

    const structuredData = await page.evaluate(() => {
        const scriptElement = document.querySelector('script[type="application/ld+json"]');
        return JSON.parse(scriptElement.textContent);
    });

    expect(structuredData).toHaveProperty('@type', 'JobPosting');
});
