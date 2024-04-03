import {Context} from "node:vm";
import axios from "axios";

/**
 * Sets a cookie in the given context.
 *
 * @param {Context} context - The context in which to set the cookie.
 * @param {string} [cValue=process.env.COOKIE_VALUE] - The value of the cookie to set. Default is the value of process.env.COOKIE_VALUE.
 * @param {string} [url=process.env.BASE_URL] - The URL of the domain for which the cookie should be set. Default is the value of process.env.BASE_URL.
 *
 * @return {Promise<void>} - A promise that resolves when the cookie is set.
 */
export async function setCookie(context: Context, cValue = process.env.COOKIE_VALUE, url = process.env.BASE_URL) {
    await context.addCookies([
        {name: process.env.COOKIE_NAME, value: cValue, url: url},
    ]);
}


/**
 * Get the path from a given URL.
 *
 * @param {string} url - The URL to extract the path from.
 * @return {string} The path of the URL.
 */
export function getPathFromUrl(url: string) {
    const urlObj = new URL(url);
    return urlObj.pathname;
}

/**
 * Validates the given HTML content using the W3C HTML Validator API.
 *
 * @param {string} htmlContent - The HTML content to be validated.
 * @returns {Promise} - A promise that resolves with the validation response data.
 */
export async function validateHTML(htmlContent) {
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
