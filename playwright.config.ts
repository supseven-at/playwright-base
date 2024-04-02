import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
require("dotenv").config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    timeout: 10 * 60 * 1000,
    testDir: "./tests",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [["html", { open: "always" }], ["list"]],
        use: {
        trace: "on-first-retry",
    },
    projects: [
        {
            name: "chromium",
            use: {
                ...devices["Desktop Chrome"],
                baseURL: process.env.BASE_URL,
            },
            testMatch: ["**/base.spec.ts", "**/w3c.spec.ts", "**/a11y.spec.ts"],
        },
        {
            name: "firefox",
            use: {
                ...devices["Desktop Chrome"],
                baseURL: process.env.BASE_URL,
            },
            testMatch: "**/base.spec.ts",
        },
        {
            name: "webkit",
            use: {
                ...devices["Desktop Chrome"],
                baseURL: process.env.BASE_URL,
            },
            testMatch: "**/base.spec.ts",
        },
        {
            name: "mobile chrome",
            use: {
                ...devices["Pixel 5"],
                baseURL: process.env.BASE_URL,
            },
            testMatch: ["**/base.spec.ts"],
        },
        {
            name: "mobile ios",
            use: {
                ...devices["iPhone 12"],
                baseURL: process.env.BASE_URL,
            },
            testMatch: "**/base.spec.ts",
        },
    ],
});
