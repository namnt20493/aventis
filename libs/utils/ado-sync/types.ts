export type TestType = "keywordvalidation" | "journey" | "acceptance";

export interface TestAnnotation {
    type: string;
    description: string;
    bugId?: number;
}

export interface ManifestConfig {
    testDirs: string[];
    keywordDirs: string[];
    generatedBy: string;
    adoPlanId: number;
    adoSuiteId: number;
    adoKvPlanId: number;
    adoKvSuiteId: number;
    adoJtPlanId: number;
    adoJtSuiteId: number;
    adoAtPlanId: number;
    adoAtSuiteId: number;
}

export interface TestStepEntry {
    name: string;
    keyword: string;
    parameters?: string;
    fullDescription: string;
}

export interface TestEntry {
    specFile: string;
    testName: string;
    adoId: number | null;
    tags: string[];
    domain: string;
    steps: TestStepEntry[];
    keywordsUsed: string[];
    status: "synced" | "missing-ado-id" | "ado-only" | "drifted";
    hash: string;
    testType: TestType;
    annotations: TestAnnotation[];
}

export interface KeywordParameter {
    name: string;
    type: string;
    optional: boolean;
}

export interface KeywordMethod {
    name: string;
    parameters: KeywordParameter[];
}

export interface KeywordEntry {
    className: string;
    file: string;
    methods: KeywordMethod[];
}

export interface ManifestSummary {
    totalTests: number;
    withAdoId: number;
    missingAdoId: number;
    wipTests: number;
    knownBugsCount: number;
    totalKeywords: number;
    totalKeywordMethods: number;
    domains: Record<string, number>;
    byTestType: Record<TestType, number>;
}

export interface KnownBugEntry {
    bugId: number;
    bugUrl: string;
    affectedTests: { testName: string; specFile: string; adoId: number | null }[];
}

export interface TestManifest {
    version: string;
    generatedAt: string;
    config: ManifestConfig;
    tests: TestEntry[];
    keywords: KeywordEntry[];
    summary: ManifestSummary;
}

export interface ValidationError {
    level: "error" | "warning";
    code: string;
    message: string;
    file?: string;
    details?: string;
}

export interface ValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    warnings: ValidationError[];
}

export interface SyncResultEntry {
    testName: string;
    action: "created" | "updated" | "skipped" | "error";
    adoId?: number;
    message?: string;
}

export interface SyncResult {
    created: number;
    updated: number;
    skipped: number;
    errors: SyncResultEntry[];
    entries: SyncResultEntry[];
}

export interface CliOptions {
    command: string;
    dryRun: boolean;
    writeBack: boolean;
    includeWip: boolean;
    testDir: string;
    format: "json" | "table";
    filter: Record<string, string>;
    verbose: boolean;
}

export interface AdoTestCase {
    id: number;
    title: string;
    tags: string;
    steps: { action: string; expected: string }[];
    automationStatus: string;
}

export interface AdoClientConfig {
    orgUrl: string;
    project: string;
    planId: number;
    suiteId: number;
    token: string;
}
