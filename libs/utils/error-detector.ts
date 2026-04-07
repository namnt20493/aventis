import { Page } from "@playwright/test";

export interface DetectedError {
    type: "snackbar" | "mat-error" | "error-dialog";
    message: string;
    details?: string;
}

export class ErrorDetector {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async collectVisibleErrors(): Promise<DetectedError[]> {
        const errors: DetectedError[] = [];

        const snackbar = this.page.locator("app-snackbar");
        if (await snackbar.isVisible().catch(() => false)) {
            const text = (await snackbar.textContent().catch(() => "")) || "";
            if (text.trim()) {
                errors.push({ type: "snackbar", message: text.trim() });
            }
        }

        const matErrors = this.page.locator("mat-error");
        const matErrorCount = await matErrors.count().catch(() => 0);
        for (let i = 0; i < matErrorCount; i++) {
            const el = matErrors.nth(i);
            if (await el.isVisible().catch(() => false)) {
                const text = (await el.textContent().catch(() => "")) || "";
                if (text.trim()) {
                    errors.push({ type: "mat-error", message: text.trim() });
                }
            }
        }

        const errorDialog = this.page.locator(".dialog-wrapper:has(h2:text-matches('Fehler|Error|Erreur', 'i'))");
        if (await errorDialog.isVisible().catch(() => false)) {
            const errorMessage = (await errorDialog.locator("p.break-text-multiline").textContent().catch(() => "")) || "";
            let clipboardDetails: string | undefined;
            const copyBtn = errorDialog.locator("[data-testid='copyEnvStateToClipboard']");
            if (await copyBtn.isVisible().catch(() => false)) {
                await copyBtn.click().catch(() => {});
                await this.page.waitForTimeout(500);
                clipboardDetails = await this.page.evaluate(() => navigator.clipboard.readText()).catch(() => undefined);
            }
            errors.push({
                type: "error-dialog",
                message: errorMessage.trim(),
                details: clipboardDetails,
            });
        }

        return errors;
    }

    async assertNoErrors(context?: string): Promise<void> {
        const errors = await this.collectVisibleErrors();
        if (errors.length > 0) {
            const prefix = context ? `[${context}] ` : "";
            const lines = errors.map((e) => {
                let line = `  - ${e.type}: ${e.message}`;
                if (e.details) {
                    line += `\n    Details: ${e.details.substring(0, 1000)}`;
                }
                return line;
            });
            throw new Error(`${prefix}UI-Fehlermeldung(en) erkannt:\n${lines.join("\n")}`);
        }
    }

    async waitAndAssertNoErrors(context?: string, waitMs: number = 2000): Promise<void> {
        const errorDialog = this.page.locator(".dialog-wrapper:has(h2:text-matches('Fehler|Error|Erreur', 'i'))");
        const snackbar = this.page.locator("app-snackbar");
        const matError = this.page.locator("mat-error");

        try {
            await Promise.race([
                errorDialog.waitFor({ state: "visible", timeout: waitMs }),
                snackbar.waitFor({ state: "visible", timeout: waitMs }),
                matError.first().waitFor({ state: "visible", timeout: waitMs }),
                this.page.waitForTimeout(waitMs),
            ]);
        } catch {
            // Timeout = no error appeared
        }

        await this.assertNoErrors(context);
    }
}
