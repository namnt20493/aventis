import { EOL } from "os";
import { Commons } from "./commons";
import { formatTestData } from "./test-data-formatter";
import { WorksheetConfig } from "./worksheet-config-parser";

interface BuilderOptions {
    testcaseName: string;
    fileImports: { [key: string]: string };
    actionTestCase: any[];
    keywrodsClass: any;
    config: WorksheetConfig;
    isTestable: boolean;
    testableKey?: string;
    fileName: string;
}

/**
 * Builds the content of a Playwright .spec.ts file based on provided options.
 */
export class TestFileBuilder {
    private builder: string[] = [];
    private options: BuilderOptions;

    constructor(options: BuilderOptions) {
        this.options = options;
    }

    private sanitizePath(str: string): string {
        if (!str) return str;
        return str.replace(/[<>:"/\\|?\*\[\]]/g, "_");
    }

    private sanitizeStringLiteral(str: string): string {
        if (!str) return str;
        return str
            .replace(/\\/g, "\\\\") // Escape backslashes first
            .replace(/'/g, "\\'") // Escape single quotes
            .replace(/"/g, '\\"') // Escape double quotes
            .replace(/\n/g, "\\n") // Escape newlines
            .replace(/\r/g, "\\r") // Escape carriage returns
            .replace(/\t/g, "\\t"); // Escape tabs
    }

    private sanitizeIdentifier(str: string): string {
        if (!str) return str;
        // Replace invalid characters with underscores
        let sanitized = str.replace(/[^a-zA-Z0-9_$]/g, "_");
        // Ensure it doesn't start with a number
        if (/^\d/.test(sanitized)) {
            sanitized = "_" + sanitized;
        }
        return sanitized;
    }

    private sanitizeTestName(str: string): string {
        if (!str) return str;
        return str.replace(/'/g, "\\'").replace(/\n/g, " ").replace(/\r/g, " ").replace(/\t/g, " ");
    }

    private buildImportsAndFixture() {
        const { fileImports, config, isTestable, testableKey } = this.options;
        const { slowMoVal, testTimeout, videoSetting } = config;

        if (isTestable) {
            this.builder.push("import { Page } from '@playwright/test';");
            this.builder.push("import * as fs from 'fs';");
            this.builder.push("import * as path from 'path';");
            this.builder.push("import { createFixture as createTestableFixture } from 'testable-playwright-test';");
        } else if (slowMoVal && slowMoVal > 0) {
            this.builder.push("import { test as base, chromium, Browser, BrowserContext, Page } from '@playwright/test';");
            this.builder.push("import * as fs from 'fs';");
            this.builder.push("import * as path from 'path';");
            this.builder.push("import * as DateHelper from './../../libs/utils/helpers/DateHelper';");
        } else {
            this.builder.push("import { test, Page } from '@playwright/test';");
            this.builder.push("import * as fs from 'fs';");
            this.builder.push("import * as path from 'path';");
            this.builder.push("import * as DateHelper from './../../libs/utils/helpers/DateHelper';");
        }

        this.builder.push("");
        Object.keys(fileImports).forEach((keyClass) => this.builder.push(`import {${keyClass}} from './../../libs/keywords/${fileImports[keyClass]}';`));
        this.builder.push("");
        this.builder.push("const parameterFilePath = path.join(__dirname, './../../parameter.json');");
        this.builder.push("const p = JSON.parse(fs.readFileSync(parameterFilePath, 'utf8'));");
        this.builder.push("");

        if (isTestable) {
            this.builder.push("const test = createTestableFixture({");
            this.builder.push("    serverUrl: 'wss://playwright.testable.io/',");
            const sanitizedKey = this.sanitizeStringLiteral(testableKey || "");
            this.builder.push(`    key: '${sanitizedKey}',`);
            this.builder.push("    source: 'Azure - Testable Account',");
            this.builder.push("    region: 'eastus',");
            this.builder.push("    multiplier: '4',");
            this.builder.push("    screenshot: 'afterFailed',");
            this.builder.push("});");
        } else if (slowMoVal && slowMoVal > 0) {
            this.builder.push(`type Fixtures = {\n  browser: Browser;\n  context: BrowserContext;\n  page: Page;\n};`);
            this.builder.push("");
            this.builder.push(`const test = base.extend<Fixtures>({`);
            this.builder.push("  browser: async ({ }, use) => {");
            this.builder.push(`    const browser = await chromium.launch({ headless: false, slowMo: ${slowMoVal}, args: ["--start-maximized"] });`);
            this.builder.push("    await use(browser);");
            this.builder.push("    await browser.close();");
            this.builder.push("  },");
            this.builder.push("  context: async ({ browser }, use) => {");
            this.builder.push("    const context = await browser.newContext({ viewport: null });");
            this.builder.push("    await use(context);");
            this.builder.push("    await context.close();");
            this.builder.push("  },");
            this.builder.push("  page: async ({ context }, use) => {");
            this.builder.push("    const page = await context.newPage();");
            this.builder.push("    await use(page);");
            this.builder.push("    await page.close();");
            this.builder.push("  },");
            this.builder.push("});");
        }

        if (!isTestable) {
            if (videoSetting === "video") {
                this.builder.push(`test.use({ video: { mode: 'on', size: { width: 1920, height: 1080 } } });`);
            } else {
                this.builder.push(`test.use({ video: { mode: 'retain-on-failure', size: { width: 1920, height: 1080 }  } });`);
            }
            if (testTimeout && !process.env.IGNORE_GENERATED_TIMEOUT) {
                this.builder.push(`test.setTimeout(${testTimeout});`);
            }
        }
        this.builder.push("");
    }

    private buildTestBody() {
        const { testcaseName, fileImports, actionTestCase, keywrodsClass, config, isTestable, fileName } = this.options;
        const { isMigration, testTimeout } = config;

        const sanitizedTestName = this.sanitizeTestName(testcaseName);
        this.builder.push(`test('${sanitizedTestName}', async ({ page }) => {`);
        if (isTestable && testTimeout && !process.env.IGNORE_GENERATED_TIMEOUT) {
            this.builder.push(`    test.setTimeout(${testTimeout});`);
        }

        Object.keys(fileImports).forEach((keyClass) => this.builder.push(`    var ${Commons.lowerFirstLetter(keyClass)} = new ${keyClass}(page);`));
        this.builder.push("");

        actionTestCase.forEach((keyword) => {
            if (!keywrodsClass[keyword.Keyword]) return;
            const className: string = Commons.lowerFirstLetter(keywrodsClass[keyword.Keyword].ClassName);
            this.builder.push("");
            const sanitizedKeywordName = this.sanitizeTestName(keyword.Keyword);
            this.builder.push(`    await test.step('${sanitizedKeywordName}', async ()=> {`);

            const testDataStr = keyword.TestData;
            if (isMigration) {
                const formattedData = formatTestData(testDataStr);
                this.builder.push(`        await ${className}.${keyword.Keyword}.call(${className}, {${formattedData},"migration":"true"});`);
            } else {
                if (testDataStr) {
                    const formattedData = formatTestData(testDataStr);
                    this.builder.push(`        await ${className}.${keyword.Keyword}.call(${className}, ${formattedData});`);
                } else {
                    this.builder.push(`        await ${className}.${keyword.Keyword}();`);
                }
            }

            if (keyword.Screenshot && keyword.Screenshot.toLowerCase() === "yes") {
                const sanitizedFileName = this.sanitizePath(fileName);
                const sanitizedTestCaseName = this.sanitizePath(testcaseName);
                const sanitizedKeyword = this.sanitizePath(keyword.Keyword);
                this.builder.push(`        await page.screenshot({ path: 'test-results/screenshots/${sanitizedFileName}/${sanitizedTestCaseName}/${sanitizedKeyword}.png', fullPage: true});`);
            }
            this.builder.push(`    });\n`);
        });

        this.builder.push("");
        this.builder.push("});");
    }

    public build(): string {
        this.buildImportsAndFixture();
        this.buildTestBody();
        return this.builder.join(EOL);
    }
}
