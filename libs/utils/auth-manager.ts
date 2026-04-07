import { BrowserContext, Page } from "@playwright/test";
import { MicrosoftLoginPage } from "@pages/microsoftlogin-page";
import { loginViaApi } from "@utils/api-login";
import * as fs from "node:fs";
import * as path from "node:path";

interface StorageState {
    cookies: Array<{
        name: string;
        value: string;
        domain: string;
        path: string;
        expires: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: "Strict" | "Lax" | "None";
    }>;
    origins: Array<{
        origin: string;
        localStorage: Array<{ name: string; value: string }>;
    }>;
}

interface FileCacheEntry {
    timestamp: number;
    state: StorageState;
}

const CACHE_DIR = path.resolve(process.cwd(), "test-results", ".auth-cache");
const CACHE_TTL_MS = 50 * 60 * 1000;
const LOCK_POLL_INTERVAL_MS = 500;
const LOCK_TIMEOUT_MS = 60_000;

export class AuthManager {
    private static instance: AuthManager;
    private memCache = new Map<string, StorageState>();

    private constructor() {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    static getInstance(): AuthManager {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }
        return AuthManager.instance;
    }

    private cacheFilePath(cacheKey: string): string {
        const safeKey = cacheKey.replace(/[^a-z0-9._@-]/gi, "_");
        return path.join(CACHE_DIR, `${safeKey}.json`);
    }

    private lockFilePath(cacheKey: string): string {
        return this.cacheFilePath(cacheKey) + ".lock";
    }

