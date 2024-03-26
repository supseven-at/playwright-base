import {Context} from "node:vm";

export async function setCookie(context: Context, cValue = process.env.COOKIE_VALUE, url = process.env.BASE_URL) {
    await context.addCookies([
        {name: process.env.COOKIE_NAME, value: cValue, url: url},
    ]);
}
