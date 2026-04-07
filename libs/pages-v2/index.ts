/**
 * Pages V2 Module
 *
 * Modernized page objects using the new Control pattern.
 * These pages extend PageObjectBase and use typed controls
 * for better type safety and code completion.
 *
 * Migration Status:
 * - LoginPage: ✅ Migrated
 * - NavigationPage: ✅ Migrated
 *
 * Usage:
 * ```typescript
 * import { LoginPage, NavigationPage } from "@libs/pages-v2";
 *
 * const loginPage = new LoginPage(page);
 * await loginPage.loginWithMsOnline(username, password);
 * ```
 */

export { LoginPage } from "./login-page";
export { NavigationPage } from "./navigation-page";
