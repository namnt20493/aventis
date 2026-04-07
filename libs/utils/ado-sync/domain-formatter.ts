import * as fs from "fs";
import * as path from "path";
import type { EpicEntry, DomainGroup, DomainSyncResult, DomainSyncOptions } from "./domain-types.js";

const TITLE_RULES: { pattern: RegExp; domain: string }[] = [
    { pattern: /^Schnittstelle/i, domain: "schnittstellen" },
    { pattern: /Buchhaltung/i, domain: "zahlungen" },
    { pattern: /Anspruchsprüfung/i, domain: "anspruchspruefung" },
    { pattern: /Persönliche Hilfe/i, domain: "persoenliche-hilfe" },
    { pattern: /Benutzerverwaltung/i, domain: "system-plattform" },
    { pattern: /Konfiguration/i, domain: "system-plattform" },
    { pattern: /Lösungsarchitektur/i, domain: "system-plattform" },
    { pattern: /User Experience/i, domain: "system-plattform" },
    { pattern: /e-Services/i, domain: "system-plattform" },
    { pattern: /Sicherheit.*Security/i, domain: "system-plattform" },
    { pattern: /Statistik.*Reporting/i, domain: "statistik-auswertungen" },
    { pattern: /Auswertungen/i, domain: "statistik-auswertungen" },
    { pattern: /Qualitätssicherung/i, domain: "statistik-auswertungen" },
    { pattern: /Wallis|Kt\. Wallis/i, domain: "kantonal" },
    { pattern: /Migration\b/i, domain: "kantonal" },
    { pattern: /Testautomatisierung/i, domain: "testautomatisierung" },
    { pattern: /Vorlage für/i, domain: "testautomatisierung" },
    { pattern: /Adoptiv|Pflegekinder|KES/i, domain: "fachloesungen" },
    { pattern: /Alimentenhilfe/i, domain: "fachloesungen" },
    { pattern: /Asylhilfe/i, domain: "fachloesungen" },
    { pattern: /Massnahmen.*ZGB/i, domain: "fachloesungen" },
    { pattern: /Gesundheitskosten/i, domain: "fachloesungen" },
    { pattern: /Unterbringung|Unterkünfte/i, domain: "wohnsituation" },
    { pattern: /Fallsteuerung/i, domain: "bewilligung" },
];

