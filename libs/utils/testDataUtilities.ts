import { randomUUID } from "crypto";

let counter = 0;

export function generateTestcaseSeed(): string {
    return randomUUID();
}

export function generateUniqueDossierId(seed?: string, prefix: string = "KVTest"): string {
    const actualSeed = seed || randomUUID();

    console.log(`[DossierID] Seed: ${actualSeed}`);

    const hash = seedToHash(actualSeed);

    return `${prefix}_${hash}_${counter++}`;
}

export function seedToHash(seed: string): string {
    // Simple hash function (deterministic)
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).substring(0, 8);
}

/**
 * Converts DD.MM.YYYY to ISO format YYYY-MM-DDT00:00:00
 */
export function formatBirthdayToISO(dateStr: string): string {
    if (!dateStr || dateStr.includes("T")) return dateStr;
    const parts = dateStr.split(".");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`;
    }
    return dateStr;
}
