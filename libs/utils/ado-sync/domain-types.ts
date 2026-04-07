export interface EpicEntry {
    id: number;
    title: string;
    description: string;
    acceptanceCriteria: string;
    state: string;
    areaPath: string;
    tags: string;
    url: string;
    features: FeatureEntry[];
}

export interface FeatureEntry {
    id: number;
    title: string;
    description: string;
    acceptanceCriteria: string;
    state: string;
    tags: string;
}

export interface DomainGroup {
    domainKey: string;
    domainLabel: string;
    epics: EpicEntry[];
}

export interface DomainSyncResult {
    syncedAt: string;
    totalEpics: number;
    totalFeatures: number;
    domains: DomainGroup[];
    unmapped: EpicEntry[];
}

export interface DomainSyncOptions {
    dryRun: boolean;
    outputDir: string;
    verbose: boolean;
    filterDomain?: string;
    activeOnly: boolean;
}
