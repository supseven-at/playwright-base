import {expect, Page, test} from '@playwright/test';
import axios from "axios";
import {setCookie} from "../functions/global-functions";

test('has title', async ({page, context}) => {
	await setCookie(context);

	await page.goto('/');
	await expect(page).toHaveTitle(process.env.TEST_TITLE);
});

test('consent', async ({page}) => {
	await page.goto('/');

	await expect(page.locator('#supi__overlay')).toBeVisible();
	await expect(page.locator('#supi__banner')).toBeVisible();
	await expect(page.locator('#supi__individualSwitchTo')).toBeVisible();
	await expect(page.locator('#supi__dismiss')).toBeVisible();
	await expect(page.locator('#supi__allow')).toBeVisible();
	await page.click('#supi__allow');
	await expect(page.locator('#supi__overlay')).toBeHidden();

	const cookies = await page.context().cookies();
	let found = false;

	for (let cookie of cookies) {
		if (cookie.name === process.env.COOKIE_NAME) {
			found = true;
			break;
		}
	}

	expect(found).toBe(true);
});

test('has 404 page', async ({page, context}) => {
    await setCookie(context);
    const response = await page.goto('/i-dont-exist');
    await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
    expect(response.status() === 404);
});

test('w3c checks of key templates', async ({page, context}) => {
    await setCookie(context, process.env.COOKIE_VALUE_NONE_ALLOWED);

    const urls = process.env.TEST_W3C_URLS.split(',');

    for (const url of urls) {
        await page.goto(url);
        const pageContent = await page.content();
        const validationResult = await validateHTML(pageContent);

        if (validationResult.messages.length > 0) {
            console.log(`Validation Error at ${url}: `, validationResult.messages);
        }

        expect(validationResult.messages.length).toBe(0);
    }
});

async function validateHTML(htmlContent) {
    try {
        const response = await axios.post(
            'https://validator.w3.org/nu/?out=json',
            htmlContent,
            {
                headers: {
                    'Content-Type': 'text/html; charset=utf-8'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error(error);
    }
}