    private readFileCache(cacheKey: string): StorageState | undefined {
        const filePath = this.cacheFilePath(cacheKey);
        try {
            const raw = fs.readFileSync(filePath, "utf-8");
            const entry: FileCacheEntry = JSON.parse(raw);
            if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
                fs.unlinkSync(filePath);
                return undefined;
            }
            return entry.state;
        } catch {
            return undefined;
        }
    }

    private writeFileCache(cacheKey: string, state: StorageState): void {
        const entry: FileCacheEntry = { timestamp: Date.now(), state };
        const filePath = this.cacheFilePath(cacheKey);
        const tmpPath = filePath + ".tmp";
        fs.writeFileSync(tmpPath, JSON.stringify(entry), "utf-8");
        fs.renameSync(tmpPath, filePath);
    }

    private tryAcquireLock(cacheKey: string): boolean {
        const lockPath = this.lockFilePath(cacheKey);
        try {
            fs.writeFileSync(lockPath, JSON.stringify({ pid: process.pid, created: Date.now() }), { flag: "wx" });
            return true;
        } catch {
            return false;
        }
    }

    private releaseLock(cacheKey: string): void {
        const lockPath = this.lockFilePath(cacheKey);
        try {
            const content = fs.readFileSync(lockPath, "utf-8");
            const lock = JSON.parse(content);
            if (lock.pid === process.pid) {
                fs.unlinkSync(lockPath);
            }
        } catch { /* already cleaned up or not our lock */ }
    }

    private forceReleaseStaleLock(cacheKey: string): void {
        try {
            fs.unlinkSync(this.lockFilePath(cacheKey));
        } catch { /* already cleaned up */ }
    }

    private isLockStale(cacheKey: string): boolean {
        const lockPath = this.lockFilePath(cacheKey);
        try {
            const stat = fs.statSync(lockPath);
            return Date.now() - stat.mtimeMs > LOCK_TIMEOUT_MS;
        } catch {
            return true;
        }
    }

    private async waitForCacheOrLockRelease(cacheKey: string): Promise<StorageState | undefined> {
        const deadline = Date.now() + LOCK_TIMEOUT_MS;
        while (Date.now() < deadline) {
            const cached = this.readFileCache(cacheKey);
            if (cached) return cached;

            if (this.isLockStale(cacheKey)) {
                this.forceReleaseStaleLock(cacheKey);
                return undefined;
            }

            const lockPath = this.lockFilePath(cacheKey);
            if (!fs.existsSync(lockPath)) return undefined;

            await new Promise(r => setTimeout(r, LOCK_POLL_INTERVAL_MS));
        }
        return undefined;
    }

    private getCached(cacheKey: string): StorageState | undefined {
        const mem = this.memCache.get(cacheKey);
        if (mem) return mem;

        const file = this.readFileCache(cacheKey);
        if (file) {
            this.memCache.set(cacheKey, file);
            return file;
        }
        return undefined;
    }

    private async applyCachedState(context: BrowserContext, page: Page, state: StorageState): Promise<boolean> {
        await this.safeClearCookies(context, page);
        await context.addCookies(state.cookies);
        await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });
        const logo = page.locator('[data-testid="aventis-logo"]');
        try {
            await logo.waitFor({ state: "attached", timeout: 10000 });
            return true;
        } catch {
            return false;
        }
    }

    private async cacheFromContext(context: BrowserContext, username: string): Promise<void> {
        const cacheKey = username.toLowerCase();
        const state = await context.storageState() as StorageState;
        this.memCache.set(cacheKey, state);
        this.writeFileCache(cacheKey, state);
        console.log(`[AuthManager] Cached state for ${cacheKey} (${state.cookies.length} cookies, mem+file)`);
    }

    private async safeClearCookies(context: BrowserContext, page: Page): Promise<void> {
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                await context.clearCookies();
                return;
            } catch (error: unknown) {
                const msg = error instanceof Error ? error.message : String(error);
                if (msg.includes("Failed to find browser context") || msg.includes("has been closed")) {
                    if (attempt === 0) {
                        console.log(`[AuthManager] Context appears stale, waiting before retry...`);
                        await page.waitForTimeout(2000).catch(() => {});
                        continue;
                    }
                    throw new Error(
                        "[AuthManager] Browser context is no longer available. " +
                        "This typically happens when the browser crashed or the test timed out. " +
                        "Consider adding test.slow() for long-running tests. " +
                        `Original: ${msg}`
                    );
                }
                throw error;
            }
        }
    }

    async swapUser(context: BrowserContext, page: Page, username: string, password: string): Promise<void> {
        const cacheKey = username.toLowerCase();

        const cached = this.getCached(cacheKey);
        if (cached) {
            console.log(`[AuthManager] Cache HIT for ${cacheKey} - cookie swap`);
            if (await this.applyCachedState(context, page, cached)) {
                console.log(`[AuthManager] Cookie swap successful for ${cacheKey}`);
                return;
            }
            console.log(`[AuthManager] Cookie swap failed - invalidating and falling back`);
            this.invalidate(username);
        }

        if (!this.tryAcquireLock(cacheKey)) {
            console.log(`[AuthManager] Lock exists for ${cacheKey} - waiting for other worker to finish login`);
            const waitResult = await this.waitForCacheOrLockRelease(cacheKey);
            if (waitResult) {
                console.log(`[AuthManager] Got cached state from other worker for ${cacheKey}`);
                this.memCache.set(cacheKey, waitResult);
                if (await this.applyCachedState(context, page, waitResult)) {
                    console.log(`[AuthManager] Cookie swap (from other worker) successful for ${cacheKey}`);
                    return;
                }
                console.log(`[AuthManager] Cookie swap (from other worker) failed for ${cacheKey} - doing own login`);
            }

            if (!this.tryAcquireLock(cacheKey)) {
                console.log(`[AuthManager] Could not acquire lock for ${cacheKey} - proceeding without lock`);
            }
        }

        const recheckCached = this.readFileCache(cacheKey);
        if (recheckCached) {
            this.memCache.set(cacheKey, recheckCached);
            if (await this.applyCachedState(context, page, recheckCached)) {
                console.log(`[AuthManager] Double-check cache HIT for ${cacheKey} - skipping login`);
                this.releaseLock(cacheKey);
                return;
            }
        }

        try {
            await this.doLogin(context, page, cacheKey, username, password);
        } finally {
            this.releaseLock(cacheKey);
        }
    }

    private async doLogin(context: BrowserContext, page: Page, cacheKey: string, username: string, password: string): Promise<void> {
        await this.safeClearCookies(context, page);

        try {
            console.log(`[AuthManager] Attempting API login for ${cacheKey}`);
            const result = await loginViaApi(username, password);
            await context.addCookies(result.cookies);

            await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });

            const logo = page.locator('[data-testid="aventis-logo"]');
            await logo.waitFor({ state: "attached", timeout: 15000 });
            console.log(`[AuthManager] API login successful for ${cacheKey}`);
            await this.cacheFromContext(context, username);
            return;
        } catch (apiError) {
            const msg = apiError instanceof Error ? apiError.message : String(apiError);
            console.log(`[AuthManager] API login failed for ${cacheKey}, falling back to MS GUI login: ${msg}`);
        }

        await this.safeClearCookies(context, page);
        await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });

        const msLoginPage = new MicrosoftLoginPage(page);
        await msLoginPage.login(username, password);

        await page.goto("/", { waitUntil: "domcontentloaded", timeout: 30000 });

        const logoAfterGui = page.locator('[data-testid="aventis-logo"]');
        await logoAfterGui.waitFor({ state: "attached", timeout: 15000 });
        console.log(`[AuthManager] GUI login successful for ${cacheKey}`);
        await this.cacheFromContext(context, username);
    }

    invalidate(username: string): void {
        const cacheKey = username.toLowerCase();
        this.memCache.delete(cacheKey);
        try {
            fs.unlinkSync(this.cacheFilePath(cacheKey));
        } catch { /* file may not exist */ }
        console.log(`[AuthManager] Invalidated cache for ${cacheKey} (mem+file)`);
    }

    invalidateAll(): void {
        this.memCache.clear();
        try {
            const files = fs.readdirSync(CACHE_DIR);
            for (const f of files) {
                if (f.endsWith(".json") || f.endsWith(".lock")) {
                    fs.unlinkSync(path.join(CACHE_DIR, f));
                }
            }
        } catch { /* dir may not exist */ }
        console.log(`[AuthManager] Invalidated all cached states (mem+file)`);
    }
}
