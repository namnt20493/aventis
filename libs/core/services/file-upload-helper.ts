import { Page, Locator } from "@playwright/test";
import { IStabilityService } from "@core/interfaces";

export class FileUploadHelper {
    constructor(private page: Page, private stability: IStabilityService) {}

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
        const paths = Array.isArray(filePaths) ? filePaths : filePaths.split(",").map((item) => item.trim());
        if (paths.length === 0) return;

        for (const filePath of paths) {
            if (apiUrlPart) {
                await this.uploadFileWithApiWait(triggerLocator, filePath, apiUrlPart);
            } else {
                await this.uploadFile(triggerLocator, filePath);
            }
        }
    }

    async uploadFileWithStability(triggerLocator: Locator, filePath: string): Promise<void> {
        await this.uploadFile(triggerLocator, filePath);
        await this.stability.waitForAngularStable();
    }

    async clearFileInput(fileInputLocator: Locator): Promise<void> {
        await fileInputLocator.setInputFiles([]);
    }
}
