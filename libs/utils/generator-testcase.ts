import { Workbook } from "exceljs";
import * as fs from "fs";
import * as path from "path";
import { Commons } from "./commons";
import * as dotenv from "dotenv";
import { parseWorksheetConfig } from "./worksheet-config-parser";
import { TestFileBuilder } from "./test-file-builder";

dotenv.config();

const doneRegex = /^done$/i;

(async () => {
    const isTestable = process.env.npm_config_config === "playwright.testable.ts" || process.argv.includes("--config=playwright.testable.ts") || process.argv.some((arg) => arg.includes("playwright.testable.ts"));

    const TESTABLE_KEY = process.env.TESTABLE_API;

    const testDataDirectory: string = path.join(process.cwd(), "testData");
    const outputTestDataDirectory: string = path.join(process.cwd(), "testcases");
    const keywrodsClass: any = Commons.readKeywords();
    const files: string[] = fs.readdirSync(testDataDirectory);
    let fileNumber: number = 0;

    const isInvalidExcelFileName = (fileName: string): boolean => {
        return fileName.startsWith("~$");
    };

    for (const file of files) {
        if (!file.endsWith(".xlsx") || isInvalidExcelFileName(file)) {
            continue;
        }

        const inputTestDataFile: string = path.join(testDataDirectory, file);
        const fileBaseName: string = path.basename(file, ".xlsx");
        const outputTestDirectory: string = path.join(outputTestDataDirectory, fileBaseName);

        if (!fs.existsSync(outputTestDirectory)) {
            fs.mkdirSync(outputTestDirectory, { recursive: true });
        }

        const workbook: Workbook = await new Workbook().xlsx.readFile(inputTestDataFile);

        for (let worksheet of workbook.worksheets) {
            const testcaseName: string = worksheet.name;
            if (testcaseName === "Keywords") continue;

            const config = parseWorksheetConfig(worksheet);
            if (config.shouldSkip) {
                continue;
            }

            const actionTestCase: any[] = Commons.readTestData(worksheet);
            if (actionTestCase.some((keyword) => doneRegex.test(keyword.Status)) || actionTestCase.length < 1) {
                continue;
            }

            const fileImports: any = Object.assign(
                {},
                ...actionTestCase
                    .map((item) => keywrodsClass[item.Keyword])
                    .filter((value) => value != null)
                    .map((value) => ({ [value.ClassName]: value.FileName }))
            );

            if (Object.keys(fileImports).length < 1) continue;

            const builder = new TestFileBuilder({
                testcaseName,
                fileImports,
                actionTestCase,
                keywrodsClass,
                config,
                isTestable,
                testableKey: TESTABLE_KEY,
                fileName: fileBaseName
            });

            const fileContent = builder.build();
            fs.writeFileSync(path.join(outputTestDirectory, testcaseName + ".spec.ts"), fileContent);
            fileNumber += 1;
        }
    }

    console.log(`Generated ${fileNumber} testcases`);
})();
