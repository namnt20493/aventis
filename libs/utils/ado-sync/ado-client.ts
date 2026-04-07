import { AdoClientConfig, AdoTestCase, TestType } from "./types.js";

const API_VERSION = "7.1";
const RATE_LIMIT_DELAY_MS = 200;
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 1000;

export class AdoClient {
    private config: AdoClientConfig;
    private headers: Record<string, string>;

    constructor(config: AdoClientConfig) {
        this.config = config;

        const isBearer = config.token.startsWith("Bearer ");
        this.headers = {
            "Content-Type": "application/json",
            Authorization: isBearer ? config.token : `Basic ${Buffer.from(`:${config.token}`).toString("base64")}`
        };
    }

    static fromEnv(testType: TestType = "keywordvalidation"): AdoClient {
        const token = process.env.AZURE_DEVOPS_TOKEN || process.env.AZURE_TOKEN || process.env.SYSTEM_ACCESSTOKEN || "";
        const orgUrl = process.env.AZURE_DEVOPS_ORG_URL || "https://diartis.visualstudio.com";
        const project = process.env.AZURE_DEVOPS_PROJECT || "Aventis";

        let planId: number, suiteId: number;

        switch (testType) {
            case "journey":
                planId = parseInt(process.env.AZURE_DEVOPS_JT_PLAN_ID || "183831", 10);
                suiteId = parseInt(process.env.AZURE_DEVOPS_JT_SUITE_ID || "183879", 10);
                break;
            case "acceptance":
                planId = parseInt(process.env.AZURE_DEVOPS_AT_PLAN_ID || "183595", 10);
                suiteId = parseInt(process.env.AZURE_DEVOPS_AT_SUITE_ID || "183597", 10);
                break;
            case "keywordvalidation":
            default:
                planId = parseInt(process.env.AZURE_DEVOPS_KV_PLAN_ID || "181204", 10);
                suiteId = parseInt(process.env.AZURE_DEVOPS_KV_SUITE_ID || "181205", 10);
        }

        if (!token) {
            throw new Error("No ADO token found. Set AZURE_DEVOPS_TOKEN or SYSTEM_ACCESSTOKEN environment variable.");
        }

        return new AdoClient({ orgUrl, project, planId, suiteId, token });
    }

    async getTestCasesInSuite(): Promise<AdoTestCase[]> {
        const url = `${this.config.orgUrl}/${this.config.project}/_apis/testplan/Plans/${this.config.planId}/Suites/${this.config.suiteId}/TestCase?api-version=${API_VERSION}`;

        const response = await this.fetchWithRetry(url);
        const data = (await response.json()) as { value?: { workItem?: { id: number; name: string } }[]; count?: number };

        if (!data.value) return [];

        const testCases: AdoTestCase[] = [];
        for (const entry of data.value) {
            if (!entry.workItem) continue;
            const detail = await this.getWorkItem(entry.workItem.id);
            testCases.push(detail);
            await delay(RATE_LIMIT_DELAY_MS);
        }

        return testCases;
    }

    async getWorkItem(id: number): Promise<AdoTestCase> {
        const url = `${this.config.orgUrl}/${this.config.project}/_apis/wit/workitems/${id}?$expand=all&api-version=${API_VERSION}`;

        const response = await this.fetchWithRetry(url);
        const data = (await response.json()) as {
            id: number;
            fields: {
                "System.Title"?: string;
                "System.Tags"?: string;
                "Microsoft.VSTS.TCM.Steps"?: string;
                "Microsoft.VSTS.TCM.AutomationStatus"?: string;
            };
        };

        return {
            id: data.id,
            title: data.fields["System.Title"] || "",
            tags: data.fields["System.Tags"] || "",
            steps: parseAdoSteps(data.fields["Microsoft.VSTS.TCM.Steps"] || ""),
            automationStatus: data.fields["Microsoft.VSTS.TCM.AutomationStatus"] || ""
        };
    }

