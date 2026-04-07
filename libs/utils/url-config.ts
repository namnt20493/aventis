/**
 * Centralized URL configuration for frontend and backend
 * Supports both cloud environments (qa, dev, staging) and local development
 */

export function getBackendUrl(frontendUrl?: string): string {
    if (process.env.API_BASE_URL) {
        return process.env.API_BASE_URL.replace(/\/$/, "");
    }

    const baseUrl = frontendUrl || process.env.BASE_URL || "https://qa.aventis.swiss/";

    if (baseUrl.includes("localhost")) {
        throw new Error("Local development detected but API_BASE_URL not set. " + "Please set API_BASE_URL environment variable (e.g., https://localhost:44315)");
    }

    const match = baseUrl.match(/https?:\/\/([^.]+)\.aventis\.swiss/);
    if (!match) {
        throw new Error(`Cannot extract environment from URL: ${baseUrl}. ` + `Expected format: https://{environment}.aventis.swiss or set API_BASE_URL`);
    }

    const environment = match[1];
    return `https://aventis-${environment}-backend.azurewebsites.net`;
}

export function getBackendDomain(frontendUrl?: string): string {
    const backendUrl = getBackendUrl(frontendUrl);
    return backendUrl.replace(/^https?:\/\//, "").replace(/:\d+$/, "");
}

export function isLocalEnvironment(): boolean {
    const baseUrl = process.env.BASE_URL || "";
    return baseUrl.includes("localhost");
}