const DOMAIN_MAPPING: Record<string, { label: string; keywords: string[] }> = {
    "dossier-verwaltung": {
        label: "Dossier & Fallfuehrung",
        keywords: ["Dossier", "Haushalt", "Person", "Klient", "Stammdaten", "Aufgabe", "Lebenszyklus", "Aussonderung", "Archiv"]
    },
    "anspruchspruefung": {
        label: "Anspruchspruefung & Bedarfsabklaerung",
        keywords: ["Anspruch", "Bedarf", "Bedarfspruefung", "Bedarfsabklärung"]
    },
    "rahmenbudget": {
        label: "Rahmenbudget & Finanzen",
        keywords: ["Rahmenbudget", "Budget", "GBL", "Grundbedarf", "Wohnkosten", "Rueckbehalt", "Rückbehalt", "Finanzielle Unterstützung"]
    },
    "bewilligung": {
        label: "Bewilligung & Fallsteuerung",
        keywords: ["Bewilligung", "Leistungsentscheid", "Workflow", "Verwendungsperiode", "Freigabe", "Fallsteuerung"]
    },
    "rechnungen-dokumente": {
        label: "Rechnungen & Dokumente",
        keywords: ["Rechnung", "Dokument", "Invoice", "Dokumenteingang", "QR", "Scan"]
    },
    "zahlungen": {
        label: "Zahlungen & Buchhaltung",
        keywords: ["Zahlung", "Payment", "Valuta", "Buchhaltung", "Buchung", "IBAN", "Zahlungsverbindung", "Ebics", "E-Banking", "Finanzbuchhaltung"]
    },
    "wohnsituation": {
        label: "Wohnsituation & Integration",
        keywords: ["Wohn", "Miete", "Wohnung", "Umzug", "Vermieter", "Nebenkosten", "Unterbringung", "Unterkünfte", "Integration"]
    },
    "erwerbsintegration": {
        label: "Erwerbsintegration & FEV",
        keywords: ["FEV", "Eingliederung", "Erwerbsintegration", "Erwerbssituation", "Einkommen", "Lohn"]
    },
    "persoenliche-hilfe": {
        label: "Persoenliche Hilfe & Beratung",
        keywords: ["Persönliche Hilfe", "Beratung", "Sozialarbeit", "Begleitung"]
    },
    "rechtsverfolgung": {
        label: "Rechtsverfolgung",
        keywords: ["Rechtliche Verfahren", "Beschwerde", "Auflage", "Ermittlung"]
    },
    "rueckforderung": {
        label: "Rueckforderung & Schulden",
        keywords: ["Rueckforderung", "Rückforderung", "Rückerstattung", "Schuld", "Missbrauch", "Sozialhilfeschuld", "Ansprüche gegenüber Dritten"]
    },
    "kostengutsprache": {
        label: "Kostengutsprache & SBL",
        keywords: ["Kostengutsprache", "Situationsbedingte", "SBL", "Sonderausgabe"]
    },
    "schnittstellen": {
        label: "Schnittstellen & Externe Systeme",
        keywords: ["Schnittstelle", "EWK", "Einwohnerkontrolle", "ZEMIS", "BfS", "Prämienverbilligung", "Krankenkasse"]
    },
    "statistik-auswertungen": {
        label: "Statistik, Auswertungen & QS",
        keywords: ["Statistik", "Reporting", "Auswertung", "Qualitätssicherung", "Vollständigkeit"]
    },
    "system-plattform": {
        label: "System & Plattform",
        keywords: ["Benutzerverwaltung", "Konfiguration", "Parametrierung", "Architektur", "User Experience", "UX", "e-Services", "Portal", "Security", "Sicherheit"]
    },
    "fachloesungen": {
        label: "Fachloesungen (KES, Asyl, Alimente)",
        keywords: ["Adoptiv", "Pflegekinder", "KES", "Alimentenhilfe", "Asylhilfe", "Massnahmen", "ZGB", "Gesundheitskosten"]
    },
    "kantonal": {
        label: "Kantonale Einfuehrungen & Migration",
        keywords: ["Wallis", "Kanton", "Einführung", "Migration"]
    },
    "testautomatisierung": {
        label: "Testautomatisierung & Vorlagen",
        keywords: ["Testautomatisierung", "E2E", "Vorlage"]
    }
};

export function groupEpicsByDomain(epics: EpicEntry[]): { domains: DomainGroup[]; unmapped: EpicEntry[] } {
    const domainMap = new Map<string, DomainGroup>();
    const unmapped: EpicEntry[] = [];

    for (const [key, config] of Object.entries(DOMAIN_MAPPING)) {
        domainMap.set(key, { domainKey: key, domainLabel: config.label, epics: [] });
    }

    for (const epic of epics) {
        const matchedDomain = findDomainForEpic(epic);
        if (matchedDomain) {
            domainMap.get(matchedDomain)!.epics.push(epic);
        } else {
            unmapped.push(epic);
        }
    }

    const domains = Array.from(domainMap.values()).filter((d) => d.epics.length > 0);
    domains.sort((a, b) => a.domainLabel.localeCompare(b.domainLabel));

    return { domains, unmapped };
}

function findDomainForEpic(epic: EpicEntry): string | null {
    for (const rule of TITLE_RULES) {
        if (rule.pattern.test(epic.title)) {
            return rule.domain;
        }
    }

    const searchText = `${epic.title} ${epic.description} ${epic.tags} ${epic.areaPath}`.toLowerCase();

    let bestMatch: string | null = null;
    let bestScore = 0;

    for (const [key, config] of Object.entries(DOMAIN_MAPPING)) {
        let score = 0;
        for (const keyword of config.keywords) {
            if (searchText.includes(keyword.toLowerCase())) {
                score++;
            }
        }
        if (score > bestScore) {
            bestScore = score;
            bestMatch = key;
        }
    }

    return bestMatch;
}

export function generateDomainMarkdown(result: DomainSyncResult): Map<string, string> {
    const files = new Map<string, string>();

    files.set("_epic-index.md", generateIndexFile(result));

    for (const domain of result.domains) {
        files.set(`${domain.domainKey}.md`, generateDomainFile(domain, result.syncedAt));
    }

    if (result.unmapped.length > 0) {
        const unmappedDomain: DomainGroup = {
            domainKey: "sonstige",
            domainLabel: "Sonstige (nicht zugeordnet)",
            epics: result.unmapped
        };
        files.set("sonstige.md", generateDomainFile(unmappedDomain, result.syncedAt));
    }

    return files;
}

