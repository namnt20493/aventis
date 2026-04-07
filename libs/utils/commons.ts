import * as fs from "fs";
import { EOL } from "os";
import * as path from "path";
import { ValueType, Workbook, Worksheet } from "exceljs";

type KeywordsClass = {
    [key: string]: { ClassName: string; FileName: string };
};

type TestCaseAction = {
    Keyword: string;
    TestData: any;
    Screenshot: string;
    Status: string;
    RecordVideo: string;
    // ExpectOutput: any
};

export const Commons = {
    isNullOrEmpty: (value: string): boolean => {
        return value == null || value.length < 1;
    },
    getLinesAndIgnoreText: (filePath: string): string[] => {
        const fileLines = fs
            .readFileSync(filePath, "utf-8")
            .split(/\r?\n|\r/)
            .filter((line) => Commons.isNullOrEmpty(line) == false && line.trim().startsWith("//") == false && line.trim().startsWith("/*") == false && line.trim().startsWith("import") == false)
            .map((line) => line.trim())
            .filter((line) => line.startsWith("export class") || line.startsWith("async"));
        return fileLines;
    },
    lowerFirstLetter: (value: string): string => {
        if (Commons.isNullOrEmpty(value)) return value;
        return value.charAt(0).toLowerCase() + value.slice(1);
    },

    readKeywords: (): KeywordsClass => {
        const keywordsPath = path.resolve(process.cwd(), "libs", "keywords");

        // Get all files in keywords folder
        const files = fs
            .readdirSync(keywordsPath)
            .filter((fileName) => fileName.toLowerCase().startsWith("index.ts") == false)
            .map((fileName) => path.resolve(keywordsPath, fileName));

        // Get all class name and method name
        const classKeywords: KeywordsClass = {};
        const classNameRegex = /(?:export\s+)?class (\w+)\s*{/;
        const methodNameRegex = /(?:function|const|async)\s+([a-zA-Z_]\w*)\s*\(/;
        let className = "";
        let fileName = "";
        let methodName = "";
        for (let file of files) {
            const lines = Commons.getLinesAndIgnoreText(file);
            for (let line of lines) {
                const classNameMatch = classNameRegex.exec(line);
                if (classNameMatch != null) {
                    className = classNameMatch[1];
                    fileName = path.parse(file).name;
                    continue;
                }
                const methodNameMatch = methodNameRegex.exec(line);
                if (methodNameMatch != null) {
                    methodName = methodNameMatch[1];
                    classKeywords[methodName] = {
                        ClassName: className,
                        FileName: fileName
                    };
                }
            }
        }

        return classKeywords;
    },

    readTestData: (worksheet: Worksheet): TestCaseAction[] => {
        const rowCount = worksheet?.rowCount ?? 0;
        const stepsType = Array.from({ length: rowCount }, (_, i) => (i + 1).toString());
        if (rowCount < 2) return [];
        const testData: TestCaseAction[] = [];

        for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
            const row = worksheet?.getRow(rowIndex);

            const testCaseStep1 = row?.getCell(1).text;
            if (testCaseStep1) {
                const testCaseAction = row?.getCell(2).value?.toString() ?? "";
                const testCaseData1 = row?.getCell(3).text ?? "";
                const screenshotAction = row?.getCell(4).value?.toString() ?? "";
                const status = row?.getCell(5).value?.toString() ?? "";
                const video = row?.getCell(6).value?.toString() ?? "";

                let paramData1: any = null;

                if (stepsType.indexOf(testCaseStep1) > -1) {
                    paramData1 = testCaseData1;
                } else {
                    paramData1 = testCaseData1 && testCaseData1.length > 0 ? `'${testCaseData1}'` : null;
                }
                testData.push({
                    Keyword: testCaseAction,
                    TestData: paramData1,
                    Screenshot: screenshotAction,
                    Status: status,
                    RecordVideo: video
                });
            }
        }

        return testData;
    }
};
