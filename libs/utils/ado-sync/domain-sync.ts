import type { EpicEntry, FeatureEntry } from "./domain-types.js";

const API_VERSION = "7.1";
const RATE_LIMIT_DELAY_MS = 200;
const MAX_RETRIES = 3;
const BACKOFF_BASE_MS = 1000;
const BATCH_SIZE = 200;

export interface DomainSyncClientConfig {
    orgUrl: string;
    project: string;
    token: string;
}

export class DomainSyncClient {
    private config: DomainSyncClientConfig;
    private headers: Record<string, string>;

    constructor(config: DomainSyncClientConfig) {
        this.config = config;

        const isBearer = config.token.startsWith("Bearer ");
        this.headers = {
            "Content-Type": "application/json",
            Authorization: isBearer ? config.token : `Basic ${Buffer.from(`:${config.token}`).toString("base64")}`
        };
    }

    static fromEnv(): DomainSyncClient {
        const token = process.env.AZURE_DEVOPS_TOKEN || process.env.AZURE_TOKEN || process.env.SYSTEM_ACCESSTOKEN || "";
        const orgUrl = process.env.AZURE_DEVOPS_ORG_URL || "https://diartis.visualstudio.com";
        const project = process.env.AZURE_DEVOPS_PROJECT || "Aventis";

        if (!token) {
            throw new Error("No ADO token found. Set AZURE_DEVOPS_TOKEN environment variable.");
        }

        return new DomainSyncClient({ orgUrl, project, token });
    }

    async fetchAllEpics(activeOnly: boolean, verbose: boolean): Promise<EpicEntry[]> {
        const stateFilter = activeOnly
            ? "AND [System.State] <> 'Closed' AND [System.State] <> 'Removed'"
            : "";

        const wiql = `
            SELECT [System.Id]
            FROM WorkItems
            WHERE [System.WorkItemType] = 'Epic'
              AND [System.TeamProject] = '${this.config.project}'
              ${stateFilter}
            ORDER BY [System.Title]
        `;

        if (verbose) console.log(`WIQL (Epics): ${wiql.trim()}`);

        const epicIds = await this.runWiql(wiql);
        if (verbose) console.log(`Found ${epicIds.length} epics`);

        if (epicIds.length === 0) return [];

        const epicDetails = await this.batchGetWorkItems(epicIds, verbose);

        const epics: EpicEntry[] = epicDetails.map((item) => ({
            id: item.id,
            title: item.fields["System.Title"] || "",
            description: stripHtml(item.fields["System.Description"] || ""),
            acceptanceCriteria: stripHtml(item.fields["Microsoft.VSTS.Common.AcceptanceCriteria"] || ""),
            state: item.fields["System.State"] || "",
            areaPath: item.fields["System.AreaPath"] || "",
            tags: item.fields["System.Tags"] || "",
            url: `${this.config.orgUrl}/${this.config.project}/_workitems/edit/${item.id}`,
            features: []
        }));

        return epics;
    }

