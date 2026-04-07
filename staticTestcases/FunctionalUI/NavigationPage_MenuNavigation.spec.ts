import { test, expect } from "@libs/test-fixtures";
import { LoginPage, NavigationPage } from "@libs/pages-v2";
import { TestUsers } from "@constants/credentials";

test(
    "NavigationPage_MenuNavigation_Methods",
    {
        tag: ["@[183690]", "@functionalUI"]
    },
    async ({ page, services }) => {
        const loginPage = new LoginPage(page, services);
        const nav = new NavigationPage(page, services);

        await test.step("Login", async () => {
            await page.goto("/");
            await loginPage.loginWithMsOnline(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
            await nav.mainMenuButton.shouldBeVisible({ timeout: 15000 });
        });

        await test.step("openMainMenu - Top-Level Menü-Items validieren", async () => {
            await nav.openMainMenu();
            await nav.dossierfuhrungMenuItem.shouldBeVisible();
            await nav.buchhaltungMenuItem.shouldBeVisible();
            await page.keyboard.press("Escape");
            await nav.dossierfuhrungMenuItem.waitForHidden(5000);
        });

        await test.step("openDossierfuhrungMenu - Dossierführung Submenu-Items validieren", async () => {
            await nav.openDossierfuhrungMenu();
            await nav.dossierOpenButton.shouldBeVisible();
            await nav.soforthilfeButton.shouldBeVisible();
            await nav.aufgabenButton.shouldBeVisible();
            await nav.dokumenteneingangButton.shouldBeVisible();
            await nav.bewilligungenButton.shouldBeVisible();
            await page.keyboard.press("Escape");
            await nav.dossierOpenButton.waitForHidden(5000);
        });

        await test.step("openBuchhaltungMenu - Buchhaltung Submenu-Items validieren", async () => {
            await nav.openBuchhaltungMenu();
            await expect(page.getByText("Buchen", { exact: true }).first()).toBeVisible();
            await expect(page.getByText("Zahlungsverkehr", { exact: true }).first()).toBeVisible();
            await expect(page.getByText("Auswerten", { exact: true }).first()).toBeVisible();
            await page.keyboard.press("Escape");
            await nav.buchhaltungMenuItem.waitForHidden(5000);
        });

        await test.step("navigateToDossierOpen - Seite Dossier eröffnen validieren", async () => {
            const urlBefore = page.url();
            await nav.navigateToDossierOpen();
            expect(page.url()).not.toEqual(urlBefore);
            await expect(page.getByText(/Dossier eröffnen|Ouvrir un dossier|Créer un dossier/i).first()).toBeVisible({ timeout: 10000 });
        });

        await test.step("navigateToDokumenteneingang - Seite Dokumenteneingang validieren", async () => {
            const urlBefore = page.url();
            await nav.navigateToDokumenteneingang();
            expect(page.url()).not.toEqual(urlBefore);
            await expect(page.getByText(/Dokumenteneingang|Entrée des documents/i).first()).toBeVisible({ timeout: 10000 });
        });

        await test.step("navigateToBewilligungen - Seite Bewilligungen validieren", async () => {
            const urlBefore = page.url();
            await nav.navigateToBewilligungen();
            expect(page.url()).not.toEqual(urlBefore);
            await expect(page.getByText(/Bewilligungen|Validation des workflows/i).first()).toBeVisible({ timeout: 10000 });
        });

        await test.step("navigateToAufgaben - Seite Aufgabenübersicht validieren", async () => {
            const urlBefore = page.url();
            await nav.navigateToAufgaben();
            expect(page.url()).not.toEqual(urlBefore);
            await expect(page.getByText(/Aufgaben|Tâches/i).first()).toBeVisible({ timeout: 10000 });
        });
    }
);
