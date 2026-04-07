import { BrowserContext } from "@playwright/test";
import { getBackendDomain, getBackendUrl, isLocalEnvironment } from "./url-config";

const TENANT_ID = "f8fae057-6d6d-43ea-a999-7cc2e93b0d90";

interface ApiLoginResult {
    success: boolean;
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
}

const BACKEND_DOMAIN = getBackendDomain();

function parseCookiesFromHeaders(headers: Headers): string[] {
    const setCookieHeaders = (headers as any).getSetCookie?.() as string[] | undefined;

    if (setCookieHeaders && setCookieHeaders.length > 0) {
        return setCookieHeaders.map((cookie) => cookie.split(";")[0].trim()).filter((cookie) => cookie.includes("="));
    }

    const raw = headers.get("set-cookie");
    if (!raw) return [];

    return raw
        .split(/,(?=\s*\w+=)/)
        .map((cookie) => cookie.split(";")[0].trim())
        .filter((cookie) => cookie.includes("="));
}

function cookieStringToObjects(cookieStrings: string[], domain: string) {
    return cookieStrings.map((c) => {
        const eqIndex = c.indexOf("=");
        return {
            name: c.substring(0, eqIndex).trim(),
            value: c.substring(eqIndex + 1).trim(),
            domain,
            path: "/",
            expires: Math.floor(Date.now() / 1000) + 3600,
            httpOnly: true,
            secure: true,
            sameSite: "None" as const
        };
    });
}

function extractJson(html: string, key: string): string | null {
    const regex = new RegExp(`"${key}":\\s*"([^"]+)"`);
    return html.match(regex)?.[1] ?? null;
}

function extractJsonNum(html: string, key: string, defaultVal: string): string {
    const regex = new RegExp(`"${key}":\\s*(\\d+)`);
    return html.match(regex)?.[1] ?? defaultVal;
}