    async fetchFeaturesForEpics(epics: EpicEntry[], verbose: boolean): Promise<void> {
        if (epics.length === 0) return;

        const epicIdList = epics.map((e) => e.id).join(",");

        const wiql = `
            SELECT [System.Id]
            FROM WorkItemLinks
            WHERE ([Source].[System.Id] IN (${epicIdList}))
              AND ([System.Links.LinkType] = 'System.LinkTypes.Hierarchy-Forward')
              AND ([Target].[System.WorkItemType] = 'Feature')
            MODE (MustContain)
        `;

        if (verbose) console.log(`WIQL (Features): fetching children of ${epics.length} epics`);

        const linkResult = await this.runWiqlLinks(wiql);

        const featureIdToParent = new Map<number, number>();
        const allFeatureIds: number[] = [];

        for (const relation of linkResult) {
            if (relation.target && relation.source) {
                const parentId = relation.source.id;
                const childId = relation.target.id;
                featureIdToParent.set(childId, parentId);
                allFeatureIds.push(childId);
            }
        }

        if (verbose) console.log(`Found ${allFeatureIds.length} features across all epics`);

        if (allFeatureIds.length === 0) return;

        const featureDetails = await this.batchGetWorkItems(allFeatureIds, verbose);

        const epicMap = new Map(epics.map((e) => [e.id, e]));

        for (const item of featureDetails) {
            const parentId = featureIdToParent.get(item.id);
            if (!parentId) continue;

            const epic = epicMap.get(parentId);
            if (!epic) continue;

            const feature: FeatureEntry = {
                id: item.id,
                title: item.fields["System.Title"] || "",
                description: stripHtml(item.fields["System.Description"] || ""),
                acceptanceCriteria: stripHtml(item.fields["Microsoft.VSTS.Common.AcceptanceCriteria"] || ""),
                state: item.fields["System.State"] || "",
                tags: item.fields["System.Tags"] || ""
            };

            epic.features.push(feature);
        }

        for (const epic of epics) {
            epic.features.sort((a, b) => a.title.localeCompare(b.title));
        }
    }

    private async runWiql(wiql: string): Promise<number[]> {
        const url = `${this.config.orgUrl}/${this.config.project}/_apis/wit/wiql?api-version=${API_VERSION}`;

        const response = await this.fetchReadOnly(url, {
            method: "POST",
            body: JSON.stringify({ query: wiql })
        });

        const data = (await response.json()) as { workItems?: { id: number }[] };
        return (data.workItems || []).map((wi) => wi.id);
    }

    private async runWiqlLinks(wiql: string): Promise<{ source: { id: number } | null; target: { id: number } | null }[]> {
        const url = `${this.config.orgUrl}/${this.config.project}/_apis/wit/wiql?api-version=${API_VERSION}`;

        const response = await this.fetchReadOnly(url, {
            method: "POST",
            body: JSON.stringify({ query: wiql })
        });

        const data = (await response.json()) as {
            workItemRelations?: { source: { id: number } | null; target: { id: number } | null }[];
        };
        return data.workItemRelations || [];
    }

    private async batchGetWorkItems(
        ids: number[],
        verbose: boolean
    ): Promise<{ id: number; fields: Record<string, string> }[]> {
        const fields = [
            "System.Id",
            "System.Title",
            "System.Description",
            "System.State",
            "System.Tags",
            "System.AreaPath",
            "Microsoft.VSTS.Common.AcceptanceCriteria"
        ];

        const allItems: { id: number; fields: Record<string, string> }[] = [];

        for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            const batch = ids.slice(i, i + BATCH_SIZE);
            if (verbose) console.log(`  Batch fetch: ${batch.length} items (${i + 1}-${i + batch.length} of ${ids.length})`);

            const url = `${this.config.orgUrl}/${this.config.project}/_apis/wit/workitemsbatch?api-version=${API_VERSION}`;

            const response = await this.fetchReadOnly(url, {
                method: "POST",
                body: JSON.stringify({ ids: batch, fields })
            });

            const data = (await response.json()) as {
                value?: { id: number; fields: Record<string, string> }[];
            };

            if (data.value) {
                allItems.push(...data.value);
            }

            if (i + BATCH_SIZE < ids.length) {
                await delay(RATE_LIMIT_DELAY_MS);
            }
        }

        return allItems;
    }

    /**
     * READ-ONLY fetch wrapper. Despite using POST for WIQL (required by ADO API),
     * all operations here are strictly read-only queries. No work items are created,
     * updated, or deleted. The POST method is required by ADO for WIQL and batch endpoints.
     */
    private async fetchReadOnly(url: string, init?: RequestInit): Promise<Response> {
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

function stripHtml(html: string): string {
    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/?(p|div|li|ul|ol|h[1-6])[^>]*>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