function generateIndexFile(result: DomainSyncResult): string {
    const lines: string[] = [
        "# Epic-Index (ADO Sync)",
        "",
        `> Letzter Sync: ${result.syncedAt} | Epics: ${result.totalEpics} | Features: ${result.totalFeatures}`,
        "> Automatisch generiert -- nicht manuell bearbeiten.",
        "",
        "## Domaenen-Uebersicht",
        "",
        "| Domaene | Epics | Features | Datei |",
        "|---------|-------|----------|-------|"
    ];

    for (const domain of result.domains) {
        const featureCount = domain.epics.reduce((sum, e) => sum + e.features.length, 0);
        lines.push(`| ${domain.domainLabel} | ${domain.epics.length} | ${featureCount} | [[${domain.domainKey}]] |`);
    }

    if (result.unmapped.length > 0) {
        const unmappedFeatures = result.unmapped.reduce((sum, e) => sum + e.features.length, 0);
        lines.push(`| Sonstige (nicht zugeordnet) | ${result.unmapped.length} | ${unmappedFeatures} | [[sonstige]] |`);
    }

    lines.push("");
    lines.push("## Alle Epics");
    lines.push("");
    lines.push("| Epic | ADO # | Status | Features | Domaene |");
    lines.push("|------|-------|--------|----------|---------|");

    const allEpics = [...result.domains.flatMap((d) => d.epics.map((e) => ({ epic: e, domain: d.domainLabel }))), ...result.unmapped.map((e) => ({ epic: e, domain: "Sonstige" }))];

    allEpics.sort((a, b) => a.epic.title.localeCompare(b.epic.title));

    for (const { epic, domain } of allEpics) {
        lines.push(`| ${epic.title} | [#${epic.id}](${epic.url}) | ${epic.state} | ${epic.features.length} | ${domain} |`);
    }

    lines.push("");
    return lines.join("\n");
}

function generateDomainFile(domain: DomainGroup, syncedAt: string): string {
    const lines: string[] = [
        `# ${domain.domainLabel}`,
        "",
        `> Automatisch generiert aus ADO Epics. Letzter Sync: ${syncedAt}`,
        "> Nicht manuell bearbeiten -- wird beim naechsten Sync ueberschrieben.",
        ""
    ];

    for (const epic of domain.epics) {
        lines.push("---");
        lines.push("");
        lines.push(`## ${epic.title} (ADO [#${epic.id}](${epic.url}))`);
        lines.push("");
        lines.push(`**Status:** ${epic.state} | **Area:** ${epic.areaPath}`);

        if (epic.tags) {
            lines.push(`**Tags:** ${epic.tags}`);
        }

        if (epic.description) {
            lines.push("");
            lines.push("**Beschreibung:**");
            lines.push("");
            lines.push(epic.description);
        }

        if (epic.acceptanceCriteria) {
            lines.push("");
            lines.push("**Akzeptanzkriterien:**");
            lines.push("");
            lines.push(epic.acceptanceCriteria);
        }

        if (epic.features.length > 0) {
            lines.push("");
            lines.push("### Features");
            lines.push("");
            lines.push("| # | Feature | ADO # | Status | Beschreibung |");
            lines.push("|---|---------|-------|--------|--------------|");

            epic.features.forEach((feature, idx) => {
                const desc = truncate(feature.description, 200);
                lines.push(`| ${idx + 1} | ${feature.title} | #${feature.id} | ${feature.state} | ${desc} |`);
            });
        } else {
            lines.push("");
            lines.push("*Keine Features zugeordnet.*");
        }

        lines.push("");
    }

    return lines.join("\n");
}

function truncate(text: string, maxLen: number): string {
    const singleLine = text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
    if (singleLine.length <= maxLen) return singleLine;
    return singleLine.slice(0, maxLen - 3) + "...";
}

export function writeDomainFiles(files: Map<string, string>, outputDir: string, dryRun: boolean): void {
    if (!dryRun) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const [filename, content] of files) {
        const filePath = path.join(outputDir, filename);
        if (dryRun) {
            console.log(`  [DRY RUN] Would write: ${filePath} (${content.length} chars)`);
        } else {
            fs.writeFileSync(filePath, content, "utf-8");
            console.log(`  Written: ${filePath}`);
        }
    }
}
