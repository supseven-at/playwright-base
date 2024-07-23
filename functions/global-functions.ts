import { Context } from 'node:vm';
import axios from 'axios';

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
    await context.addCookies([{ name: process.env.COOKIE_NAME, value: cValue, url: url }]);
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
        const response = await axios.post('https://validator.w3.org/nu/?out=json', htmlContent, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
        });

        return response.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Retrieves options from environment variables and returns them as an object.
 *
 * @returns {Promise<{[key: number]: ComparisonOption}>} The options extracted from environment variables.
 */
export async function getOptions() {
    type ComparisonOption = {
        url?: string;
        maxDiffPixelRatio?: number;
        maxDiffPixels?: number;
        disabled?: boolean;
    };

    const opts: {
        [key: number]: ComparisonOption;
    } = {};

    for (const key in process.env) {
        if (key.startsWith('KEY_URL_')) {
            const index = parseInt(key.replace('KEY_URL_', ''), 10);
            if (!opts[index]) {
                opts[index] = {};
            }
            opts[index]['url'] = process.env[key];
        }

        if (key.startsWith('REGRESSION_RATIO_')) {
            const index = parseInt(key.replace('REGRESSION_RATIO_', ''), 10);
            if (!opts[index]) {
                opts[index] = {};
            }
            opts[index]['maxDiffPixelRatio'] = parseFloat(process.env[key]);
        }

        if (key.startsWith('REGRESSION_PIXEL_')) {
            const index = parseInt(key.replace('REGRESSION_PIXEL_', ''), 10);
            if (!opts[index]) {
                opts[index] = {};
            }
            opts[index]['maxDiffPixels'] = parseInt(process.env[key]);
        }

        if (key.startsWith('REGRESSION_DISABLED_')) {
            const index = parseInt(key.replace('REGRESSION_DISABLED_', ''), 10);
            if (!opts[index]) {
                opts[index] = {};
            }
            opts[index]['disabled'] = !!process.env[key];
        }
    }

    return opts;
}

/**
 * Retrieves the file name for a given string and index.
 *
 * @param {string} string - The input string.
 * @param {number} i - The index value.
 * @return {Promise<string>} - The file name.
 */
export async function getFileName(string: string) {
    string = string === '/' ? '/startpage' : string;

    return string.replace('/', '');
}

/**
 * Parses the given A11y JSON data and extracts violations information.
 *
 * @param {Object} data - The A11y JSON data to be parsed.
 * @return {string} - The JSON string representation of the extracted violations.
 */
export function parseA11yJson(data: Object) {
    type Violations = {
        impact?: string;
        description?: string;
        targets?: string[];
        urls?: string[];
    };

    const violations: {
        [key: string]: Violations;
    } = {};

    for (let [key, audit] of Object.entries(data)) {
        for (let [k, violation] of Object.entries(audit.violations)) {
            if (!violations[violation['id']]) {
                violations[violation['id']] = {
                    impact: violation['impact'],
                    description: violation['description'],
                    targets: [],
                    urls: [],
                };
            }

            violation['nodes'].forEach((node: []) => {
                node['target'].forEach((target: string) => {
                    if (new RegExp(/^#c\d+ > /).test(target)) {
                        const parts = target.split(' > ', 2);
                        if (parts.length > 0) {
                            target = target.replace(parts[0] + ' > ', '');
                        }
                    }

                    if (!violations[violation['id']]['targets'].includes(target)) {
                        violations[violation['id']]['targets'].push(target);
                    }

                    if (!violations[violation['id']]['urls'].includes(audit.url)) {
                        violations[violation['id']]['urls'].push(audit.url);
                    }
                });
            });
        }
    }

    return JSON.stringify(violations, null, 2);
}

/**
 * Sanitizes a given string by removing any leading slashes, replacing slashes with dashes,
 * removing any non-alphanumeric characters (except dashes and spaces), and converting the string to lowercase.
 *
 * @param {string} input - The string to be sanitized.
 * @returns {string} - The sanitized string.
 */
export function sanitizeString(input: string) {
    const sanitizedString = input
        .replace(/^\//, '')
        .replace(/\//g, '-')
        .replace(/[\s\W-]+/g, '-')
        .toLowerCase();

    return sanitizedString === '' ? 'startpage' : sanitizedString;
}
