import { Context } from 'node:vm';
import axios from 'axios';
import * as https from 'node:https';
import { parseStringPromise } from 'xml2js';

/**
 * Sets a cookie in the given context.
 *
 * @param {Context} context - The context in which to set the cookie.
 * @param {string} [cValue=process.env.COOKIE_VALUE] - The value of the cookie to set. Default is the value of process.env.COOKIE_VALUE.
 * @param {string} [url=process.env.BASE_URL] - The URL of the domain for which the cookie should be set. Default is the value of process.env.BASE_URL.
 *
 * @return {Promise<void>} - A promise that resolves when the cookie is set.
 */
export async function setCookie(
    context: Context,
    cValue: string = process.env.COOKIE_VALUE,
    url: string = process.env.BASE_URL,
): Promise<void> {
    await context.addCookies([{ name: process.env.COOKIE_NAME, value: cValue, url: url }]);
}

/**
 * Validates the given HTML content using the W3C HTML Validator API.
 *
 * @param {string} htmlContent - The HTML content to be validated.
 * @returns {Promise} - A promise that resolves with the validation response data.
 */
export async function validateHTML(htmlContent: string): Promise<any> {
    try {
        const response = await axios.post(process.env.W3C_URL, htmlContent, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
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
export async function getOptions(checkFromSitemap: boolean = false): Promise<any> {
    type ComparisonOption = {
        url?: string;
        maxDiffPixelRatio?: number;
        maxDiffPixels?: number;
        disabled?: boolean;
        lighthouse?: boolean;
    };

    const opts: {
        [key: number]: ComparisonOption;
    } = {};

    const sitemapFile = process.env.SITEMAP_URL;

    let urls: string[];
    urls = await getUrlsFromSitemap(sitemapFile);

    if (checkFromSitemap) {
        urls.forEach((url, index) => {
            if (!opts[index]) {
                opts[index] = {};
            }
            opts[index]['url'] = url;
        });

        return opts;
    }

    for (const key in process.env) {
        if (key.startsWith('KEY_URL_')) {
            const index = parseInt(key.replace('KEY_URL_', ''), 10);
            if (!opts[index]) {
                opts[index] = {};
            }
            opts[index]['url'] = process.env[key];
        }

        if (key.startsWith('LIGHTHOUSE_')) {
            const index = parseInt(key.replace('LIGHTHOUSE_', ''), 10);
            if (!opts[index]) {
                opts[index] = {};
            }
            opts[index]['lighthouse'] = !!process.env[key];
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

/**
 * Retrieves the URLs from a sitemap XML file.
 *
 * @param {string} url - The URL of the sitemap XML file to be retrieved.
 * @return {Promise<string[]>} - A promise that resolves with an array of URLs from the sitemap XML file.
 */
export async function getUrlsFromSitemap(url: string): Promise<string[]> {
    const response = await axios.get(url, {
        httpsAgent: new https.Agent({
            rejectUnauthorized: false,
        }),
    });
    const xmlContent = response.data;
    const result = await parseStringPromise(xmlContent);

    return result.urlset.url.map((url: any) => url.loc[0]);
}
