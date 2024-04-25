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
            .exclude('#content > .container')
            .withTags(tags)
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    }
});

// example tests

/*
test("main navigation desktop", async ({ page, context }, testInfo) => {
    if (testInfo.project.name === "chromium") {
        await setCookie(context, process.env.COOKIE_VALUE_NONE_ALLOWED);
        await page.goto("/");

        await page
            .getByRole("button", {
                name: "Dropdown für den Menupunkt 'Der Orden' öffnen",
            })
            .first()
            .click();

        await page.locator(".submenu.open").waitFor();

        const accessibilityScanResultsFirstLayer = await new AxeBuilder({
            page,
        })
            .include(".submenu.open")
            .withTags([
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag21aa",
                "wcag22aa",
                "best-practice",
            ])
            .analyze();

        expect(accessibilityScanResultsFirstLayer.violations).toEqual([]);

        await page
            .getByRole("button", {
                name: "Dropdown für 'Die Ordensgemeinschaft' öffnen",
            })
            .first()
            .click();
        await page.locator(".submenu.open .submenu.open").waitFor();

        const accessibilityScanResultsSecondLayer = await new AxeBuilder({
            page,
        })
            .include(".submenu.open .submenu.open")
            .analyze();

        expect(accessibilityScanResultsSecondLayer.violations).toEqual([]);
    } else {
        console.log("main navigation for mobile has its own test");
    }
});

test("main navigation mobile", async ({ page, context }, testInfo) => {
    if (testInfo.project.name === "mobile chrome") {
        await setCookie(context, process.env.COOKIE_VALUE_NONE_ALLOWED);
        await page.goto("/");

        await page.getByLabel("Hauptmenü").click();
        await page.locator(".navigation-main").waitFor();

        const accessibilityScanResultsOpenNavigation = await new AxeBuilder({
            page,
        })
            .include(".navigation-main, .navigation-meta")
            .withTags([
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag21aa",
                "wcag22aa",
                "best-practice",
            ])
            .analyze();

        expect(accessibilityScanResultsOpenNavigation.violations).toEqual([]);

        await page
            .getByLabel("Dropdown für den Menupunkt 'Der Orden' öffnen")
            .click();
        await page.locator(".submenu.open").waitFor();

        const accessibilityScanResultsFirstLayer = await new AxeBuilder({
            page,
        })
            .include(".submenu.open")
            .withTags([
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag21aa",
                "wcag22aa",
                "best-practice",
            ])
            .analyze();

        expect(accessibilityScanResultsFirstLayer.violations).toEqual([]);

        await page
            .getByLabel("Dropdown für 'Die Ordensgemeinschaft' öffnen")
            .click();
        await page.locator(".submenu.open .submenu.open").waitFor();

        const accessibilityScanResultsSecondLayer = await new AxeBuilder({
            page,
        })
            .include(".submenu.open .submenu.open")
            .withTags([
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag21aa",
                "wcag22aa",
                "best-practice",
            ])
            .analyze();

        expect(accessibilityScanResultsSecondLayer.violations).toEqual([]);
    } else {
        console.log("main navigation for desktop has its own test");
    }
});

test("quicklinks mobile", async ({ page, context }, testInfo) => {
    if (testInfo.project.name === "mobile chrome") {
        await setCookie(context, process.env.COOKIE_VALUE_NONE_ALLOWED);
        await page.goto("/");
        await page
            .getByRole("button", { name: "Die Wirkfelder: aus-/" })
            .click();
        await page.locator(".quicklinks__list.show").waitFor();

        const accessibilityScanResultsQuicklinks = await new AxeBuilder({
            page,
        })
            .include(".quicklinks__list.show")
            .withTags([
                "wcag2a",
                "wcag2aa",
                "wcag21a",
                "wcag21aa",
                "wcag22aa",
                "best-practice",
            ])
            .analyze();

        expect(accessibilityScanResultsQuicklinks.violations).toEqual([]);
    } else {
        console.log("quicklinks desktop dont need a test");
    }
});
*/
