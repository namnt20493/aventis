import { Worksheet } from "exceljs";

export interface WorksheetConfig {
    shouldSkip: boolean;
    videoSetting: string;
    testTimeout: number | null;
    slowMoVal: number | null;
    isMigration: boolean;
}

const doneRegex = /^done$/i;

export const parseWorksheetConfig = (worksheet: Worksheet): WorksheetConfig => {
    // --- Skip testcase if header of column E (cell E1) contains 'done' ---
    const headerE = worksheet.getCell("E1").text?.trim().toLowerCase();
    const shouldSkip = headerE === "done";

    // --- Video setting from F1 ---
    const videoSetting = worksheet.getCell("F1").text?.trim() ?? "";

    // --- Test timeout and migration flag from G1 ---
    const headerG = worksheet.getCell("G1").text?.trim();
    let testTimeout: number | null = null;
    if (/^\d+$/.test(headerG)) {
        testTimeout = parseInt(headerG, 10);
    }
    const isMigration = headerG?.toLowerCase() === "true";

    // --- slowMo value from H1 ---
    const headerH = worksheet.getCell("H1").text?.trim();
    let slowMoVal: number | null = null;
    if (/^\d+$/.test(headerH)) {
        const n = parseInt(headerH, 10);
        if (n > 0) slowMoVal = n;
    }

    return {
        shouldSkip,
        videoSetting,
        testTimeout,
        slowMoVal,
        isMigration
    };
};
