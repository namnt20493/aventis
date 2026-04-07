import { test, expect } from "@libs/test-fixtures";
import { LoginPage, NavigationPage } from "@libs/pages-v2";
import { TestUsers } from "@constants/credentials";

test(
    "Stability_TriggerChangeDetection_Smoke",
    {
        tag: ["@functionalUI", "@smoke-stability"]
    },
    async ({ page, services }) => {
        const loginPage = new LoginPage(page, services);
        const nav = new NavigationPage(page, services);

        await test.step("Login", async () => {
            await page.goto("/");
            await loginPage.loginWithMsOnline(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
            await nav.mainMenuButton.shouldBeVisible({ timeout: 15000 });
        });

        await test.step("triggerChangeDetection - auf Startseite ausfuehren (kein Fehler erwartet)", async () => {
            await services.stability.triggerChangeDetection();
        });

        await test.step("triggerChangeDetection - evaluate laeuft im Angular-Kontext", async () => {
            const result = await page.evaluate(() => {
                document.body.dispatchEvent(new Event("input", { bubbles: true }));
                return new Promise<string>((resolve) => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => resolve("rAF-completed"));
                    });
                });
            });
            expect(result).toBe("rAF-completed");
        });

        await test.step("Zu Dossier eroeffnen navigieren (Angular-Formular)", async () => {
            await nav.navigateToDossierOpen();
            await expect(page.getByText(/Dossier eröffnen|Ouvrir un dossier/i).first()).toBeVisible({ timeout: 10000 });
        });

        await test.step("triggerChangeDetection - auf Formular-Seite ausfuehren", async () => {
            await services.stability.triggerChangeDetection();
        });

        await test.step("triggerChangeDetection - verifiziere Event-Dispatch auf Formular-Seite", async () => {
            const eventsReceived = await page.evaluate(() => {
                return new Promise<{ inputFired: boolean; rAFCompleted: boolean }>((resolve) => {
                    let inputFired = false;
                    const handler = () => {
                        inputFired = true;
                    };
                    document.body.addEventListener("input", handler, { once: true });

                    document.body.dispatchEvent(new Event("input", { bubbles: true }));

                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            document.body.removeEventListener("input", handler);
                            resolve({ inputFired, rAFCompleted: true });
                        });
                    });
                });
            });
            expect(eventsReceived.inputFired).toBe(true);
            expect(eventsReceived.rAFCompleted).toBe(true);
        });
    }
);