    async createTestCase(title: string, steps: { action: string; expected: string }[], tags: string): Promise<number> {
        const url = `${this.config.orgUrl}/${this.config.project}/_apis/wit/workitems/$Test Case?api-version=${API_VERSION}`;

        const stepsXml = buildStepsXml(steps);

        const body = [
            { op: "add", path: "/fields/System.Title", value: title },
            { op: "add", path: "/fields/System.Tags", value: tags },
            { op: "add", path: "/fields/Microsoft.VSTS.TCM.Steps", value: stepsXml }
        ];

        const response = await this.fetchWithRetry(url, {
            method: "POST",
            headers: {
                ...this.headers,
                "Content-Type": "application/json-patch+json"
            },
            body: JSON.stringify(body)
        });

        const data = (await response.json()) as { id: number };
        return data.id;
    }

    async addTestCaseToSuite(testCaseId: number): Promise<{ added: boolean; reason?: string }> {
        const url = `${this.config.orgUrl}/${this.config.project}/_apis/testplan/Plans/${this.config.planId}/Suites/${this.config.suiteId}/TestCase?api-version=${API_VERSION}`;

        const body = [{ workItem: { id: testCaseId } }];

        try {
            await this.fetchWithRetry(url, {
                method: "POST",
                body: JSON.stringify(body)
            });
            return { added: true };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            if (errorMessage.includes("query based suite") || errorMessage.includes("InvalidPropertyException")) {
                return {
                    added: false,
                    reason: "Query-based suite (test case will auto-populate via tags)"
                };
            }

            throw error;
        }
    }

    async updateTestCaseSteps(id: number, steps: { action: string; expected: string }[]): Promise<void> {
        const url = `${this.config.orgUrl}/${this.config.project}/_apis/wit/workitems/${id}?api-version=${API_VERSION}`;

        const stepsXml = buildStepsXml(steps);

        const body = [{ op: "replace", path: "/fields/Microsoft.VSTS.TCM.Steps", value: stepsXml }];

        await this.fetchWithRetry(url, {
            method: "PATCH",
            headers: {
                ...this.headers,
                "Content-Type": "application/json-patch+json"
            },
            body: JSON.stringify(body)
        });
    }

    private async fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
        const options: RequestInit = {
            ...init,
            headers: {
                ...this.headers,
                ...((init?.headers as Record<string, string>) || {})
            }
        };

        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
            const response = await fetch(url, options);

            if (response.ok) return response;

            if (response.status === 429) {
                const waitMs = BACKOFF_BASE_MS * Math.pow(2, attempt);
                console.warn(`Rate limited (429). Waiting ${waitMs}ms before retry ${attempt + 1}/${MAX_RETRIES}`);
                await delay(waitMs);
                continue;
            }

            const errorBody = await response.text().catch(() => "");
            throw new Error(`ADO API error ${response.status}: ${response.statusText}\n${errorBody}`);
        }

        throw new Error(`ADO API failed after ${MAX_RETRIES} retries`);
    }
}

function parseAdoSteps(stepsXml: string): { action: string; expected: string }[] {
    const steps: { action: string; expected: string }[] = [];
    const stepRegex = /<step[^>]*>.*?<parameterizedString[^>]*>(.*?)<\/parameterizedString>.*?<parameterizedString[^>]*>(.*?)<\/parameterizedString>.*?<\/step>/gs;

    let match: RegExpExecArray | null;
    while ((match = stepRegex.exec(stepsXml)) !== null) {
        steps.push({
            action: stripHtml(match[1]),
            expected: stripHtml(match[2])
        });
    }

    return steps;
}

function stripHtml(html: string): string {
    return html
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .trim();
}

function buildStepsXml(steps: { action: string; expected: string }[]): string {
    const stepElements = steps.map((step, i) => {
        const action = escapeXml(step.action);
        const expected = escapeXml(step.expected);
        return `<step id="${i + 2}" type="ActionStep"><parameterizedString isformatted="true">${action}</parameterizedString><parameterizedString isformatted="true">${expected}</parameterizedString><description/></step>`;
    });

    return `<steps id="0" last="${steps.length + 1}">${stepElements.join("")}</steps>`;
}

function escapeXml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
