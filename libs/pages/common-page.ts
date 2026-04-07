import { Page, Locator, expect, APIResponse, Request, Response } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { StabilityHelper } from "@utils/stability-helper";

export class CommonPage {
    page: Page;
    private stabilityHelper: StabilityHelper;

    readonly accessDeniedDialog: Locator;
    readonly dialogCloseButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.stabilityHelper = new StabilityHelper(page);
        this.accessDeniedDialog = page.locator('mat-dialog-container:has-text("Zugriff verweigert")');
        this.dialogCloseButton = page.locator('button:has-text("Schliessen")').first();
    }

    async checkForAccessViolation(): Promise<boolean> {
        const isAccessDenied = await this.accessDeniedDialog.isVisible({ timeout: 2000 }).catch(() => false);

        if (!isAccessDenied) {
            return false;
        }

        console.warn(`[ACCESS VIOLATION] "Zugriff verweigert" dialog detected`);

        if (await this.dialogCloseButton.isVisible({ timeout: 1000 }).catch(() => false)) {
            await this.dialogCloseButton.click({ force: true });
            await this.page.waitForTimeout(500);
        }

        return true;
    }
    extractDossierName(input: string): string {
        if (!input) return input;
        const idx = input.indexOf("|");
        return idx === -1 ? input.trim() : input.substring(0, idx).trim();
    }
    extractAndFormatDate(filename: string): string | null {
        const match = filename.match(/_(\d{8})/);
        if (!match) return null;
        const raw = match[1];
        const day = raw.slice(0, 2);
        const month = raw.slice(2, 4);
        const year = raw.slice(4, 8);
        return `${day}.${month}.${year}`;
    }
    async waitForApiHelper(page: Page, urlPart: string, action: () => Promise<void>, responseStatus: number = 200, timeoutMs: number = 30000): Promise<Response | null> {
        let requestTriggered = false;

        const requestHandler = (req: Request) => {
            if (req.url().includes(urlPart)) {
                requestTriggered = true;
            }
        };

        page.on("request", requestHandler);

        try {
            const responsePromise = page.waitForResponse((r) => r.url().includes(urlPart) && r.status() === responseStatus, { timeout: timeoutMs });

            await action();

            if (requestTriggered) {
                const response = await responsePromise;
                return response;
            } else {
                return null;
            }
        } catch {
            return null;
        } finally {
            page.off("request", requestHandler);
        }
    }
    getDaysMinusOneFromDateString(dateStr: string): string {
        const [dayStr, monthStr, yearStr] = dateStr.split(".");
        const day = Number(dayStr);
        const month = Number(monthStr);
        const year = Number(yearStr);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            throw new Error();
        }

        if (day <= 1) {
            throw new Error();
        }

        const newDay = day - 1;

        const paddedDay = newDay.toString().padStart(2, "0");
        const paddedMonth = monthStr.padStart(2, "0");
        const paddedYear = yearStr.padStart(4, "0");

        return `${paddedDay}.${paddedMonth}.${paddedYear}`;
    }
    //find number in ()
    extractNumber(input: string): number | null {
        const match = input.match(/\((\d+)\)/);
        return match ? parseInt(match[1], 10) : null;
    }
    capitalizeFirstLetter(str: string): string {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    //refresh browser
    async refreshBrowser() {
        await this.page.reload({ waitUntil: "domcontentloaded" });
    }
    // split text with separator
    separateText(text: string | undefined | null): string[] {
        if (text === undefined || text === null || text === "") {
            return [];
        }
        return text.split(",").map((item) => item.trim());
    }

    // extract text from string
    extractText(str: string): string[] {
        const pattern = /\'(.*?)\'/g;
        const matches = str.match(pattern);
        if (matches) {
            return matches.map((match) => match.slice(1, -1));
        } else {
            return [];
        }
    }
    //get text before comma
    getTextBeforeComma(input: string): string {
        return input.split(",")[0];
    }
    //get text before quotes
    getTextBeforeQuotes(str: string): string {
        const index = str.indexOf('"');
        if (index === -1) {
            return str;
        }
        return str.substring(0, index).trim();
    }
    //regEx for format number
    formatNumber(num: number): RegExp {
        const numberDE = this.normalizeNumber(num);
        const numberFR = this.normalizeNumberFR(num);
        return new RegExp(`${numberDE}|${numberFR}`, "i");
    }
    //format AHV number
    formatAHV(ahv: string): string {
        const cleaned = ahv.replace(/\s+|\.|-/g, "");
        if (cleaned.length !== 13 || !/^\d+$/.test(cleaned)) {
            return ahv;
        }
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 7)}.${cleaned.slice(7, 11)}.${cleaned.slice(11, 13)}`;
    }

    //format number
    normalizeNumber(num: number): string {
        let str = num.toString();
        const isNegative = str.startsWith("-");
        if (isNegative) {
            str = str.slice(1);
        }

        let [integerPart, decimalPart] = str.split(".");
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "’");

        if (decimalPart) {
            if (decimalPart.length < 2) {
                decimalPart = decimalPart.padEnd(2, "0");
            } else if (decimalPart.length > 2) {
                decimalPart = decimalPart.slice(0, 2);
            }
        } else {
            decimalPart = "00";
        }

        const formattedStr = formattedIntegerPart + "." + decimalPart;
        return isNegative ? "-" + formattedStr : formattedStr;
    }
    normalizeNumberFR(num: number): string {
        let str = num.toString();
        const isNegative = str.startsWith("-");
        if (isNegative) {
            str = str.slice(1);
        }

        let [integerPart, decimalPart] = str.split(".");
        const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        if (decimalPart) {
            if (decimalPart.length < 2) {
                decimalPart = decimalPart.padEnd(2, "0");
            } else if (decimalPart.length > 2) {
                decimalPart = decimalPart.slice(0, 2);
            }
        } else {
            decimalPart = "00";
        }
        const formattedStr = formattedIntegerPart + "." + decimalPart;
        return isNegative ? "-" + formattedStr : formattedStr;
    }

    // + 1 in days
    incrementDay(inHaushaltBis: string) {
        // Split the string to separate day, month, and year
        const parts = inHaushaltBis.split(".");
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Adjust month for JavaScript Date (0-11)
        const year = parseInt(parts[2], 10);

        // Create a new Date object
        const date = new Date(year, month, day);

        // Add one day
        date.setDate(date.getDate() + 1);

        // Extract the new day, month, and year
        const newDay = date.getDate();
        const newMonth = date.getMonth() + 1; // Adjust back to normal month numbers (1-12)
        const newYear = date.getFullYear();

        // Format day and month to always be two digits
        const formattedDay = newDay.toString().padStart(2, "0");
        const formattedMonth = newMonth.toString().padStart(2, "0");

        // Reconstruct the date string
        return `${formattedDay}.${formattedMonth}.${newYear}`;
    }
    formatNumber_Ger(num: number): string {
        let numStr = num.toFixed(2);
        let parts = numStr.split(".");
        let integerPart = parts[0];
        let decimalPart = parts[1];
        let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "’");
        return `${formattedIntegerPart}.${decimalPart}`;
    }
    formatNumber_Fre(num: number): string {
        let numStr = num.toFixed(2);
        let parts = numStr.split(".");
        let integerPart = parts[0];
        let decimalPart = parts[1];
        let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return `${formattedIntegerPart}.${decimalPart}`;
    }

    reverseText(input: string): string {
        // Split the input string by the delimiter
        const segments = input.split(", ");

        // Reverse the array of segments
        const reversedSegments = segments.reverse();

        // Join the segments back into a single string with the same delimiter
        const reversedText = reversedSegments.join(" ");

        return reversedText;
    }

    getCurrentFormattedDate(): string {
        const now = new Date();

        const day = String(now.getDate()).padStart(2, "0");
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `${day}.${month}.${year}, ${hours}:${minutes}`;
    }

    splitText(input: string): string[] {
        const regex = /(".*?"|[^,]+)(?=\s*,|\s*$)/g;
        const parts = input.match(regex)?.map((part) => part.trim()) ?? [];

        const result: string[] = [];

        for (let i = 0; i < parts.length; i++) {
            if (parts[i].startsWith('"') && parts[i].endsWith('"')) {
                result.push(parts[i].slice(1, -1));
            } else {
                if (i + 1 < parts.length && !(parts[i + 1].startsWith('"') && parts[i + 1].endsWith('"'))) {
                    result.push(`${parts[i]}, ${parts[i + 1]}`);
                    i++;
                } else {
                    result.push(parts[i]);
                }
            }
        }

        return result;
    }
    //get file name from path
    getFileName(path: string): string {
        const normalizedPath = path.replace(/\\/g, "/");
        const parts: string[] = normalizedPath.split("/");
        return parts.pop() || "";
    }

    modifyDate(dateRange: string): string {
        if (!dateRange.includes(" - ")) {
            return dateRange;
        }
        let [startDate, endDate] = dateRange.split(" - ");
        let [startDay, startMonth, startYear] = startDate.split(".");
        let [endDay, endMonth, endYear] = endDate.split(".");
        if (startYear === endYear) {
            return `${startDay}.${startMonth}. - ${endDay}.${endMonth}.${endYear}`;
        }
        return dateRange;
    }
    convertString(input: string): string {
        if (!input || !input.includes(" - ")) {
            return input || "";
        }
        const [part1, part2Raw] = input.split(" - ");
        if (!part2Raw) {
            return input;
        }
        const expectedFormat = part2Raw
            .replace(/\s/g, "")
            .match(/.{1,4}/g)
            ?.join(" ");
        if (part2Raw === expectedFormat) {
            return input;
        }
        const part2 =
            part2Raw
                .replace(/\s/g, "")
                .match(/.{1,4}/g)
                ?.join(" ") || "";
        return `${part1} - ${part2}`;
    }

    formatAccountNumber(accountNumber: string): string {
        const cleaned = accountNumber.replace(/\s/g, "");
        const formatted = [cleaned.slice(0, 4), cleaned.slice(4, 8), cleaned.slice(8, 12), cleaned.slice(12, 16), cleaned.slice(16, 20)].join(" ");

        return formatted;
    }

    getSwitzerlandTime(): string {
        const now = new Date();

        const swissTimeOptions: Intl.DateTimeFormatOptions = {
            timeZone: "Europe/Zurich",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        };

        const formatter = new Intl.DateTimeFormat("vi-VN", swissTimeOptions);
        const formattedTime = formatter.format(now);

        return formattedTime.replace(/\./g, ":");
    }

    formatIBAN(iban: string): string {
        const cleaned = iban.replace(/\s/g, "").toUpperCase();
        const countryAndCheck = cleaned.slice(0, 4);
        const rest = cleaned.slice(4);

        const groups = rest.match(/.{1,4}/g) || [];

        return `${countryAndCheck} ${groups.join(" ")}`;
    }
    convertToDDMMYYYY(input: string): string {
        const [day, month, year] = input.split(".");
        const paddedDay = day.padStart(2, "0");
        const paddedMonth = month.padStart(2, "0");
        return `${paddedDay}.${paddedMonth}.${year}`;
    }

    async uploadFile(triggerLocator: Locator, filePath: string): Promise<void> {
        const fileChooserPromise = this.page.waitForEvent("filechooser");
        await triggerLocator.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(filePath);
    }

    async uploadFileWithApiWait(triggerLocator: Locator, filePath: string, apiUrlPart: string = "AventisFileQuery"): Promise<void> {
        const fileName = filePath.split(/[/\\]/).pop() || filePath;
        const responsePromise = this.page.waitForResponse((response) => response.url().includes(apiUrlPart) && response.status() === 200, { timeout: 10000 });
        await this.uploadFile(triggerLocator, filePath);
        try {
            await responsePromise;
        } catch {
            await this.page.locator(`text=${fileName}`).first().waitFor({ state: "visible", timeout: 10000 });
        }
    }

    async uploadMultipleFiles(triggerLocator: Locator, filePaths: string | string[], apiUrlPart?: string): Promise<void> {
        const paths = Array.isArray(filePaths) ? filePaths : this.separateText(filePaths);
        if (paths.length === 0) return;

        for (const filePath of paths) {
            if (apiUrlPart) {
                await this.uploadFileWithApiWait(triggerLocator, filePath, apiUrlPart);
            } else {
                await this.uploadFile(triggerLocator, filePath);
            }
        }
    }
}
