import type { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from "@playwright/test/reporter";
import * as XlsxPopulate from "xlsx-populate";
import * as path from "node:path";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config();

const XlsxPopulateLib = (XlsxPopulate as any).default || XlsxPopulate;

/* =========================
   Types
========================= */

type TestStepResult = {
    title: string;
    status: "PASS" | "FAIL";
    duration: number;
    message?: string;
};

type TestCaseResult = {
    sheetName: string;
    steps: TestStepResult[];
    excelFileName: string;
    testStatus: "PASS" | "FAIL";
    totalDuration: number;
    startTime: Date; // 🔥 NEW
    endTime: Date; // 🔥 NEW
};

type TestRunInfo = {
    title: string;
    excelFileName: string;
    startTime: Date;
};

/* =========================
   Reporter
========================= */

class CustomReporter implements Reporter {
    private results: TestCaseResult[] = [];
    private skipReport: boolean;
    private runTimeMode: "BOOL" | "DURATION";
    private aventisUrl = "";

    // 🔥 NEW: Track running tests
    private runningTests: Map<string, TestRunInfo> = new Map();
    private totalTests = 0;
    private completedTests = 0;

    constructor() {
        this.runTimeMode = process.env.RUN_TIME_STEP === "1" ? "DURATION" : "BOOL";
        this.skipReport = process.env.RUN_TIME_STEP === "2";
        this.loadParameters();
    }

    private loadParameters() {
        try {
            const parametersPath = path.resolve(process.cwd(), "parameter.json");
            const parameters = JSON.parse(fs.readFileSync(parametersPath, "utf8"));
            this.aventisUrl = parameters.aventisURL ?? "";
        } catch {}
    }

    /* =========================
     Playwright hooks
  ========================= */

    onBegin(config: FullConfig, suite: Suite) {
        // 🔥 Count total tests
        this.totalTests = this.countTests(suite);
        console.log(`\n${"=".repeat(60)}`);
        console.log(`🚀 Starting test run: ${this.totalTests} test(s)`);
        console.log(`⚙️  Mode: ${this.runTimeMode === "DURATION" ? "DURATION" : "NO REPORT"}`);
        console.log("=".repeat(60) + "\n");
    }

    // 🔥 NEW: Track when test starts
    onTestBegin(test: TestCase) {
        const excelFileName = this.extractExcelFileName(test);
        const startTime = new Date();

        this.runningTests.set(test.id, {
            title: test.title,
            excelFileName: excelFileName || "Unknown",
            startTime,
        });

        const timestamp = startTime.toLocaleTimeString("vi-VN");

        console.log(`🏃 ${timestamp} | Starting testcase: "${test.title}"`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        const endTime = new Date();
        const runInfo = this.runningTests.get(test.id);
        const startTime = runInfo?.startTime || endTime;

        const excelFileName = this.extractExcelFileName(test);

        if (!excelFileName) {
            console.warn(`⚠️  Cannot detect Excel file for: ${test.location?.file}`);
            this.completedTests++;
            this.runningTests.delete(test.id);
            return;
        }

        // Process steps
        const steps: TestStepResult[] = result.steps
            .filter((s) => !s.title.toLowerCase().includes("hook"))
            .map((step) => ({
                title: step.title,
                status: step.error ? "FAIL" : "PASS",
                duration: step.duration || 0,
                message: step.error?.message,
            }));

        const testStatus: "PASS" | "FAIL" = result.status === "passed" ? "PASS" : "FAIL";
        const totalDuration = result.duration;

        this.results.push({
            sheetName: test.title,
            steps,
            excelFileName,
            testStatus,
            totalDuration,
            startTime,
            endTime,
        });

        // 🔥 Enhanced logging with progress
        this.completedTests++;
        const statusIcon = testStatus === "PASS" ? "✅" : "❌";
        const durationFormatted = this.formatDuration(totalDuration);
        const timestamp = endTime.toLocaleTimeString("vi-VN");

        console.log(`${statusIcon} ${timestamp} | testcase : "${test.title}" : ${testStatus} (${durationFormatted})`);

        // 🔥 Show failed step details immediately
        if (testStatus === "FAIL") {
            const failedSteps = steps.filter((s) => s.status === "FAIL");
            failedSteps.forEach((step) => {
                console.log(`         └─ ❌ ${step.title}`);
                if (step.message) {
                    const shortMsg = step.message.split("\n")[0].substring(0, 80);
                    console.log(`            ${shortMsg}${step.message.length > 80 ? "..." : ""}`);
                }
            });
        }

        this.runningTests.delete(test.id);
    }

    async onEnd(result: FullResult) {
        const duration = Date.now() - (this.runningTests.values().next().value?.startTime?.getTime() || Date.now());

        console.log(`\n${"=".repeat(60)}`);
        console.log(`🏁 Test run completed`);
        console.log(`   Total: ${this.totalTests} | Completed: ${this.completedTests}`);
        console.log(`   Status: ${result.status.toUpperCase()}`);
        console.log("=".repeat(60));
    }

    async onExit() {
        if (this.skipReport) {
            console.log("\n⏭️  Skipping Excel report (RUN_TIME_STEP=2)\n");
            return;
        }

        if (this.results.length === 0) {
            console.log("\n⚠️  No test results to write\n");
            return;
        }

        const groupedByFile = this.groupResultsByExcelFile();

        console.log(`\n${"=".repeat(60)}`);
        console.log(`📊 EXCEL REPORT SUMMARY`);
        console.log("=".repeat(60));

        for (const [excelFileName, tests] of Object.entries(groupedByFile)) {
            await this.processExcelFile(excelFileName, tests);
        }

        console.log("\n✅ All Excel reports saved!\n");
    }

    /* =========================
     Excel Processing
  ========================= */

    private async processExcelFile(excelFileName: string, tests: TestCaseResult[]) {
        const excelPath = path.resolve(process.cwd(), "testData", excelFileName);

        if (!fs.existsSync(excelPath)) {
            console.error(`\n❌ ${excelFileName}`);
            console.error(`   File not found: ${excelPath}`);
            return;
        }

        const passCount = tests.filter((t) => t.testStatus === "PASS").length;
        const failCount = tests.filter((t) => t.testStatus === "FAIL").length;
        const totalDuration = tests.reduce((sum, t) => sum + t.totalDuration, 0);

        console.log(`\n📂 ${excelFileName}`);
        console.log(`   Tests: ${tests.length} total (✅ ${passCount} passed, ❌ ${failCount} failed)`);
        console.log(`   Duration: ${this.formatDuration(totalDuration)}`);

        let workbook;
        try {
            workbook = await XlsxPopulateLib.fromFileAsync(excelPath);
        } catch (err) {
            console.error(`   ❌ Failed to load workbook:`, err);
            return;
        }

        let successCount = 0;

        for (const test of tests) {
            const sheet = workbook.sheet(test.sheetName);
            if (!sheet) {
                console.log(`   ⚠️  Sheet "${test.sheetName}" not found`);
                continue;
            }
            (this as any).currentSheet = sheet;

            const testResultCol = this.findColumnIndex(sheet, "testresult");
            if (testResultCol === -1) {
                console.log(`   ⚠️  Sheet "${test.sheetName}": No "testresult" column`);
                continue;
            }

            const writeCol = this.findEmptyColumn(sheet, testResultCol + 1);
            const writePlan = this.buildWritePlan(writeCol, test);

            this.applyWritePlan(sheet, writePlan);

            const statusIcon = test.testStatus === "PASS" ? "✅" : "❌";
            console.log(`   ${statusIcon} testcase "${test.sheetName}":(${this.formatDuration(test.totalDuration)})`);
            successCount++;
        }

        try {
            await workbook.toFileAsync(excelPath);
            console.log(`   💾 Saved successfully (${successCount}/${tests.length} sheets)`);
        } catch (err) {
            console.error(`   ❌ Failed to save:`, err);
        }
    }

    /* =========================
     Batch write helpers
  ========================= */

    private buildWritePlan(col: number, test: TestCaseResult): { row: number; col: number; value: any; style?: "PASS" | "FAIL" | "HEADER" }[] {
        const plan: {
            row: number;
            col: number;
            value: any;
            style?: "PASS" | "FAIL" | "HEADER";
        }[] = [];

        // Header with timestamp
        plan.push({
            row: 1,
            col,
            value: test.endTime.toLocaleString(),
            style: "HEADER",
        });

        const sheet = (this as any).currentSheet;
        const maxRow = sheet.usedRange().endCell().rowNumber();

        // Pre-process: find ALL rows with step numbers
        const rowsWithStepNumbers: number[] = [];
        for (let row = 2; row <= maxRow; row++) {
            const stepNumberCell = sheet?.cell(row, 1).value();
            const hasStepNumber = stepNumberCell && !isNaN(Number(stepNumberCell));
            if (hasStepNumber) {
                rowsWithStepNumbers.push(row);
            }
        }

        // MAP: Write each step to its corresponding row with step number
        for (let stepIndex = 0; stepIndex < test.steps.length; stepIndex++) {
            const step = test.steps[stepIndex];

            // Get the corresponding row from rowsWithStepNumbers
            if (stepIndex < rowsWithStepNumbers.length) {
                const currentRow = rowsWithStepNumbers[stepIndex];

                if (this.runTimeMode === "DURATION") {
                    // Duration mode: write duration in milliseconds as integer
                    const durationInMilliseconds = Math.round(step.duration);
                    plan.push({
                        row: currentRow,
                        col,
                        value: step.status === "FAIL" ? 0 : durationInMilliseconds,
                        style: step.status,
                    });
                } else {
                    // Boolean mode: write 1 for PASS, 0 for FAIL
                    plan.push({
                        row: currentRow,
                        col,
                        value: step.status === "PASS" ? 1 : 0,
                        style: step.status,
                    });
                }
            }
        }

        return plan;
    }

    private applyWritePlan(sheet: any, plan: { row: number; col: number; value: any; style?: "PASS" | "FAIL" | "HEADER" }[]) {
        for (const cell of plan) {
            const excelCell = sheet.cell(cell.row, cell.col);

            excelCell.value(cell.value);

            if (cell.style === "FAIL") {
                excelCell.style({
                    fill: "ffcccb",
                    fontColor: "8b0000",
                    bold: true,
                    numberFormat: "0",
                });
            } else if (cell.style === "PASS") {
                excelCell.style({
                    fill: "c6efce",
                    fontColor: "006100",
                    numberFormat: "0",
                });
            } else if (cell.style === "HEADER") {
                excelCell.style({
                    fill: "4472c4",
                    fontColor: "ffffff",
                    bold: true,
                    horizontalAlignment: "center",
                });
            }
        }
    }

    /* =========================
     Helper Functions
  ========================= */

    private countTests(suite: Suite): number {
        let count = 0;

        const countInSuite = (s: Suite) => {
            count += s.tests.length;
            s.suites.forEach(countInSuite);
        };

        countInSuite(suite);
        return count;
    }

    private formatDuration(ms: number): string {
        if (ms < 1000) {
            return `${ms}ms`;
        }
        const seconds = (ms / 1000).toFixed(2);
        return `${seconds}s`;
    }

    private groupResultsByExcelFile(): Record<string, TestCaseResult[]> {
        const grouped: Record<string, TestCaseResult[]> = {};

        for (const result of this.results) {
            if (!grouped[result.excelFileName]) {
                grouped[result.excelFileName] = [];
            }
            grouped[result.excelFileName].push(result);
        }

        return grouped;
    }

    /* =========================
     Excel Filename Detection
  ========================= */

    private extractExcelFileName(test: TestCase): string | null {
        const testFilePath = test.location?.file;
        if (!testFilePath) return null;

        const testDataDir = path.resolve(process.cwd(), "testData");
        if (!fs.existsSync(testDataDir)) {
            return null;
        }

        const availableExcelFiles = fs
            .readdirSync(testDataDir)
            .filter((f) => f.toLowerCase().endsWith(".xlsx"))
            .map((f) => ({
                full: f,
                base: f.replace(/\.xlsx$/i, ""),
            }));

        if (availableExcelFiles.length === 0) {
            return null;
        }

        const normalizedPath = testFilePath.replace(/\\/g, "/");
        const pathParts = normalizedPath.split("/");

        // Priority 1: Parent folder name
        for (let i = pathParts.length - 2; i >= 0; i--) {
            const folderName = pathParts[i];

            if (["testcases", "tests", "test", "spec", "specs"].includes(folderName.toLowerCase())) {
                continue;
            }

            const exactMatch = availableExcelFiles.find((excel) => excel.base.toLowerCase() === folderName.toLowerCase());
            if (exactMatch) {
                return exactMatch.full;
            }

            const partialMatch = availableExcelFiles.find((excel) => folderName.toLowerCase().includes(excel.base.toLowerCase()));
            if (partialMatch) {
                return partialMatch.full;
            }
        }

        // Priority 2: Spec filename
        const specFileMatch = testFilePath.match(/([^\\/]+)\.spec\.[jt]s$/i);
        if (specFileMatch) {
            const specBaseName = specFileMatch[1];

            const exactMatch = availableExcelFiles.find((excel) => excel.base.toLowerCase() === specBaseName.toLowerCase());
            if (exactMatch) {
                return exactMatch.full;
            }
        }

        // Priority 3: Pattern matching
        for (const excel of availableExcelFiles) {
            if (normalizedPath.toLowerCase().includes(excel.base.toLowerCase())) {
                return excel.full;
            }
        }

        // Fallback: Single file
        if (availableExcelFiles.length === 1) {
            return availableExcelFiles[0].full;
        }

        return null;
    }

    /* =========================
     Excel utilities
  ========================= */

    private findColumnIndex(sheet: any, keyword: string): number {
        for (let col = 1; col <= 100; col++) {
            const val = sheet.cell(1, col).value();
            if (typeof val === "string" && val.toLowerCase().includes(keyword)) {
                return col;
            }
        }
        return -1;
    }

    private findEmptyColumn(sheet: any, startCol: number): number {
        const maxCol = sheet.usedRange().endCell().columnNumber() + 10;
        for (let col = startCol; col <= maxCol; col++) {
            if (!sheet.cell(1, col).value()) return col;
        }
        return maxCol;
    }
}

export default CustomReporter;
