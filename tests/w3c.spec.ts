import { expect, Page, test } from "@playwright/test";
import axios from "axios";
import { setCookie } from "../functions/global-functions";

test("w3c checks of key templates", async ({ page, context }) => {
    await setCookie(context, process.env.COOKIE_VALUE_NONE_ALLOWED);

    const urls = process.env.KEY_URLS.split(",");

    for (const url of urls) {
        await page.goto(url);
        const h1 = await page.$$("#content h1");
        expect(h1.length).toBe(1);

        const pageContent = await page.content();
        const validationResult = await validateHTML(pageContent);

        if (validationResult.messages.length > 0) {
            console.log(
                `Validation Error at ${url}: `,
                validationResult.messages,
            );
        }

        expect(validationResult.messages.length).toBe(0);
    }
});

async function validateHTML(htmlContent) {
    try {
        const response = await axios.post(
            "https://validator.w3.org/nu/?out=json",
            htmlContent,
            {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                },
            },
        );

        return response.data;
    } catch (error) {
        console.error(error);
    }
}