export async function loginViaApi(username: string, password: string): Promise<ApiLoginResult> {
    const backendUrl = `https://${BACKEND_DOMAIN}`;

    console.log(`[ApiLogin] Starting API login for ${username}`);
    console.log(`[ApiLogin] Backend: ${BACKEND_DOMAIN}`);

    // Step 0.9: Logout to clear old session (fire-and-forget)
    fetch(`${backendUrl}/logout`, { redirect: "follow" }).catch(() => {});

    // Step 1.0: GET backend /login - capture redirect URL + correlation cookies
    console.log("[ApiLogin] Step 1.0: GET backend /login (capture redirect)");
    const step1Response = await fetch(`${backendUrl}/login`, { redirect: "manual" });

    if (step1Response.status !== 302) {
        throw new Error(`[ApiLogin] Step 1.0: Expected 302 redirect, got ${step1Response.status}`);
    }

    const azureAdRedirectUrl = step1Response.headers.get("location");
    if (!azureAdRedirectUrl) {
        throw new Error("[ApiLogin] Step 1.0: No Location header in redirect response");
    }

    const correlationCookies = parseCookiesFromHeaders(step1Response.headers);
    console.log(`[ApiLogin] Step 1.0: Got redirect URL and ${correlationCookies.length} correlation cookies`);

    // Step 1.1: GET Azure AD login page - extract tokens
    console.log("[ApiLogin] Step 1.1: GET Azure AD login page");
    const step11Response = await fetch(azureAdRedirectUrl, { redirect: "follow" });
    const loginPageHtml = await step11Response.text();

    const sFT = extractJson(loginPageHtml, "sFT");
    const sCtx = extractJson(loginPageHtml, "sCtx");

    if (!sFT || !sCtx) {
        throw new Error("[ApiLogin] Step 1.1: Failed to extract login tokens (sFT or sCtx)");
    }

    const urlPostRaw = extractJson(loginPageHtml, "urlPost");
    const canary = extractJson(loginPageHtml, "canary") ?? "";
    const apiCanary = extractJson(loginPageHtml, "apiCanary") ?? "";
    const sessionId = extractJson(loginPageHtml, "sessionId") ?? "";
    const hpgact = extractJsonNum(loginPageHtml, "hpgact", "1800");
    const hpgid = extractJsonNum(loginPageHtml, "hpgid", "1104");

    const urlPost = urlPostRaw ? urlPostRaw.replace(/\\\//g, "/") : `/${TENANT_ID}/login`;

    console.log("[ApiLogin] Step 1.1: Tokens extracted successfully");

    // Collect cookies from Azure AD login page
    const azureCookieHeader = step11Response.headers.get("set-cookie") || "";
    const azureCookies = parseCookiesFromHeaders(step11Response.headers);

    // Step 1.2: POST GetCredentialType
    console.log("[ApiLogin] Step 1.2: POST GetCredentialType");
    const gctBody = JSON.stringify({
        username,
        isOtherIdpSupported: true,
        checkPhones: false,
        isRemoteNGCSupported: true,
        isCookieBannerShown: false,
        isFidoSupported: true,
        originalRequest: sCtx,
        country: "CH",
        forceotclogin: false,
        isExternalFederationDisallowed: false,
        isRemoteConnectSupported: false,
        federationFlags: 0,
        isSignup: false,
        flowToken: sFT,
        isAccessPassSupported: true
    });

    const step12Response = await fetch("https://login.microsoftonline.com/common/GetCredentialType?mkt=en-US", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            canary: apiCanary,
            "client-request-id": sessionId,
            hpgrequestid: sessionId,
            hpgact: hpgact,
            hpgid: hpgid,
            Origin: "https://login.microsoftonline.com",
            Referer: "https://login.microsoftonline.com/"
        },
        body: gctBody
    });

    const gctResult = await step12Response.json();
    const flowTokenGCT = gctResult.FlowToken || sFT;
    console.log("[ApiLogin] Step 1.2: GetCredentialType done");

    // Step 1.3: POST Login Credentials
    console.log("[ApiLogin] Step 1.3: POST login credentials");
    const loginParams = new URLSearchParams({
        i13: "0",
        login: username,
        loginfmt: username,
        type: "11",
        LoginOptions: "3",
        lrt: "",
        lrtPartition: "",
        hisRegion: "",
        hisScaleUnit: "",
        passwd: password,
        ps: "2",
        psRNGCDefaultType: "",
        psRNGCEntropy: "",
        psRNGCSLK: "",
        canary,
        ctx: sCtx,
        hpgrequestid: sessionId,
        flowtoken: flowTokenGCT,
        PPSX: "",
        NewUser: "1",
        FoundMSAs: "",
        fspost: "0",
        i21: "0",
        CookieDisclosure: "0",
        IsFidoSupported: "1",
        isSignupPost: "0",
        i19: "27763"
    });

    // Build cookie header from Azure AD cookies for the login POST
    const loginCookieStr = azureCookies.join("; ");

    const step13Response = await fetch(`https://login.microsoftonline.com${urlPost}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://login.microsoftonline.com",
            Referer: "https://login.microsoftonline.com/",
            ...(loginCookieStr ? { Cookie: loginCookieStr } : {})
        },
        body: loginParams.toString(),
        redirect: "manual"
    });

    let loginResponseHtml = await step13Response.text();

    // Extract id_token and state
    let idToken = loginResponseHtml.match(/name="id_token"[^>]*value="([^"]+)"/)?.[1] ?? null;
    let state = loginResponseHtml.match(/name="state"[^>]*value="([^"]+)"/)?.[1] ?? null;

    // Step 1.4: Handle KMSI (Keep Me Signed In) prompt if needed
    if (!idToken) {
        const flowtoken2 = extractJson(loginResponseHtml, "sFT");
        const sCtx2 = extractJson(loginResponseHtml, "sCtx");

        if (flowtoken2 && sCtx2) {
            console.log("[ApiLogin] Step 1.4: KMSI prompt detected, confirming...");

            const kmsiParams = new URLSearchParams({
                LoginOptions: "1",
                type: "28",
                ctx: sCtx2,
                flowtoken: flowtoken2,
                canary,
                DontShowAgain: "true",
                hpgrequestid: sessionId,
                i19: "27763"
            });

            const step14Response = await fetch("https://login.microsoftonline.com/kmsi", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Origin: "https://login.microsoftonline.com",
                    Referer: "https://login.microsoftonline.com/",
                    ...(loginCookieStr ? { Cookie: loginCookieStr } : {})
                },
                body: kmsiParams.toString(),
                redirect: "manual"
            });

            const kmsiHtml = await step14Response.text();
            idToken = kmsiHtml.match(/name="id_token"[^>]*value="([^"]+)"/)?.[1] ?? null;
            state = kmsiHtml.match(/name="state"[^>]*value="([^"]+)"/)?.[1] ?? null;
        }
    }

    if (!idToken || !state) {
        const errorMatch = loginResponseHtml.match(/sErrTxt\s*:\s*'([^']+)'/);
        const errorMsg = errorMatch ? errorMatch[1] : "Unknown error";
        throw new Error(`[ApiLogin] Step 1.3/1.4: Failed to get id_token/state. Error: ${errorMsg}`);
    }

    console.log("[ApiLogin] Step 1.3/1.4: Got id_token and state");

    // Step 1.5: POST signin-oidc to backend with correlation cookies
    console.log("[ApiLogin] Step 1.5: POST signin-oidc");
    const oidcParams = new URLSearchParams({
        id_token: idToken,
        state: state
    });

    const correlationCookieStr = correlationCookies.join("; ");

    const step15Response = await fetch(`${backendUrl}/signin-oidc`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Origin: "https://login.microsoftonline.com",
            ...(correlationCookieStr ? { Cookie: correlationCookieStr } : {})
        },
        body: oidcParams.toString(),
        redirect: "manual"
    });

    if (step15Response.status !== 302) {
        throw new Error(`[ApiLogin] Step 1.5: Expected 302 from signin-oidc, got ${step15Response.status}`);
    }

    const locationHeader = step15Response.headers.get("location") || "";
    if (locationHeader.includes("login.microsoftonline.com")) {
        throw new Error("[ApiLogin] Step 1.5: signin-oidc redirected back to Azure AD - correlation cookies missing!");
    }

    // Collect cookies from the initial 302 response
    const allSessionCookies: string[] = [...parseCookiesFromHeaders(step15Response.headers)];
    console.log(`[ApiLogin] Step 1.5: Got ${allSessionCookies.length} cookies from signin-oidc response`);

    // Follow redirect chain manually to collect cookies from all hops
    let nextUrl = locationHeader;
    let accumulatedCookieStr = correlationCookieStr;
    let redirectCount = 0;
    const MAX_REDIRECTS = 5;

    while (nextUrl && redirectCount < MAX_REDIRECTS) {
        redirectCount++;
        const absoluteUrl = nextUrl.startsWith("http") ? nextUrl : `${backendUrl}${nextUrl}`;

        if (allSessionCookies.length > 0) {
            accumulatedCookieStr = [accumulatedCookieStr, ...allSessionCookies].filter(Boolean).join("; ");
        }

        console.log(`[ApiLogin] Step 1.5: Following redirect #${redirectCount} to ${absoluteUrl}`);
        const redirectResponse = await fetch(absoluteUrl, {
            method: "GET",
            headers: {
                ...(accumulatedCookieStr ? { Cookie: accumulatedCookieStr } : {})
            },
            redirect: "manual"
        });

        const redirectCookies = parseCookiesFromHeaders(redirectResponse.headers);
        if (redirectCookies.length > 0) {
            console.log(`[ApiLogin] Step 1.5: Got ${redirectCookies.length} cookies from redirect #${redirectCount}`);
            allSessionCookies.push(...redirectCookies);
        }

        if (redirectResponse.status >= 300 && redirectResponse.status < 400) {
            nextUrl = redirectResponse.headers.get("location") || "";
        } else {
            break;
        }
    }

    console.log(`[ApiLogin] Step 1.5: Total ${allSessionCookies.length} session cookies collected`);

    const backendCookieObjects = cookieStringToObjects(allSessionCookies, BACKEND_DOMAIN);

    if (backendCookieObjects.length === 0) {
        throw new Error("[ApiLogin] Step 1.5: No session cookies received after following redirect chain");
    }

    console.log(`[ApiLogin] Login successful! ${backendCookieObjects.length} cookies ready for injection`);

    return {
        success: true,
        cookies: backendCookieObjects
    };
}

export async function loginAndInjectCookies(context: BrowserContext, username: string, password: string): Promise<void> {
    const result = await loginViaApi(username, password);

    if (!result.success || result.cookies.length === 0) {
        throw new Error("[ApiLogin] Login failed or no cookies received");
    }

    await context.clearCookies();
    await context.addCookies(result.cookies);

    console.log(`[ApiLogin] Injected ${result.cookies.length} cookies into browser context`);
}