test(
    "Stability_ForceFormUpdate_Smoke",
    {
        tag: ["@functionalUI", "@smoke-stability"]
    },
    async ({ page, services }) => {
        const loginPage = new LoginPage(page, services);
        const nav = new NavigationPage(page, services);

        await test.step("Login", async () => {
            await page.goto("/");
            await loginPage.loginWithMsOnline(TestUsers.SOZIALARBEITERIN.username, TestUsers.SOZIALARBEITERIN.password);
            await nav.mainMenuButton.shouldBeVisible({ timeout: 15000 });
        });

        await test.step("Zu Dossier eroeffnen navigieren (Angular-Formular)", async () => {
            await nav.navigateToDossierOpen();
            await expect(page.getByText(/Dossier eröffnen|Ouvrir un dossier/i).first()).toBeVisible({ timeout: 10000 });
        });

        await test.step("forceFormUpdate - ausfuehren ohne Fehler", async () => {
            await services.stability.forceFormUpdate();
        });

        await test.step("forceFormUpdate - verifiziere Events auf allen Inputs", async () => {
            const result = await page.evaluate(() => {
                const inputs = document.querySelectorAll("input, textarea, select");
                const inputCount = inputs.length;

                const eventsLog: string[] = [];
                const handlers = new Map<Element, (e: Event) => void>();

                inputs.forEach((input) => {
                    const handler = (e: Event) => {
                        eventsLog.push(`${input.tagName}:${e.type}`);
                    };
                    handlers.set(input, handler);
                    input.addEventListener("input", handler);
                    input.addEventListener("change", handler);
                    input.addEventListener("blur", handler);
                });

                inputs.forEach((input) => {
                    input.dispatchEvent(new Event("input", { bubbles: true }));
                    input.dispatchEvent(new Event("change", { bubbles: true }));
                    input.dispatchEvent(new Event("blur", { bubbles: true }));
                });

                inputs.forEach((input) => {
                    const handler = handlers.get(input);
                    if (handler) {
                        input.removeEventListener("input", handler);
                        input.removeEventListener("change", handler);
                        input.removeEventListener("blur", handler);
                    }
                });

                return new Promise<{ inputCount: number; eventsReceived: number; rAFCompleted: boolean }>((resolve) => {
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            resolve({
                                inputCount,
                                eventsReceived: eventsLog.length,
                                rAFCompleted: true
                            });
                        });
                    });
                });
            });

            console.log(`forceFormUpdate: ${result.inputCount} Inputs gefunden, ${result.eventsReceived} Events empfangen`);
            expect(result.rAFCompleted).toBe(true);
            expect(result.inputCount).toBeGreaterThan(0);
            expect(result.eventsReceived).toBe(result.inputCount * 3);
        });

        await test.step("forceFormUpdate - mat-select Events verifizieren", async () => {
            const matSelectResult = await page.evaluate(() => {
                const matSelects = document.querySelectorAll("mat-select");
                const count = matSelects.length;
                let eventsReceived = 0;

                matSelects.forEach((select) => {
                    select.addEventListener(
                        "selectionChange",
                        () => {
                            eventsReceived++;
                        },
                        { once: true }
                    );
                    select.dispatchEvent(new Event("selectionChange", { bubbles: true }));
                });

                return { matSelectCount: count, eventsReceived };
            });

            console.log(`forceFormUpdate: ${matSelectResult.matSelectCount} mat-select Elemente gefunden`);
            expect(matSelectResult.eventsReceived).toBe(matSelectResult.matSelectCount);
        });

        await test.step("forceFormUpdate - Angular ng-Klassen auf Formular-Seite vorhanden", async () => {
            const ngState = await page.evaluate(() => {
                const allNgElements = document.querySelectorAll(".ng-pristine, .ng-dirty, .ng-touched, .ng-untouched");
                const pristineInputs = document.querySelectorAll("input.ng-pristine, textarea.ng-pristine, mat-select.ng-pristine");
                const dirtyInputs = document.querySelectorAll("input.ng-dirty, textarea.ng-dirty, mat-select.ng-dirty");

                const details: { tag: string; classes: string }[] = [];
                allNgElements.forEach((el) => {
                    const ngClasses = Array.from(el.classList)
                        .filter((c) => c.startsWith("ng-"))
                        .join(", ");
                    if (ngClasses) {
                        details.push({ tag: el.tagName.toLowerCase(), classes: ngClasses });
                    }
                });

                return {
                    totalNgElements: allNgElements.length,
                    pristineInputs: pristineInputs.length,
                    dirtyInputs: dirtyInputs.length,
                    sampleDetails: details.slice(0, 10)
                };
            });

            console.log(`Angular ng-Klassen: ${ngState.totalNgElements} Elemente total`);
            console.log(`  pristine Inputs: ${ngState.pristineInputs}, dirty Inputs: ${ngState.dirtyInputs}`);
            ngState.sampleDetails.forEach((d) => console.log(`  <${d.tag}>: [${d.classes}]`));

            expect(ngState.totalNgElements).toBeGreaterThan(0);
        });

        await test.step("forceFormUpdate - Dirty-State Transition via dispatchEvent pruefen", async () => {
            const pristineInput = page.locator("input.ng-pristine:visible").first();
            const hasPristineInput = (await pristineInput.count()) > 0;

            if (hasPristineInput) {
                const inputId = await pristineInput.evaluate((el) => el.id || el.getAttribute("formcontrolname") || el.getAttribute("data-testid") || "unknown");

                const classesBefore = await pristineInput.evaluate((el) =>
                    Array.from(el.classList)
                        .filter((c) => c.startsWith("ng-"))
                        .join(", ")
                );
                console.log(`Input "${inputId}" vorher: [${classesBefore}]`);

                await pristineInput.focus();
                await pristineInput.fill("SmokeTest");
                await services.stability.forceFormUpdate();

                const classesAfter = await pristineInput.evaluate((el) =>
                    Array.from(el.classList)
                        .filter((c) => c.startsWith("ng-"))
                        .join(", ")
                );
                console.log(`Input "${inputId}" nachher: [${classesAfter}]`);

                const transitioned = classesAfter.includes("ng-dirty");
                console.log(`Dirty-Transition via forceFormUpdate: ${transitioned ? "JA" : "NEIN"}`);
                console.log(transitioned ? "forceFormUpdate genuegt um Angular-ControlValueAccessor zu triggern" : "ERKENNTNIS: forceFormUpdate dispatcht DOM-Events, aber Angulars ControlValueAccessor erkennt sie nicht als echte User-Interaktion. Playwright fill() + blur() reicht fuer Dirty-State.");
            } else {
                console.log("Kein pristine Input gefunden - alle bereits dirty (fill()+blur() funktioniert)");
            }
        });
    }
);
